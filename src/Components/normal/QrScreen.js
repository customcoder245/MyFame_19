// import { StyleSheet, Text, View, Image } from "react-native";
// import React from "react";
// import { icononly, link2, share1 } from "../../assets2/Icons/allIcons";

// import { qrcode3, port1 } from "../../assets2/Images/allImages";

// export default function QrScreen() {
//   return (
//     <View style={styles.container}>
//       <View
//         style={{
//           backgroundColor: "#000000",
//           width: "80%",
//           height: "67%",
//           borderRadius: 30,
//           position: "absolute",
//           top: "15%",
//           alignItems: "center",
//           paddingTop: "19%",
//         }}
//       >
//         <Image
//           source={port1}
//           style={{
//             position: "absolute",
//             top: "-20%",
//           }}
//         />

//         <Text style={{ color: "#ECECEC", fontWeight: "300", fontSize: 19 }}>
//           Alihandro
//         </Text>

//         <Image source={qrcode3} />

//         <Text
//           style={{
//             fontSize: 11,
//             color: "#ECECEC",
//             fontWeight: "200",
//             marginTop: "15%",
//           }}
//         >
//           Let others follow you by scanning your qr code
//         </Text>

//         <Image
//           source={icononly}
//           style={{
//             width: "10%",
//             height: "10%",
//             borderRadius: 100,
//             borderColor: "#F6F1F1",
//             marginTop: "5%",
//           }}
//         />

//         <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             width: "100%",
//             marginTop: "25%",
//             justifyContent: "space-between",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: "black",
//               width: "48%",
//               height: "55%",
//               justifyContent: "center",
//               alignItems: "center",
//               borderRadius: 15,
//             }}
//           >
//             <Image
//               source={share1}
//               style={{
//                 width: "18%",
//                 height: "40%",
//                 borderRadius: 100,
//                 borderColor: "#F6F1F1",
//               }}
//             />

//             <Text style={{ color: "white" }}>Copy link</Text>
//           </View>
//           <View
//             style={{
//               backgroundColor: "black",
//               width: "48%",
//               height: "55%",
//               justifyContent: "center",
//               alignItems: "center",
//               borderRadius: 15,
//             }}
//           >
//             <Image
//               source={link2}
//               style={{
//                 width: "18%",
//                 height: "27%",
//                 borderRadius: 100,
//                 borderColor: "#F6F1F1",
//               }}
//             />

//             <Text style={{ color: "white" }}>Share profile</Text>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ECECEC",
//     alignItems: "center",
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
