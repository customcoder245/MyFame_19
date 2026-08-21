import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // Ensure you have installed @expo/vector-icons
import { Signup } from "../../assets2/Images/allImages";

const ComingSoonScreen = ({ navigation }) => {
  const scaleAnim = new Animated.Value(0); // Initial scale value

  // Start the animation
  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 2,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <ImageBackground 
    source={Signup} // Replace with your image URL
      style={styles.container}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <MaterialIcons name="hourglass-empty" size={120} color="#fff" />
        </Animated.View>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.message}>
          We're diligently crafting something special for you. Stay tuned!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Privacy Screen</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay for better contrast
    borderRadius: 20,
    padding: 20,
    margin: 10,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '700',
    marginVertical: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  message: {
    fontSize: 18,
    color: '#eeeeee',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginVertical: 10,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#00E2FF',
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ComingSoonScreen;
