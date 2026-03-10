// UserDetails.js

import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

const DisplayComponent = () => {
  const followerId = useSelector(state => state.followerId.followerId);

  return (
    <View>
      <Text>User Details for Follower ID: {followerId}</Text>
    </View>
  );
};

export default DisplayComponent;
