import React, { useRef, useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { logo3 } from '../../assets2/Icons/allIcons';
import { useDispatch, useSelector } from 'react-redux';
import setAdvertiser from '../../Fetch_API/setAdvertiser'; 
import { AuthContext } from '../../Context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import fetchProfileData from '../../Fetch_API/fetchProfileData';

const SubscriptionScreen = (props) => {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile.profileData); // ✅ get advertiser flag
// safely convert advertiser string to boolean
const isAdvertiser = profileData?.advertiser === "true";

  const animatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // fetch profile data whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        dispatch(fetchProfileData(userId));
      }
    }, [userId])
  );

  // Background animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animatedValue]);

  // Logo pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const color1 = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#00BBF5', '#a3c9ff'],
  });
  const color2 = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f5faff', '#ffffff'],
  });

  const handleSubscribe = () => {
    if (!userId) {
      console.error('User ID not found!');
      return;
    }
    dispatch(setAdvertiser(userId));
 props.navigation.navigate("ADDashboardScreen") 
  };

  return (
    <Animated.View style={{ flex: 1 }}>
      <LinearGradient
        colors={[color1.__getAnimatedValue(), color2.__getAnimatedValue()]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Logo with pulse */}
        <Animated.Image
          source={logo3}
          style={[styles.logo, { transform: [{ scale: pulseAnim }] }]}
        />

        {/* Glassmorphic card */}
        <View style={styles.cardWrapper}>
          <BlurView style={styles.blur} blurType="light" blurAmount={15} />
          <LinearGradient
            colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.2)']}
            style={styles.cardOverlay}
          >
            <Text style={styles.title}>Become an Advertiser</Text>
            <Text style={styles.subtitle}>
              Unlock premium visibility and connect with more users by
              subscribing today.
            </Text>
          </LinearGradient>
        </View>

<TouchableOpacity
  style={styles.button}
  onPress={handleSubscribe}
 >
  <LinearGradient
    colors={
      isAdvertiser
        ?['#00BBF5', '#0099cc']// green if already advertiser
        : ['#00BBF5', '#0099cc'] // blue if not
    }
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.buttonInner}
  >
    <Text style={styles.buttonText}>
      {isAdvertiser ? 'Welcome Again ' : 'Subscribe Now'}
    </Text>
  </LinearGradient>
</TouchableOpacity>

      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  logo: {
    height: 200,
    width: 200,
    marginBottom: -10,
  },
  cardWrapper: {
    width: '90%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 60,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  cardOverlay: {
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a2a3a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
  },
  buttonInner: {
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SubscriptionScreen;
