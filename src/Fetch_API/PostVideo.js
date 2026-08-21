const PostVideo = (formData) => {
  return new Promise((resolve, reject) => {
    fetch(
      "https://myfame.com/wp-json/audiovideo/v1/audioVideoData/",
      {
        method: "POST",
        // REMOVE the Content-Type header - let fetch set it automatically
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        body: formData      
      } 
    )
    .then((response) => {
      // console.log("Response status:", response.status);
      // console.log("Response headers:", response.headers);
      return response.json();
    })
    .then(data => {
      // console.log("Create Post Data : ", data);
      resolve(data);
    })
    .catch((err) => {
      // console.log("PostVideo API Error:", err);
      reject(err);
    });
  });
};

export default PostVideo;