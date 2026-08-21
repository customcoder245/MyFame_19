import axios from 'axios';

export const fetchTrendingTracks = async () => {
  try {
    const response = await axios.get('https://api.deezer.com/playlist/160504851/tracks')
    // console.log("hello working" , response)
    return response.data.data;
  
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
}
