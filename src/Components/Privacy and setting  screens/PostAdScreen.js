import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions,
  Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../Context/AuthContext';
import createUserAd from '../../Fetch_API/createUserAd';
import { useStripe } from '@stripe/stripe-react-native';

const PostAdScreen = ({ navigation }) => {
  const { userId } = useContext(AuthContext);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [whichSite, setWhichSite] = useState('myfame');
  const [whichSiteDropdownVisible, setWhichSiteDropdownVisible] = useState(false);
  const [adType, setAdType] = useState('free_ad');
  const [adTypeDropdownVisible, setAdTypeDropdownVisible] = useState(false);
  const [priceCurrencyDropdownVisible, setPriceCurrencyDropdownVisible] = useState(false);
  const [adAmountCurrencyDropdownVisible, setAdAmountCurrencyDropdownVisible] = useState(false);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  
  const [adUrl, setAdUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [adAmount, setAdAmount] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [priceCurrency, setPriceCurrency] = useState('$-USD');
  const [adAmountCurrency, setAdAmountCurrency] = useState('$-USD');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mediaType, setMediaType] = useState('image');
  const [selectedMedia, setSelectedMedia] = useState([]);

  // Refs for measuring positions
  const whichSiteRef = useRef();
  const adTypeRef = useRef();
  const priceCurrencyRef = useRef();
  const adAmountCurrencyRef = useRef();
  const categoryRef = useRef();
  
  // Dropdown positions
  const [dropdownPositions, setDropdownPositions] = useState({
    whichSite: { x: 0, y: 0, width: 0 },
    adType: { x: 0, y: 0, width: 0 },
    priceCurrency: { x: 0, y: 0, width: 0 },
    adAmountCurrency: { x: 0, y: 0, width: 0 },
    category: { x: 0, y: 0, width: 0 }
  });

  useEffect(() => {
    fetch('https://myfame.com/wp-json/ads/v1/getAlladCategories')
      .then(res => res.json())
      .then(json => { 
        if (json.status === 200) setCategories(json.data.categories); 
      })
      .catch(err => console.log('Error fetching categories:', err));

    fetch('https://myfame.com/wp-json/currency/v1/getCurrencySymbolsNew')
      .then(res => res.json())
      .then(json => {
        if (json.status === 200 && json.data && json.data.currencies) setCurrencies(json.data.currencies);
      })
      .catch(err => console.log('Error fetching currencies:', err));
  }, []);

  // Get category name safely
  const getCategoryName = () => {
    if (!category || !categories.length) return '';
    const foundCategory = categories.find(c => c.slug === category);
    return foundCategory ? foundCategory.name : '';
  };

  // Measure button position for dropdown
  const measureButtonPosition = (ref, dropdownName) => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setDropdownPositions(prev => ({
          ...prev,
          [dropdownName]: { x, y: y + height, width }
        }));
      });
    }
  };

  // Toggle functions for dropdowns
  const toggleWhichSiteDropdown = () => {
    if (!whichSiteDropdownVisible) {
      measureButtonPosition(whichSiteRef, 'whichSite');
    }
    setWhichSiteDropdownVisible(!whichSiteDropdownVisible);
    setAdTypeDropdownVisible(false);
    setPriceCurrencyDropdownVisible(false);
    setAdAmountCurrencyDropdownVisible(false);
    setCategoryDropdownVisible(false);
  };

  const toggleAdTypeDropdown = () => {
    if (!adTypeDropdownVisible) {
      measureButtonPosition(adTypeRef, 'adType');
    }
    setAdTypeDropdownVisible(!adTypeDropdownVisible);
    setWhichSiteDropdownVisible(false);
    setPriceCurrencyDropdownVisible(false);
    setAdAmountCurrencyDropdownVisible(false);
    setCategoryDropdownVisible(false);
  };

  const togglePriceCurrencyDropdown = () => {
    if (!priceCurrencyDropdownVisible) {
      measureButtonPosition(priceCurrencyRef, 'priceCurrency');
    }
    setPriceCurrencyDropdownVisible(!priceCurrencyDropdownVisible);
    setWhichSiteDropdownVisible(false);
    setAdTypeDropdownVisible(false);
    setAdAmountCurrencyDropdownVisible(false);
    setCategoryDropdownVisible(false);
  };

  const toggleAdAmountCurrencyDropdown = () => {
    if (!adAmountCurrencyDropdownVisible) {
      measureButtonPosition(adAmountCurrencyRef, 'adAmountCurrency');
    }
    setAdAmountCurrencyDropdownVisible(!adAmountCurrencyDropdownVisible);
    setWhichSiteDropdownVisible(false);
    setAdTypeDropdownVisible(false);
    setPriceCurrencyDropdownVisible(false);
    setCategoryDropdownVisible(false);
  };

  const toggleCategoryDropdown = () => {
    if (!categoryDropdownVisible) {
      measureButtonPosition(categoryRef, 'category');
    }
    setCategoryDropdownVisible(!categoryDropdownVisible);
    setWhichSiteDropdownVisible(false);
    setAdTypeDropdownVisible(false);
    setPriceCurrencyDropdownVisible(false);
    setAdAmountCurrencyDropdownVisible(false);
  };

  const handleWhichSiteSelect = (site) => {
    setWhichSite(site);
    setWhichSiteDropdownVisible(false);
  };

  const handleAdTypeSelect = (type) => {
    setAdType(type);
    setAdTypeDropdownVisible(false);
  };

  const handlePriceCurrencySelect = (currency) => {
    setPriceCurrency(currency);
    setPriceCurrencyDropdownVisible(false);
  };

  const handleAdAmountCurrencySelect = (currency) => {
    setAdAmountCurrency(currency);
    setAdAmountCurrencyDropdownVisible(false);
  };

  const handleCategorySelect = (catSlug) => {
    setCategory(catSlug);
    setCategoryDropdownVisible(false);
  };

  // Get currency symbol
  const getCurrencySymbol = (currency) => {
    return currency ? currency.split('-')[0] : '$';
  };

  const getWhichSiteLabel = () => {
    switch(whichSite) {
      case 'myfame': return 'MyFame Only';
      case 'rofhub': return 'RofHub Only';
      case 'both_site': return 'Both Apps';
      default: return 'Select Platform';
    }
  };

  const getAdTypeLabel = () => {
    switch(adType) {
      case 'free_ad': return 'Free Ad';
      case 'paid_ad': return 'Paid Ad';
      default: return 'Select Ad Type';
    }
  };

  const getWhichSiteIcon = () => {
    switch(whichSite) {
      case 'myfame': return 'phone-portrait-outline';
      case 'rofhub': return 'tablet-portrait-outline';
      case 'both_site': return 'apps-outline';
      default: return 'globe-outline';
    }
  };

  const getAdTypeIcon = () => {
    switch(adType) {
      case 'free_ad': return 'card-outline';
      case 'paid_ad': return 'cash-outline';
      default: return 'options-outline';
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedMedia(prev => [...prev, ...result.assets.map(asset => ({ ...asset, type: 'image' }))]);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedMedia(prev => [...prev, ...result.assets.map(asset => ({ ...asset, type: 'video' }))]);
    }
  };

  const removeMedia = index => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!contact.trim()) newErrors.contact = 'Contact info is required';
    if (selectedMedia.length === 0) newErrors.media = 'Please upload at least one image or video';
    if (adType === 'paid_ad' && !adAmount.trim()) newErrors.adAmount = 'Ad amount is required for paid ads';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePostAd = async () => {
    if (!validateFields()) return;
    setLoading(true);

    try {
      const priceSymbol = getCurrencySymbol(priceCurrency);
      const adAmountSymbol = getCurrencySymbol(adAmountCurrency);
      const priceWithSymbol = price ? priceSymbol + price : undefined;

      const basePayload = {
        user_id: userId,
        title,
        description,
        category,
        contact_info: contact,
        ad_type: adType,
        media_upload: selectedMedia,
        ad_url: adUrl,
        which_site: whichSite,
      };
      
      if (priceWithSymbol) {
        basePayload.price = priceWithSymbol;
      }

      const response = await createUserAd(
        adType === 'paid_ad'
          ? { ...basePayload, ad_amount: adAmount, ad_amount_currency_symbol: adAmountSymbol }
          : basePayload
      );

      if (adType === 'free_ad') {
        if (response.status === 200 || response.status === 201) {
          navigation.replace('AdvertiserDashboard');
        } else {
          alert(response.message || 'Unable to create ad.');
        }
        return;
      }

      let siteResponse = null;
      if (response && response.responses) {
        siteResponse = response.responses[whichSite.toLowerCase()];
        
        if ((!siteResponse || !siteResponse.client_secret)) {
          const keys = Object.keys(response.responses);
          for (let key of keys) {
            if (response.responses[key] && response.responses[key].client_secret) {
              siteResponse = response.responses[key];
              break;
            }
          }
        }
      }

      if (!siteResponse) {
        console.log('Full response:', response);
        alert('Unable to process payment: No site response.');
        return;
      }

      if (siteResponse.status === 202 && siteResponse.client_secret) {
        const clientSecret = siteResponse.client_secret;
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: 'My App',
        });
        if (initError) {
          alert(initError.message);
          return;
        }

        const { error: paymentError } = await presentPaymentSheet();
        if (paymentError) {
          alert(paymentError.message);
          return;
        }

        navigation.replace('AdvertiserDashboard');
      } else {
        alert(siteResponse.message || 'Unable to process payment.');
      }
    } catch (err) {
      console.error('Post ad error:', err);
      alert(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setWhichSiteDropdownVisible(false);
    setAdTypeDropdownVisible(false);
    setPriceCurrencyDropdownVisible(false);
    setAdAmountCurrencyDropdownVisible(false);
    setCategoryDropdownVisible(false);
  };

  return (
    <LinearGradient colors={['#e0f7ff', '#ffffff']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#00BBF5" />
        </View>
      )}

      <ScrollView 
        contentContainerStyle={styles.scroll}
        scrollEnabled={!whichSiteDropdownVisible && !adTypeDropdownVisible && !priceCurrencyDropdownVisible && !adAmountCurrencyDropdownVisible && !categoryDropdownVisible}
      >
        <Text style={styles.header}>Create New Ad</Text>

        {/* Ad Type Dropdown */}
        <View style={styles.card}>
          <Text style={styles.label}>Ad Type</Text>
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              style={[
                styles.appSelectorButton,
                adTypeDropdownVisible && styles.appSelectorButtonActive
              ]}
              onPress={toggleAdTypeDropdown}
              activeOpacity={0.7}
              ref={adTypeRef}
            >
              <Icon name={getAdTypeIcon()} size={20} color="#00BBF5" />
              <Text style={styles.appSelectorText}>{getAdTypeLabel()}</Text>
              <Icon 
                name={adTypeDropdownVisible ? "chevron-up-outline" : "chevron-down-outline"} 
                size={16} 
                color="#00BBF5" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Ad On Dropdown */}
        <View style={styles.card}>
          <Text style={styles.label}>Post Ad On</Text>
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              style={[
                styles.appSelectorButton,
                whichSiteDropdownVisible && styles.appSelectorButtonActive
              ]}
              onPress={toggleWhichSiteDropdown}
              activeOpacity={0.7}
              ref={whichSiteRef}
            >
              <Icon name={getWhichSiteIcon()} size={20} color="#00BBF5" />
              <Text style={styles.appSelectorText}>{getWhichSiteLabel()}</Text>
              <Icon 
                name={whichSiteDropdownVisible ? "chevron-up-outline" : "chevron-down-outline"} 
                size={16} 
                color="#00BBF5" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput placeholder="Ad title..." value={title} onChangeText={setTitle} style={styles.input} />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Describe your product/service..."
            value={description}
            onChangeText={setDescription}
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
              {getCategoryName() || 'Select category...'}
            </Text>
            <Icon 
              name={categoryDropdownVisible ? "chevron-up-outline" : "chevron-down-outline"} 
              size={20} 
              color="#00BBF5" 
            />
          </TouchableOpacity>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Ad URL */}
        <View style={styles.card}>
          <Text style={styles.label}>Ad URL (optional)</Text>
          <TextInput placeholder="Enter URL..." value={adUrl} onChangeText={setAdUrl} style={styles.input} />
        </View>

        {/* Price with Currency Dropdown */}
        <View style={styles.card}>
          <Text style={styles.label}>Price</Text>
          <View style={styles.priceContainer}>
            <View style={styles.currencySelectorContainer}>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={togglePriceCurrencyDropdown}
                ref={priceCurrencyRef}
              >
                <Text style={styles.currencyText}>{getCurrencySymbol(priceCurrency)}</Text>
                <Icon 
                  name={priceCurrencyDropdownVisible ? "chevron-up-outline" : "chevron-down-outline"} 
                  size={16} 
                  color="#00BBF5" 
                />
              </TouchableOpacity>
            </View>
            
            <TextInput
              placeholder="Enter price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.priceInput}
            />
          </View>
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        {/* Paid Ad Amount with Currency Dropdown */}
        {adType === 'paid_ad' && (
          <View style={styles.card}>
            <Text style={styles.label}>Ad Amount</Text>
            <View style={styles.priceContainer}>
              <View style={styles.currencySelectorContainer}>
                <TouchableOpacity
                  style={styles.currencySelector}
                  onPress={toggleAdAmountCurrencyDropdown}
                  ref={adAmountCurrencyRef}
                >
                  <Text style={styles.currencyText}>{getCurrencySymbol(adAmountCurrency)}</Text>
                  <Icon 
                    name={adAmountCurrencyDropdownVisible ? "chevron-up-outline" : "chevron-down-outline"} 
                    size={16} 
                    color="#00BBF5" 
                  />
                </TouchableOpacity>
              </View>
              
              <TextInput
                placeholder="Enter amount"
                value={adAmount}
                onChangeText={setAdAmount}
                keyboardType="numeric"
                style={styles.priceInput}
              />
            </View>
            {errors.adAmount && <Text style={styles.errorText}>{errors.adAmount}</Text>}
          </View>
        )}

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.label}>Contact Info</Text>
          <TextInput placeholder="Email or Phone..." value={contact} onChangeText={setContact} style={styles.input} />
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

          {errors.media && <Text style={styles.errorText}>{errors.media}</Text>}

          {selectedMedia.length > 0 && (
            <FlatList
              data={selectedMedia}
              renderItem={({ item, index }) => (
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
              )}
              keyExtractor={(_, idx) => idx.toString()}
              numColumns={3}
              contentContainerStyle={{ marginTop: 10 }}
            />
          )}
        </View>

        {/* Post Button */}
        <TouchableOpacity style={styles.postButton} onPress={handlePostAd}>
          <LinearGradient colors={['#00BBF5', '#66d9ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.postButtonInner}>
            <Text style={styles.postButtonText}>Post Ad</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Modals - These appear above everything */}
      {/* Ad Type Dropdown Modal */}
      <Modal
        visible={adTypeDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAllDropdowns}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeAllDropdowns}
        >
          <View style={[
            styles.dropdownModalContent,
            {
              top: dropdownPositions.adType.y,
              left: dropdownPositions.adType.x,
              width: dropdownPositions.adType.width,
            }
          ]}>
            <TouchableOpacity
              style={[
                styles.modalDropdownItem,
                adType === 'free_ad' && styles.modalDropdownItemSelected
              ]}
              onPress={() => handleAdTypeSelect('free_ad')}
              activeOpacity={0.7}
            >
              <Icon name="card-outline" size={18} color={adType === 'free_ad' ? '#00BBF5' : '#666'} />
              <Text style={[
                styles.modalDropdownItemText,
                adType === 'free_ad' && styles.modalDropdownItemTextSelected
              ]}>
                Free Ad
              </Text>
              {adType === 'free_ad' && (
                <Icon name="checkmark" size={18} color="#00BBF5" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalDropdownItem,
                adType === 'paid_ad' && styles.modalDropdownItemSelected,
                styles.modalDropdownItemLast
              ]}
              onPress={() => handleAdTypeSelect('paid_ad')}
              activeOpacity={0.7}
            >
              <Icon name="cash-outline" size={18} color={adType === 'paid_ad' ? '#00BBF5' : '#666'} />
              <Text style={[
                styles.modalDropdownItemText,
                adType === 'paid_ad' && styles.modalDropdownItemTextSelected
              ]}>
                Paid Ad
              </Text>
              {adType === 'paid_ad' && (
                <Icon name="checkmark" size={18} color="#00BBF5" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Which Site Dropdown Modal */}
      <Modal
        visible={whichSiteDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAllDropdowns}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeAllDropdowns}
        >
          <View style={[
            styles.dropdownModalContent,
            {
              top: dropdownPositions.whichSite.y,
              left: dropdownPositions.whichSite.x,
              width: dropdownPositions.whichSite.width,
            }
          ]}>
            <TouchableOpacity
              style={[
                styles.modalDropdownItem,
                whichSite === 'myfame' && styles.modalDropdownItemSelected
              ]}
              onPress={() => handleWhichSiteSelect('myfame')}
              activeOpacity={0.7}
            >
              <Icon name="phone-portrait-outline" size={18} color={whichSite === 'myfame' ? '#00BBF5' : '#666'} />
              <Text style={[
                styles.modalDropdownItemText,
                whichSite === 'myfame' && styles.modalDropdownItemTextSelected
              ]}>
                MyFame Only
              </Text>
              {whichSite === 'myfame' && (
                <Icon name="checkmark" size={18} color="#00BBF5" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalDropdownItem,
                whichSite === 'rofhub' && styles.modalDropdownItemSelected
              ]}
              onPress={() => handleWhichSiteSelect('rofhub')}
              activeOpacity={0.7}
            >
              <Icon name="tablet-portrait-outline" size={18} color={whichSite === 'rofhub' ? '#00BBF5' : '#666'} />
              <Text style={[
                styles.modalDropdownItemText,
                whichSite === 'rofhub' && styles.modalDropdownItemTextSelected
              ]}>
                RofHub Only
              </Text>
              {whichSite === 'rofhub' && (
                <Icon name="checkmark" size={18} color="#00BBF5" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalDropdownItem,
                whichSite === 'both_site' && styles.modalDropdownItemSelected,
                styles.modalDropdownItemLast
              ]}
              onPress={() => handleWhichSiteSelect('both_site')}
              activeOpacity={0.7}
            >
              <Icon name="apps-outline" size={18} color={whichSite === 'both_site' ? '#00BBF5' : '#666'} />
              <Text style={[
                styles.modalDropdownItemText,
                whichSite === 'both_site' && styles.modalDropdownItemTextSelected
              ]}>
                Both Apps
              </Text>
              {whichSite === 'both_site' && (
                <Icon name="checkmark" size={18} color="#00BBF5" />
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Price Currency Dropdown Modal */}
      <Modal
        visible={priceCurrencyDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAllDropdowns}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeAllDropdowns}
        >
          <View style={[
            styles.currencyDropdownModalContent,
            {
              top: dropdownPositions.priceCurrency.y,
              left: dropdownPositions.priceCurrency.x,
              width: 120,
              maxHeight: 200,
            }
          ]}>
            <FlatList
              data={currencies}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.modalCurrencyDropdownItem,
                    priceCurrency === item && styles.modalCurrencyDropdownItemSelected,
                    index === currencies.length - 1 && styles.modalCurrencyDropdownItemLast
                  ]}
                  onPress={() => handlePriceCurrencySelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.modalCurrencyDropdownText,
                    priceCurrency === item && styles.modalCurrencyDropdownTextSelected
                  ]}>
                    {item}
                  </Text>
                  {priceCurrency === item && (
                    <Icon name="checkmark" size={18} color="#00BBF5" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Ad Amount Currency Dropdown Modal */}
      <Modal
        visible={adAmountCurrencyDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAllDropdowns}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeAllDropdowns}
        >
          <View style={[
            styles.currencyDropdownModalContent,
            {
              top: dropdownPositions.adAmountCurrency.y,
              left: dropdownPositions.adAmountCurrency.x,
              width: 120,
              maxHeight: 200,
            }
          ]}>
            <FlatList
              data={currencies}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.modalCurrencyDropdownItem,
                    adAmountCurrency === item && styles.modalCurrencyDropdownItemSelected,
                    index === currencies.length - 1 && styles.modalCurrencyDropdownItemLast
                  ]}
                  onPress={() => handleAdAmountCurrencySelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.modalCurrencyDropdownText,
                    adAmountCurrency === item && styles.modalCurrencyDropdownTextSelected
                  ]}>
                    {item}
                  </Text>
                  {adAmountCurrency === item && (
                    <Icon name="checkmark" size={18} color="#00BBF5" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Category Dropdown Modal */}
      <Modal
        visible={categoryDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAllDropdowns}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeAllDropdowns}
        >
          <View style={[
            styles.categoryDropdownModalContent,
            {
              top: dropdownPositions.category.y,
              left: dropdownPositions.category.x,
              width: dropdownPositions.category.width,
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
                      styles.modalCategoryDropdownItem,
                      category === item.slug && styles.modalCategoryDropdownItemSelected,
                      index === categories.length - 1 && styles.modalCategoryDropdownItemLast
                    ]}
                    onPress={() => handleCategorySelect(item.slug)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.modalCategoryDropdownText,
                      category === item.slug && styles.modalCategoryDropdownTextSelected
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
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#003366', 
    marginBottom: 10 
  },
  selectorContainer: {
    position: 'relative',
  },
  appSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 187, 245, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 187, 245, 0.15)',
    justifyContent: 'space-between',
    width: '100%',
  },
  appSelectorButtonActive: {
    backgroundColor: 'rgba(0, 187, 245, 0.15)',
    borderColor: 'rgba(0, 187, 245, 0.3)',
  },
  appSelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00BBF5',
    marginHorizontal: 8,
    flex: 1,
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySelectorContainer: {
    position: 'relative',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7faff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    marginRight: 10,
    minWidth: 60,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 187, 245, 0.2)',
  },
  currencyText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '600',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#f7faff',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#003366',
  },
  errorText: { 
    color: 'red', 
    marginTop: 6, 
    fontSize: 13 
  },
  loaderOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(255,255,255,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1000 
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
    width: (Dimensions.get('window').width - 110) / 3, 
    height: (Dimensions.get('window').width - 110) / 3, 
    borderRadius: 12 
  },
  videoThumbnail: { 
    backgroundColor: '#003366', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 12 
  },
  removeMediaButton: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    backgroundColor: '#fff', 
    borderRadius: 12 
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'white',
    height: 48,
    minWidth: 150,
  },
  modalDropdownItemSelected: {
    backgroundColor: 'rgba(0, 187, 245, 0.05)',
  },
  modalDropdownItemLast: {
    borderBottomWidth: 0,
  },
  modalDropdownItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 10,
  },
  modalDropdownItemTextSelected: {
    color: '#00BBF5',
    fontWeight: '600',
  },
  currencyDropdownModalContent: {
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
  modalCurrencyDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'white',
    minWidth: 120,
  },
  modalCurrencyDropdownItemSelected: {
    backgroundColor: 'rgba(0, 187, 245, 0.05)',
  },
  modalCurrencyDropdownItemLast: {
    borderBottomWidth: 0,
  },
  modalCurrencyDropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  modalCurrencyDropdownTextSelected: {
    color: '#00BBF5',
    fontWeight: '600',
  },
  categoryDropdownModalContent: {
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
  modalCategoryDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'white',
  },
  modalCategoryDropdownItemSelected: {
    backgroundColor: 'rgba(0, 187, 245, 0.05)',
  },
  modalCategoryDropdownItemLast: {
    borderBottomWidth: 0,
  },
  modalCategoryDropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  modalCategoryDropdownTextSelected: {
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

export default PostAdScreen;