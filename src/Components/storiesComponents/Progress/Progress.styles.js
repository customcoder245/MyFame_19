import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  container: {
    // position: 'absolute',
    top: 16,
    left: 16,
    height: 2,
    flexDirection: 'row',
    gap: 4,
    zIndex:20
  },
  item: {
    height: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
} );
