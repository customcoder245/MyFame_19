import { BASE_URL } from "./BaseURL";

const DeactivateAccountAPI = (formData) => {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/deactivateAccount/v1/deactivateAccount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
        console.log("Error is : ", err);
      });
  });
};

export default DeactivateAccountAPI;
