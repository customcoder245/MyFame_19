import { BASE_URL } from "./BaseURL";

const MergeVideoApi = (formData) => {
    
    return new Promise((resolve,reject)=>{
      fetch(
         `${BASE_URL}/audiovideo_merge/v1/audiovideo_merge/`,
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
        //  console.log("MergedVideo data : ",data)
         resolve(data)
       })
       .catch((err)=>{
        reject(err)
        // console.log("Error is : ",err)
    })
   
       
    })
     
 
   };
   
   export default MergeVideoApi