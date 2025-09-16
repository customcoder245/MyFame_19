import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setError } from "../redux/profileSlice"; // Adjust path as per your project structure
import { BASE_URL } from "./BaseURL";
import { setFollowersCount } from "../redux/action";
import { setFollowingCount } from "../redux/action";
import fetchProfileData from "./fetchProfileData";

const MyFollowerData = ({ onFetched }) => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData);
  const followerId = useSelector((state) => state.followerId.followerId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading()); // Set loading state before fetching data

        const response = await fetch(
          `${BASE_URL}/myfollowers/v1/myFollowersData/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: profileData.id,
              follower_id: followerId,
            }),
          }
        );

        const responseData = await response.json();




        if (response.ok) {
          console.log("Data fetch successful:", responseData);
          // Handle successful response as needed
          onFetched(); // Notify parent component that data has been fetched
          const followersCount = setFollowersCount(responseData.data.login_user_follower_list.length)
          dispatch(followersCount);
  
          const followingCount =setFollowingCount(responseData.data.login_user_following_list.length)
          dispatch(followingCount);
          console.log({followingCount})
        } else {
          console.error("Error:", responseData);
          dispatch(setError("Failed to fetch profile data"));
        }
      } catch (error) {
        console.error("Error:", error);
        dispatch(setError("An error occurred. Please try again later."));
      }
    };

    if (followerId) {
      fetchData(); // Fetch data only when followerId is available
    }
  }, [profileData.id, followerId, dispatch, onFetched]);

  return null; // MyFollowerData doesn't render anything directly
};

export default MyFollowerData;
