import React, { useRef, useMemo, useCallback } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const BottomSheetExample = () => {
  // Ref for the BottomSheet
  const bottomSheetRef = useRef(null);

  // Set snap points for the BottomSheet
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // Function to open the BottomSheet
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1); // Opens to the 50% height snap point
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Open BottomSheet" onPress={handleOpenBottomSheet} />

      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>This is the BottomSheet content!</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BottomSheetExample;
