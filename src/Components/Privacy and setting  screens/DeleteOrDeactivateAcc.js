import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DeleteOrDeactivateAcc = () => {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
     
      <Text style={styles.title}>Delete or deactivate?</Text>
      <Text style={styles.description}>
        If you want to leave MyFame temporarily, simply deactivate your account.
        If you choose to delete your account instead, you won’t be able to
        recover it after 30 days.
      </Text>

      <TouchableOpacity onPress={()=>navigation.navigate('DeactivateAccount')} style={styles.optionButton}>
        <View>
          <Text style={styles.optionTitle}>Deactivate account</Text>
          <Text style={styles.optionDescription}>
            No one can see your account, including all content that is stored in
            it. Reactivate your account and recover all content anytime.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.navigate('DeleteAccount')} style={styles.optionButton}>
        <View>
          <Text style={styles.optionTitle}>Delete account permanently</Text>
          <Text style={styles.optionDescription}>
            Your account and content will be deleted permanently. You may cancel
            the deletion request by reactivating your account within 30 days.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    paddingVertical: 10,
  },
  backText: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  optionButton: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});

export default DeleteOrDeactivateAcc;
