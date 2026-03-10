import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { logo3 } from '../../assets2/Icons/allIcons';
import Icon from 'react-native-vector-icons/Ionicons'; // or any icon library

const ADDashboardScreen = (props) => {
  return (
    <LinearGradient
      colors={['#00BBF5', '#e0f7ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Header with logo */}
      <View style={styles.header}>
        <Image source={logo3} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome, Advertiser!</Text>
      </View>

      {/* Dashboard options */}
      <ScrollView contentContainerStyle={styles.dashboard}>
        {/* Post Ads */}
        <TouchableOpacity style={styles.card} onPress={() => props.navigation.navigate("PostAdScreen")}>
          <Icon name="megaphone-outline" size={40} color="#00BBF5" />
          <Text style={styles.cardTitle}>Post Ads</Text>
          <Text style={styles.cardSubtitle}>Create new advertising campaigns</Text>
        </TouchableOpacity>

        {/* Manage Ads */}
        <TouchableOpacity style={styles.card}     onPress={() => props.navigation.navigate("AdvertiserDashboard")}
>
          <Icon name="albums-outline" size={40} color="#00BBF5" />
          <Text style={styles.cardTitle}>Manage Ads</Text>
          <Text style={styles.cardSubtitle}>Edit or remove existing ads</Text>
        </TouchableOpacity>

        {/* Track Performance */}
        <TouchableOpacity style={styles.card} onPress={() => props.navigation.navigate("TaskPerformanceScreen")}>
          <Icon name="bar-chart-outline" size={40} color="#00BBF5" />
          <Text style={styles.cardTitle}>Track Performance</Text>
          <Text style={styles.cardSubtitle}>View impressions and analytics</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: -60,
    paddingBottom: 30,
  },
  logo: {
    height: 140,
    width: 140,
    marginBottom: -20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
  },
  dashboard: {
    alignItems: 'center',
    paddingBottom: 40,
  },
card: {
  backgroundColor: 'transparent',  // Set background to transparent
  borderRadius: 20,
  width: '90%',
  paddingVertical: 25,
  paddingHorizontal: 20,
  marginVertical: 10,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 12,
  elevation: 6,
  backgroundColor:"white"
},

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
    marginTop: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default ADDashboardScreen;
