import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  FlatList,
  Dimensions,
  Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../Context/AuthContext';
import getAdDetails from '../../Fetch_API/getAd';
import updateAd from '../../Fetch_API/updateAd';

const screenWidth = Dimensions.get('window').width;

const EditAdScreen = ({ route, navigation }) => {
  const { userId } = useContext(AuthContext);
  const { ad_id } = route.params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [media, setMedia] = useState([]);
  const [mediaType, setMediaType] = useState('image');
  const [removedMediaUrls, setRemovedMediaUrls] = useState([]);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const categoryRef = useRef();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [adUrl, setAdUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0, width: 0 });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://myfame.com/wp-json/ads/v1/getAlladCategories');
        const json = await res.json();
        if (json.status === 200) setCategories(json.data.categories);
      } catch (err) {
        // console.log('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch ad details
  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      const data = await getAdDetails(ad_id);
      if (data.error) {
        Alert.alert('Error', data.error, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setPrice(data.price);
        setContact(data.contact_info);
        setAdUrl(data['ad-url'] || '');

        // Load existing media
        const existingMedia = data.media_details.map((m) => {
          const isVideo = m.mime_type?.includes('video') || m.url?.includes('.mp4') || m.url?.includes('.mov');
          return { 
            uri: m.url, 
            type: isVideo ? 'video' : 'image',
            fileName: m.file_name,
            existing: true
          };
        });
        setMedia(existingMedia);
      }
      setLoading(false);
    };
    fetchAd();
  }, [ad_id, navigation]);

  // Get category name
  const getCategoryName = () => {
    if (!category || !categories.length) return '';
    const foundCategory = categories.find(c => c.slug === category);
    return foundCategory ? foundCategory.name : '';
  };

  // Measure button position
  const measureCategoryPosition = () => {
    if (categoryRef.current) {
      categoryRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({ x, y: y + height, width });
      });
    }
  };

  // Toggle category dropdown
  const toggleCategoryDropdown = () => {
    if (!categoryDropdownVisible) {
      measureCategoryPosition();
    }
    setCategoryDropdownVisible(!categoryDropdownVisible);
  };

  const handleCategorySelect = (catSlug) => {
    setCategory(catSlug);
    setCategoryDropdownVisible(false);
    setErrors(prev => ({ ...prev, category: '' }));
  };

  // Close dropdown
  const closeDropdown = () => {
    setCategoryDropdownVisible(false);
  };

  // Pick multiple images
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      const imagesWithType = result.assets.map(asset => ({ ...asset, type: 'image' }));
      setMedia(prev => [...prev, ...imagesWithType]);
    }
  };

  // Pick multiple videos
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      const videosWithType = result.assets.map(asset => ({ ...asset, type: 'video' }));
      setMedia(prev => [...prev, ...videosWithType]);
    }
  };

  // Remove media by index
  const removeMedia = (index) => {
    const removed = media[index];
    if (removed.existing) {
      setRemovedMediaUrls(prev => [...prev, removed.uri]);
    }
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!category.trim()) newErrors.category = 'Category is required.';
    if (!price.trim()) newErrors.price = 'Price is required.';
    if (!contact.trim()) newErrors.contact = 'Contact info is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save changes
  const handleSave = async () => {
    if (!validateFields()) return;
    setSaving(true);

    const result = await updateAd({
      user_id: userId,
      ad_id,
      title,
      description,
      category,
      price,
      contact_info: contact,
      'ad-url': adUrl,
      media_upload: media,
      remove_media: removedMediaUrls,
    });

    setSaving(false);

    if (!result.error) {
      navigation.replace('AdvertiserDashboard');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const renderMediaItem = ({ item, index }) => (
    <View style={styles.mediaItem}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
      ) : (
        <View style={[styles.mediaThumbnail, styles.videoThumbnail]}>
          <Icon name="play-circle-outline" size={30} color="#fff" />
        </View>
      )}
      <TouchableOpacity style={styles.removeMediaButton} onPress={() => removeMedia(index)}>
        <Icon name="close-circle" size={20} color="#FF4D4D" />
      </TouchableOpacity>
    </View>
  );

  if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#00BBF5" /></View>;

  return (
    <LinearGradient colors={['#e0f7ff', '#ffffff']} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        scrollEnabled={!categoryDropdownVisible}
      >
        <Text style={styles.header}>Edit Ad</Text>

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Ad title..."
            value={title}
            onChangeText={text => { setTitle(text); setErrors(prev => ({ ...prev, title: '' })); }}
            style={styles.input}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Describe your product or service..."
            value={description}
            onChangeText={text => { setDescription(text); setErrors(prev => ({ ...prev, description: '' })); }}
            multiline
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Category Dropdown */}
        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={toggleCategoryDropdown}
            ref={categoryRef}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, !category && styles.categoryPlaceholder]}>
              {getCategoryName() || 'Select a category...'}
            </Text>
            <Icon 
              name={categoryDropdownVisible ? "chevron-up-outline" : "chevron-down-outline"} 
              size={20} 
              color="#00BBF5" 
            />
          </TouchableOpacity>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Price */}
        <View style={styles.card}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            placeholder="Enter price..."
            value={price}
            keyboardType="numeric"
            onChangeText={text => { setPrice(text); setErrors(prev => ({ ...prev, price: '' })); }}
            style={styles.input}
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.label}>Contact Info</Text>
          <TextInput
            placeholder="Email or Phone..."
            value={contact}
            onChangeText={text => { setContact(text); setErrors(prev => ({ ...prev, contact: '' })); }}
            style={styles.input}
          />
          {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
        </View>

        {/* Media Upload */}
        <View style={styles.card}>
          <Text style={styles.label}>Media Upload</Text>
          <View style={styles.mediaTypeContainer}>
            <TouchableOpacity 
              style={[styles.mediaTypeButton, mediaType === 'image' && styles.mediaTypeButtonActive]} 
              onPress={() => setMediaType('image')}
            >
              <Icon name="image-outline" size={20} color={mediaType === 'image' ? '#fff' : '#00BBF5'} />
              <Text style={[styles.mediaTypeButtonText, mediaType === 'image' && styles.mediaTypeButtonTextActive]}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.mediaTypeButton, mediaType === 'video' && styles.mediaTypeButtonActive]} 
              onPress={() => setMediaType('video')}
            >
              <Icon name="videocam-outline" size={20} color={mediaType === 'video' ? '#fff' : '#00BBF5'} />
              <Text style={[styles.mediaTypeButtonText, mediaType === 'video' && styles.mediaTypeButtonTextActive]}>Video</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.mediaButton} onPress={mediaType === 'image' ? pickImage : pickVideo}>
            <Icon name={mediaType === 'image' ? "image-outline" : "videocam-outline"} size={24} color="#00BBF5" />
            <Text style={styles.mediaButtonText}>{mediaType === 'image' ? 'Choose Image(s)' : 'Choose Video(s)'}</Text>
          </TouchableOpacity>

          {media.length > 0 && (
            <FlatList
              data={media}
              renderItem={renderMediaItem}
              keyExtractor={(_, idx) => idx.toString()}
              numColumns={3}
              contentContainerStyle={{ marginTop: 10 }}
            />
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.postButton} onPress={handleSave} disabled={saving}>
          <LinearGradient colors={['#00BBF5', '#66d9ff']} style={styles.postButtonInner}>
            <Text style={styles.postButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Category Dropdown Modal */}
      <Modal
        visible={categoryDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeDropdown}
        >
          <View style={[
            styles.dropdownModalContent,
            {
              top: dropdownPosition.y,
              left: dropdownPosition.x,
              width: dropdownPosition.width,
              maxHeight: 300,
            }
          ]}>
            {categories.length === 0 ? (
              <View style={styles.noCategories}>
                <Text style={styles.noCategoriesText}>Loading categories...</Text>
              </View>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.slug}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalDropdownItem,
                      category === item.slug && styles.modalDropdownItemSelected,
                      index === categories.length - 1 && styles.modalDropdownItemLast
                    ]}
                    onPress={() => handleCategorySelect(item.slug)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.modalDropdownText,
                      category === item.slug && styles.modalDropdownTextSelected
                    ]}>
                      {item.name}
                    </Text>
                    {category === item.slug && (
                      <Icon name="checkmark" size={18} color="#00BBF5" />
                    )}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scroll: { 
    padding: 20, 
    paddingBottom: 60 
  },
  header: { 
    fontSize: 30, 
    fontWeight: '800', 
    color: '#003366', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  card: { 
    backgroundColor: 'rgba(255,255,255,0.85)', 
    borderRadius: 25, 
    padding: 20, 
    marginBottom: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowOffset: { width: 0, height: 8 }, 
    shadowRadius: 20, 
    elevation: 8 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#003366', 
    marginBottom: 10 
  },
  // Category Styles
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7faff',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 187, 245, 0.2)',
  },
  categoryText: {
    fontSize: 16,
    color: '#003366',
    flex: 1,
  },
  categoryPlaceholder: {
    color: '#999',
  },
  input: { 
    backgroundColor: '#f7faff', 
    borderRadius: 15, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    fontSize: 16, 
    color: '#003366' 
  },
  mediaTypeContainer: { 
    flexDirection: 'row', 
    marginBottom: 15, 
    backgroundColor: '#f7faff', 
    borderRadius: 15, 
    padding: 4 
  },
  mediaTypeButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    borderRadius: 12, 
    marginHorizontal: 2 
  },
  mediaTypeButtonActive: { 
    backgroundColor: '#00BBF5' 
  },
  mediaTypeButtonText: { 
    marginLeft: 6, 
    color: '#00BBF5', 
    fontWeight: '600', 
    fontSize: 14 
  },
  mediaTypeButtonTextActive: { 
    color: '#fff' 
  },
  mediaButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#00BBF5', 
    borderRadius: 15, 
    padding: 14, 
    justifyContent: 'center', 
    backgroundColor: 'rgba(255,255,255,0.4)' 
  },
  mediaButtonText: { 
    marginLeft: 10, 
    color: '#00BBF5', 
    fontWeight: '600', 
    fontSize: 16 
  },
  mediaItem: { 
    margin: 5, 
    position: 'relative' 
  },
  mediaThumbnail: { 
    width: (screenWidth - 110) / 3, 
    height: (screenWidth - 110) / 3, 
    borderRadius: 12 
  },
  videoThumbnail: { 
    backgroundColor: '#003366', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  removeMediaButton: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: '#fff', 
    borderRadius: 12 
  },
  postButton: { 
    borderRadius: 35, 
    overflow: 'hidden', 
    marginTop: 15 
  },
  postButtonInner: { 
    paddingVertical: 18, 
    borderRadius: 35 
  },
  postButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700', 
    textAlign: 'center' 
  },
  errorText: { 
    color: 'red', 
    marginTop: 6, 
    fontSize: 13 
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownModalContent: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 187, 245, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 1001,
  },
  modalDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'white',
  },
  modalDropdownItemSelected: {
    backgroundColor: 'rgba(0, 187, 245, 0.05)',
  },
  modalDropdownItemLast: {
    borderBottomWidth: 0,
  },
  modalDropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  modalDropdownTextSelected: {
    color: '#00BBF5',
    fontWeight: '600',
  },
  noCategories: {
    padding: 20,
    alignItems: 'center',
  },
  noCategoriesText: {
    color: '#666',
    fontSize: 14,
  },
});

export default EditAdScreen;