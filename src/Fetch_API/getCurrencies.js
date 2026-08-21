import { BASE_URL } from "./BaseURL";

const getCurrencies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/currency/v1/getCurrencySymbols`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();

    if (response.ok && responseData.status === 200) {
      return responseData.data.symbols; // Array of symbols
    } else {
      console.error("Failed to fetch currencies:", responseData);
      return [];
    }
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return [];
  }
};

export default getCurrencies;
