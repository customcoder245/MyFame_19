import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../Context/AuthContext';

const BASE_URL = 'https://myfame.com/wp-json/support/v1';

interface Category {
  id: number;
  name: string;
}

interface Props {
  userId: number;
}

const ReportProblemScreen = ({}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setPageLoading(true);
      const response = await fetch(`${BASE_URL}/categories`);
      const json = await response.json();

      if (json.status === 200) {
        const formatted: Category[] = json.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
        }));
        setCategories(formatted);
      } else {
        Alert.alert('Error', json.message || 'Unable to load categories.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories.');
    } finally {
      setPageLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const submitReport = async () => {
    if (!category) {
      Alert.alert('Validation', 'Please select a category.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation', 'Please enter a description.');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', `${userId}`);
    formData.append('category_id', `${category}`);
    formData.append('description', description.trim());

    if (image) {
      formData.append('screenshot', {
        uri: image.uri,
        name: image.uri.split('/').pop() || 'image.jpg',
        type: image.mimeType || 'image/jpeg',
      } as any);
    }

    try {
      setLoading(true);
      const response = await fetch('https://myfame.com/wp-json/support/v1/report', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const json = await response.json();

      if (json.status === 200) {
        setSubmitted(true);
      } else {
        Alert.alert('Error', json.message);
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successWrapper}>
          <View style={styles.successIconBubble}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successHeader}>REPORT RECEIVED</Text>
          <Text style={styles.successSub}>
            Your submission was processed and sent directly to tracking queues.
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setSubmitted(false)}>
            <Text style={styles.secondaryButtonText}>SUBMIT ANOTHER</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Modern App Header Layout */}
        <View style={styles.headerBlock}>
          <View style={styles.accentBadge}>
            <Text style={styles.accentBadgeText}>WORKSPACE SUPPORT</Text>
          </View>
          <Text style={styles.mainTitle}>Report Issue</Text>
          <Text style={styles.mainSubtitle}>
            Submit issues with complete logs or visual data for engineering review.
          </Text>
        </View>

        {/* Input Card Container Matrix */}
        <View style={styles.componentCard}>
          <Text style={styles.fieldLabel}>01. Choose Category</Text>
          <View style={styles.pickerFieldWrapper}>
            <Picker
              selectedValue={category}
              style={styles.pickerField}
              dropdownIconColor="#000000"
              onValueChange={(value) => setCategory(value)}
            >
              <Picker.Item label="Select Category..." value={null} color="#A0AEC0" />
              {categories.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} color="#1A202C" />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.componentCard}>
          <Text style={styles.fieldLabel}>02. Issue Details</Text>
          <TextInput
            style={styles.textAreaField}
            placeholder="Describe what occurred, steps to recreate, or unexpected behaviors..."
            placeholderTextColor="#A0AEC0"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.componentCard}>
          <Text style={styles.fieldLabel}>03. Visual Capture</Text>
          {image ? (
            <View style={styles.previewImageFrame}>
              <Image source={{ uri: image.uri }} style={styles.fullPreviewAsset} />
              <TouchableOpacity style={styles.clearAssetButton} onPress={removeImage} activeOpacity={0.7}>
                <Text style={styles.clearAssetButtonText}>✕ REMOVE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.dropZoneArea} onPress={pickImage} activeOpacity={0.6}>
              <View style={styles.dropZoneInside}>
                <Text style={styles.dropZoneMainText}>ADD SCREENSHOT</Text>
                <Text style={styles.dropZoneSubText}>Image file up to 10MB formats</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Process Trigger */}
        <TouchableOpacity
          style={[styles.primarySubmitButton, loading && styles.buttonLoadingState]}
          onPress={submitReport}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primarySubmitText}>DISPATCH ERROR LOG</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportProblemScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 60,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBlock: {
    marginBottom: 36,
  },
  accentBadge: {
    backgroundColor: '#EDF2F7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  accentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
    lineHeight: 22,
  },
  componentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A202C',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  pickerFieldWrapper: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerField: {
    width: '100%',
    height: 48,
    color: '#1A202C',
  },
  textAreaField: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    minHeight: 120,
    padding: 14,
    fontSize: 14,
    color: '#1A202C',
    textAlignVertical: 'top',
  },
  dropZoneArea: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    minHeight: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropZoneInside: {
    alignItems: 'center',
  },
  dropZoneMainText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
  },
  dropZoneSubText: {
    fontSize: 11,
    color: '#A0AEC0',
    marginTop: 4,
  },
  previewImageFrame: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  fullPreviewAsset: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  clearAssetButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearAssetButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primarySubmitButton: {
    backgroundColor: '#46a5e5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonLoadingState: {
    backgroundColor: '#4A5568',
  },
  primarySubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  successWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successIconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  successHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  secondaryButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#1A202C',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});