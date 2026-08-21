// FetchInfluencerDashboard.js

import { BASE_URL } from "./BaseURL";

const FetchInfluencerDashboard = async (userId) => {
  try {
    const response = await fetch(
      `https://myfame.com/wp-json/ads/v1/getInfluencerDashboard`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          influencer_id: userId,
        },
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      return responseData.data; // Return the data object
    } else {
      console.error("Failed to fetch influencer dashboard data:", responseData);
      return { 
        error: responseData.message || "Failed to fetch dashboard data",
        // Return empty structure similar to API response
        influencer_id: userId,
        total_revenue: 0,
        monthly_revenue: 0,
        last_month_revenue: 0,
        growth_rate_percentage: 0,
        total_views: 0,
        total_clicks: 0,
        engagement_rate: "0%",
        brand_partners_count: 0,
        brand_partner_user_ids: [],
        brand_partners: [],
        ads_breakdown: []
      };
    }
  } catch (error) {
    console.error("Error fetching influencer dashboard data:", error);
    return { 
      error: "An error occurred. Please try again later.",
      influencer_id: userId,
      total_revenue: 0,
      monthly_revenue: 0,
      last_month_revenue: 0,
      growth_rate_percentage: 0,
      total_views: 0,
      total_clicks: 0,
      engagement_rate: "0%",
      brand_partners_count: 0,
      brand_partner_user_ids: [],
      brand_partners: [],
      ads_breakdown: []
    };
  }
};

export default FetchInfluencerDashboard;