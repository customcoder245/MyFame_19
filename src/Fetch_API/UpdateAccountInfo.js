import { BASE_URL } from "./BaseURL";

const UpdateAccountInfo = (formData) => {
    
    return new Promise((resolve,reject)=>{
      fetch(
         `${BASE_URL}/updateUserAccount/v1/updateUserAccount/`,
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: formData      
         } 
       )
       .then((response)=>response.json())
       .then(data=>{
         resolve(data)
       })
       .catch((err)=>{
        reject(err)
        console.log("Error is : ",err)
    })
   
       
    })
     
 
   };
   
   export default UpdateAccountInfo