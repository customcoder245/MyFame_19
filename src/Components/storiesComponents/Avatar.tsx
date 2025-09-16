// @flow
import * as React from 'react';
import {
  StyleSheet, View, Image, Text, Platform,
} from 'react-native';
import { ImageSourcePropType } from 'react-native';
type AvatarProps = {
  user: string,
  avatar: ImageSourcePropType,
};

export default class Avatar extends React.PureComponent<AvatarProps> {
  render(): React.ReactNode {
    const { user, avatar: source } = this.props;
    return (
      <View style={styles.container}>
    
        <Image source={{uri:source}} style={styles.avatar} />
        <Text style={styles.username}>{user}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    // marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
    marginTop: Platform.OS === 'android' ? 0 : 0,
    zIndex:20,
    paddingVertical:30
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    marginRight: 16,
  },
  username: {
    color: 'white',
    fontSize: 16,
  },
});
