import { BASE_URL } from './BaseURL';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const createUserAd = async ({
  user_id,
  title,
  description,
  category,
  contact_info,
  ad_type,
  ad_amount,
  ad_amount_currency_symbol,
  media_upload,
  paymentIntentId,
  ad_url,
  price,
  which_site,
}) => {
  try {
    const formData = new FormData();

    // Append all fields
    formData.append('user_id', user_id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('contact_info', contact_info);
    formData.append('ad_type', ad_type);
    formData.append('which_site', which_site);

    if (price !== undefined) formData.append('price', price);

    if (ad_type === 'paid_ad') {
      formData.append('ad_amount', ad_amount);
      formData.append('ad_amount_currency_symbol', ad_amount_currency_symbol);
      if (paymentIntentId) formData.append('payment_intent_id', paymentIntentId);
    }

    if (ad_url) formData.append('ad_url', ad_url);

    // Handle media uploads
    if (media_upload && media_upload.length > 0) {
      for (let i = 0; i < media_upload.length; i++) {
        const file = media_upload[i];
        if (!file.uri) continue;

        let uri = file.uri;

        if (Platform.OS === 'android' && uri.startsWith('content://')) {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          const dest = `${FileSystem.cacheDirectory}${file.fileName || `media_${i}`}`;
          await FileSystem.copyAsync({ from: uri, to: dest });
          uri = dest;
        }

        if (Platform.OS === 'android' && !uri.startsWith('file://')) uri = 'file://' + uri;

        const type = file.type === 'image' ? 'image/jpeg' : file.type === 'video' ? 'video/mp4' : 'application/octet-stream';
        const name = file.fileName || (file.type === 'image' ? `image_${i}.jpg` : `video_${i}.mp4`);

        formData.append('media_upload[]', { uri, name, type });
      }
    }

    const response = await fetch(`${BASE_URL}/ads/v1/create-ad-combined`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { status: 'error', message: data.message || 'Failed to create ad' };
    }

    return data; // Return API response regardless of message
  } catch (err) {
    console.error('Create Ad Exception:', err);
    return { status: 'error', message: err.message || 'Network error' };
  }
};

export default createUserAd;
