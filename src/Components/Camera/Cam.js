import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});




// import * as all from 'react-native-vision-camera'
 
// import React, { useState, useEffect } from 'react';
// import { View, Button } from 'react-native';
// import { launchCameraAsync, MediaTypeOptions } from 'expo-image-picker';
// import { Video } from 'expo-av';

// export default function VideoRecorder() {
//   const [videoUri, setVideoUri] = useState(null);

//   const handleRecordVideo = async () => {
//     let result = await launchCameraAsync({
//       mediaTypes: MediaTypeOptions.Videos,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setVideoUri(result.assets[0].uri);
//       console.log(result.assets[0].uri)
//     }
//   };
// console.log(all,"@@@@ here all");
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {videoUri && (
//         <Video
//           source={{ uri: videoUri }}
//           style={{ width: 300, height: 300 }}
//           useNativeControls
//         />
//       )}
//       <Button title="Record Video" onPress={handleRecordVideo} />
//     </View>
//   );
// }
