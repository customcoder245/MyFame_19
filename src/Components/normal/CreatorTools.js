// import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
// import React from "react";

// import {
//   LIVE10,
//   QuestionStrokeIcon,
//   tv11,
//   LeftArrowIcon,
//   horArrow,
//   phone8,
//   quest9,
// } from "../../assets2/Icons/allIcons";
// import { PenStrokeIcon } from "../../assets2/Images/allImages";
// export default function CreatorTools() {
//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <Text style={styles.texthead}>GENERAL</Text>

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "10%",
//           }}
//         >
//           <View
//             style={{
//               gap: 20,
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Image source={horArrow} style={styles.imgpar11} />
//             <Text style={styles.txt11}>Analytics</Text>
//           </View>
//           <Image source={LeftArrowIcon} style={styles.imgpar12} />
//         </View>

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "10%",
//           }}
//         >
//           <View
//             style={{
//               gap: 20,
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Image source={phone8} style={styles.imgpar21} />
//             <Text style={styles.txt11}>Ceator Portal</Text>
//           </View>
//           <Image source={LeftArrowIcon} style={styles.imgpar12} />
//         </View>

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "10%",
//           }}
//         >
//           <View
//             style={{
//               gap: 20,
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Image source={quest9} style={styles.imgpar11} />
//             <Text style={styles.txt11}>Q&A</Text>
//           </View>
//           <Image source={LeftArrowIcon} style={styles.imgpar12} />
//         </View>

//         <View style={styles.divider} />
//         <Text style={styles.texthead}>CONTENT & DISPLAY</Text>

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "10%",
//           }}
//         >
//           <View
//             style={{
//               gap: 20,
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Image source={LIVE10} style={styles.imgpar11} />
//             <Text style={styles.txt11}>LIVE creator’s hub</Text>
//           </View>
//           <Image source={LeftArrowIcon} style={styles.imgpar12} />
//         </View>

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "10%",
//           }}
//         >
//           <View
//             style={{
//               gap: 20,
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Image source={tv11} style={styles.imgpar11} />
//             <Text style={styles.txt11}>Language</Text>
//           </View>
//           <Image source={LeftArrowIcon} style={styles.imgpar12} />
//         </View>
//         <View style={styles.divider} />
//         <Text style={styles.texthead}>SUPPORT</Text>

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "10%",
//           }}
//         >
//           <View
//             style={{
//               gap: 20,
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Image source={PenStrokeIcon} style={styles.imgpar11} />
//             <Text style={styles.txt11}>Report a problem</Text>
//           </View>
//           <Image source={LeftArrowIcon} style={styles.imgpar12} />
//         </View>

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "10%",
//           }}
//         >
//           <View
//             style={{
//               gap: 20,
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <Image source={QuestionStrokeIcon} style={styles.imgpar11} />
//             <Text style={styles.txt11}>Help Center</Text>
//           </View>
//           <Image source={LeftArrowIcon} style={styles.imgpar12} />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     paddingHorizontal: "5%",
//   },
//   texthead: {
//     fontSize: 12,
//     fontWeight: "300",
//     color: "#86878B",
//     marginTop: "8%",
//   },
//   imgpar11: {
//     height: 17,
//     width: 17,
//   },
//   imgpar21: {
//     height: 27,
//     width: 17,
//   },
//   txt11: {
//     fontSize: 17,
//     color: "#161722",
//     fontWeight: "500",
//   },
//   imgpar12: {
//     height: 12,
//     width: 12,
//   },
//   divider: {
//     height: 0.56,
//     backgroundColor: "#D0D1D3",
//     marginTop: 20,
//     marginBottom: 5,
//   },
// });




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
          <Text style={styles.buttonText}>Back to Profile</Text>
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
