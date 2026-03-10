import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SCERET } from "@env";
import { storage } from "./mmkv";
import { MMKV_KEYS } from "@constants/index";

export const generateAccessToken = async () => {
  

  console.log("firsts : ",SPOTIFY_CLIENT_ID)

  const data = {
    grant_type: "client_credentials",
    client_id: '12df560e78044391bc6c368467441183',
    client_secret: '12511b30410b4cfaae72a0650d90dbb2',
  };
  const formBody = Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  })
    .then((response) => response.json())
    .then((data) => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 55);

      
  console.log("firsts : ",data)

      storage.set(
        MMKV_KEYS.SPOTIFY_CLIENT_SCERET,
        JSON.stringify({
          access_token: data.access_token,
          token_type: data.token_type,
          expires_in: now.getTime(),
        })
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const getAlbums = async () => {
  const accessToken = storage.getString(MMKV_KEYS.SPOTIFY_CLIENT_SCERET);
  if (!accessToken) {
    return;
  }
  const { access_token } = JSON.parse(accessToken);


  return new Promise((resolve, reject) => {
    fetch("https://api.deezer.com/user/2529/playlists", {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${access_token}`,
      // },
    })
      .then((response) => response.json())
     
      .then((data) => {
        resolve(data)
        // console.log("data---1:", data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
  // const accessToken = storage.getString(MMKV_KEYS.SPOTIFY_CLIENT_SCERET);
  // if (!accessToken) {
  //   return;
  // }
  // const { access_token } = JSON.parse(accessToken);


  // return new Promise((resolve, reject) => {
  //   fetch("https://api.spotify.com/v1/browse/new-releases", {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //     },
  //   })
  //     .then((response) => response.json())
     
  //     .then((data) => {
  //       resolve(data)
  //       console.log("data---1:", data)
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // });
};

export const getTrack = async (id: string) => {
  const accessToken = storage.getString(MMKV_KEYS.SPOTIFY_CLIENT_SCERET);
  if (!accessToken) {
    return;
  }
  const { access_token } = JSON.parse(accessToken);

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${access_token}`);

  const requestOptions = {
    method: "GET",
    // headers: myHeaders,
    redirect: "follow",
  };

  return new Promise((resolve, reject) => {
    fetch(`https://api.deezer.com/playlist/${id}/tracks`, requestOptions)
      .then((response) => response.text())
      .then((result) => resolve(result))
      .catch((error) => console.error(error));
  });
  // const accessToken = storage.getString(MMKV_KEYS.SPOTIFY_CLIENT_SCERET);
  // if (!accessToken) {
  //   return;
  // }
  // const { access_token } = JSON.parse(accessToken);

  // const myHeaders = new Headers();
  // myHeaders.append("Authorization", `Bearer ${access_token}`);

  // const requestOptions = {
  //   method: "GET",
  //   headers: myHeaders,
  //   redirect: "follow",
  // };

  // return new Promise((resolve, reject) => {
  //   fetch(`https://api.spotify.com/v1/albums/${id}/tracks`, requestOptions)
  //     .then((response) => response.text())
  //     .then((result) => resolve(result))
  //     .catch((error) => console.error(error));
  // });
};


export const searchTrack = async (query: string) => {
  const accessToken = storage.getString(MMKV_KEYS.SPOTIFY_CLIENT_SCERET);
  if (!accessToken) {
    return;
  }
  const { access_token } = JSON.parse(accessToken);

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${access_token}`);

  const requestOptions = {
    method: "GET",
    // headers: myHeaders,
    redirect: "follow",
  };

  return new Promise((resolve, reject) => {
    fetch(`https://api.deezer.com/search?q=track:${query}`, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => console.error(error));
  });
  // const accessToken = storage.getString(MMKV_KEYS.SPOTIFY_CLIENT_SCERET);
  // if (!accessToken) {
  //   return;
  // }
  // const { access_token } = JSON.parse(accessToken);

  // const myHeaders = new Headers();
  // myHeaders.append("Authorization", `Bearer ${access_token}`);

  // const requestOptions = {
  //   method: "GET",
  //   headers: myHeaders,
  //   redirect: "follow",
  // };

  // return new Promise((resolve, reject) => {
  //   fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => resolve(result))
  //     .catch((error) => console.error(error));
  // });
};
