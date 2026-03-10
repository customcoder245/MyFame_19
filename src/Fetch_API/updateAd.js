import { BASE_URL } from "./BaseURL";

const updateAd = async ({
  user_id,
  ad_id,
  title,
  description,
  category,
  price,
  contact_info,
  media_upload = [],
  remove_media = [],
  'ad-url': adUrl,
}) => {
  try {
    const formData = new FormData();

    formData.append('user_id', String(user_id));
    formData.append('ad_id', String(ad_id));
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (price) formData.append('price', price);
    if (contact_info) formData.append('contact_info', contact_info);
    formData.append('ad-url', adUrl || '');

    // Add removed media URLs
    remove_media.forEach((url, i) => formData.append(`remove_media[${i}]`, url));

    // Add new media files
    media_upload.forEach((m, index) => {
      if (!m.existing) {
        formData.append('media_upload[]', {
          uri: m.uri,
          name: m.fileName || `media_${index}.${m.type === 'video' ? 'mp4' : 'jpg'}`,
          type: m.type === 'video' ? 'video/mp4' : 'image/jpeg',
        });
      }
    });

    const response = await fetch(`${BASE_URL}/ads/v1/updateAd`, {
      method: 'POST',
      body: formData,
    });

    const responseData = await response.json();

    if (response.ok && responseData.status === 200) {
      return responseData;
    } else {
      return { error: responseData.message || 'Failed to update ad' };
    }
  } catch (error) {
    console.error('Error updating ad:', error);
    return { error: 'An error occurred. Please try again later.' };
  }
};

export default updateAd;
