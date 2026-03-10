import React from 'react';
import { View, Text, StyleSheet, Linking, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { logo3 } from '../../assets2/Icons/allIcons';

const SupportScreen = () => {
  const handleEmail = () => {
    Linking.openURL('mailto:info@myfame.com');
  };

  return (
    <LinearGradient
      colors={['#e0f7ff', '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image source={logo3} style={styles.icon} resizeMode="contain" />

        <Text style={styles.title}>Support</Text>

        <Text style={styles.description}>
          If you need help or have any questions, feel free to reach out to our support team.
          We are here to assist you with any issue related to MyFame app.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>Email Support</Text>
          <Icon name="mail-outline" size={20} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BBF5',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default SupportScreen;
