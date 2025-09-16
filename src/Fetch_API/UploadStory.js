import { BASE_URL } from "./BaseURL";

const UploadStory = (formData) => {
    
    return new Promise((resolve,reject)=>{
      fetch(
         `${BASE_URL}/uploadstory/v1/uploadStory/`,
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
         console.log("upload story data : ",data)
         resolve(data)
       })
       .catch((err)=>console.log("Error is : ",err))
   
       
    })
     
 
   };
   
   export default UploadStory