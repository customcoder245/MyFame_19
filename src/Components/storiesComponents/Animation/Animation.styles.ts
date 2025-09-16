import { StyleSheet,Dimensions } from 'react-native';

const {width} = Dimensions.get('window')


export default StyleSheet.create( {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cube: {
    justifyContent: 'center',
  },
} );
