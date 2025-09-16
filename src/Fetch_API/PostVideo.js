
const PostVideo = (formData) => {
    
  
   return new Promise((resolve,reject)=>{
     fetch(
        "https://myfame.com/wp-json/audiovideo/v1/audioVideoData/",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData      
        } 
      )
      .then((response)=>response.json())
      .then(data=>{
        console.log("Create Post Data : ",data)
        resolve(data)
      })
      .catch((err)=>reject(err))
  
      
   })
    

  };
  
  export default PostVideo