import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logo3 } from '../../assets2/Icons/allIcons';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import SetInfluencerApi from '../../Fetch_API/SetInfluencerApi';
import CheckInfluencerApi from '../../Fetch_API/CheckInfluencerApi';
import { AuthContext } from '../../Context/AuthContext';

const SetInfluencerScreen = (props) => {
  const navigation = useNavigation();
  const { userId } = useContext(AuthContext);

  const [isInfluencer, setIsInfluencer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [influencerData, setInfluencerData] = useState(null);
  const [error, setError] = useState(null);

  // Function to check influencer status
  const checkInfluencerStatus = async () => {
    if (!userId) {
      setError("User ID not found");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Checking influencer status for user_id:", userId);
      const response = await CheckInfluencerApi(userId);
      
      console.log("API Response:", response);
      
      if (response?.status === 200 && response?.data?.influencer_status === "true") {
        setIsInfluencer(true);
        setInfluencerData(response.data);
        console.log("User is an influencer");
      } else if (response?.status === 200 && response?.data?.influencer_status === "false") {
        setIsInfluencer(false);
        setInfluencerData(null);
        console.log("User is not an influencer");
      } else {
        setIsInfluencer(false);
        setInfluencerData(null);
        setError(response?.error || "Failed to check influencer status");
        console.log("Influencer check failed:", response);
      }
    } catch (error) {
      console.error("Error checking influencer status:", error);
      setIsInfluencer(false);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check influencer status on component mount and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkInfluencerStatus();
      return () => {
        // Cleanup if needed
      };
    }, [userId])
  );

  const handleSetInfluencer = async () => {
    Alert.alert(
      "Set as Influencer",
      "Are you sure you want to set up as an influencer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            const response = await SetInfluencerApi(userId);

            if (response?.status === 200) {
              // Update local state
              setIsInfluencer(true);
              // Refresh influencer data
              await checkInfluencerStatus();
              // Show success message
              Alert.alert("Success", "You are now an influencer!");
              // Navigate to analytics WITH userId parameter
              navigation.navigate("InfluencerAnalyticsScreen", { userId });
            } else {
              Alert.alert("Error", response?.error || "Something went wrong");
            }
          },
        },
      ]
    );
  };

  const handleWelcomeBack = () => {
    // Navigate to influencer analytics WITH userId parameter
    navigation.navigate("InfluencerAnalyticsScreen", { userId });
  };

  // Show loading state
  if (isLoading) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#e6f7ff', '#f0f9ff']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <ActivityIndicator size="large" color="#00BBF5" />
          <Text style={styles.loadingText}>Checking influencer status...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Show error state
  if (error && !isLoading) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#e6f7ff', '#f0f9ff']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <View style={styles.errorCard}>
            <MaterialCommunityIcons 
              name="alert-circle" 
              size={60} 
              color="#EF4444" 
            />
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={checkInfluencerStatus}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f8fafc', '#e6f7ff', '#f0f9ff']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
        </View>

        {/* Center Content */}
        <View style={styles.content}>
          <LinearGradient
            colors={['#ffffff', '#fdfdfd']}
            style={styles.contentCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Influencer Icon */}
            <View style={styles.iconWrapper}>
              <View style={[
                styles.influencerIconContainer,
                isInfluencer && styles.influencerIconActive
              ]}>
                <Image source={logo3} style={styles.logo} resizeMode="contain" />

                {isInfluencer && (
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#fff"
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Text Content */}
            <Text style={styles.title}>
              {isInfluencer ? 'Welcome Back Influencer!' : 'Set as Influencer'}
            </Text>
            
            <Text style={styles.description}>
              {isInfluencer 
                ? 'Your influencer status is active. Access exclusive features, analytics, and brand collaborations.'
                : 'Enable influencer mode to unlock special features and opportunities.'
              }
            </Text>

            {/* Show user ID in debug mode */}
            {/* {__DEV__ && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugText}>User ID: {userId || 'Not available'}</Text>
                <Text style={styles.debugText}>Influencer Status: {isInfluencer ? 'Active' : 'Inactive'}</Text>
              </View>
            )} */}

            {/* Action Buttons */}
            {isInfluencer ? (
              // Show Welcome Again button for influencers
              <TouchableOpacity
                style={styles.buttonWelcome}
                onPress={handleWelcomeBack}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons 
                    name="rocket-launch" 
                    size={20} 
                    color="#fff" 
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    Welcome Again
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              // Show Become Influencer button for non-influencers
              <TouchableOpacity
                style={styles.button}
                onPress={handleSetInfluencer}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#00BBF5', '#0099CC']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialCommunityIcons 
                    name="account-star" 
                    size={20} 
                    color="#fff" 
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    Become Influencer
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Status Indicator */}
            {isInfluencer && influencerData && (
              <View style={styles.statusContainer}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={18}
                  color="#4CAF50"
                />
                <Text style={styles.statusText}>Verified Influencer</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isInfluencer 
              ? 'Manage your influencer profile in settings'
              : 'You can update this anytime in settings'
            }
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#64748b',
  },
  errorCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 15,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#00BBF5',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  debugText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 30,
    paddingBottom: 20,
  },
  logo: {
    width: 220,
    height: 220,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  contentCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  iconWrapper: {
    marginBottom: 32,
  },
  influencerIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  influencerIconActive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#10B981',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#10B981',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '300',
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
    minWidth: 220,
    shadowColor: '#00BBF5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonWelcome: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
    minWidth: 220,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 14,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '300',
  },
});

export default SetInfluencerScreen;