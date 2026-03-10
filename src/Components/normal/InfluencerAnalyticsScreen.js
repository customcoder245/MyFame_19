import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InfluencerAnalyticsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  
  // Get userId from route params - make sure it's being passed correctly
   const { userId } = useContext(AuthContext);
 
  // Add a check for userId
  useEffect(() => {
    if (!userId) {
      console.error('No userId provided in route params');
      // You might want to navigate back or show an error
      Alert.alert('Error', 'User ID not found. Please try again.');
      navigation.goBack();
    }
  }, [userId, navigation]);

  const fetchDashboardData = useCallback(async () => {
    if (!userId) {
      console.error('Cannot fetch data: userId is null');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = `https://myfame.com/wp-json/ads/v1/getInfluencerDashboard?influencer_id=${userId}`;
      
      console.log('Fetching data for userId:', userId, 'URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log

      if (data.status === 200) {
        setDashboardData(data.data);
      } else {
        console.error('API returned error:', data.message);
        setDashboardData(null);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Calculate active campaigns (from ads_breakdown)
  const getActiveCampaigns = () => {
    if (!dashboardData || !dashboardData.ads_breakdown) return 0;
    return dashboardData.ads_breakdown.length;
  };

  // Get brand partners count
  const getBrandPartnersCount = () => {
    if (!dashboardData) return 0;
    return dashboardData.brand_partners_count || 0;
  };

  // Get engagement rate
  const getEngagementRate = () => {
    if (!dashboardData) return '0%';
    return dashboardData.engagement_rate || '0%';
  };

  // Get total reach (using total_views)
  const getTotalReach = () => {
    if (!dashboardData) return 0;
    return dashboardData.total_views || 0;
  };

  // Get total revenue
  const getTotalRevenue = () => {
    if (!dashboardData) return 0;
    return dashboardData.total_revenue || 0;
  };

  // Get monthly revenue
  const getMonthlyRevenue = () => {
    if (!dashboardData) return 0;
    return dashboardData.monthly_revenue || 0;
  };

  // Get growth percentage
  const getGrowth = () => {
    if (!dashboardData) return '0%';
    const growth = dashboardData.growth_rate_percentage || 0;
    return growth > 0 ? `+${growth}%` : `${growth}%`;
  };

  // Get total videos
  const getTotalVideos = () => {
    if (!dashboardData) return 0;
    return dashboardData.total_inf_videos || 0;
  };

  // Get total engagement
  const getTotalEngagement = () => {
    if (!dashboardData) return 0;
    return dashboardData.total_engagement || 0;
  };

  // Get average engagement
  const getAvgEngagement = () => {
    if (!dashboardData) return '0%';
    return dashboardData.avg_engagement || '0%';
  };

  const tabs = [
    // { id: 'overview', label: 'Overview', icon: 'view-dashboard' },
    // { id: 'content', label: 'Content', icon: 'video' },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#003366" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Influencer Analytics</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.settingsButton} 
        onPress={fetchDashboardData}
        activeOpacity={0.7}
        disabled={refreshing}
      >
        {/* <MaterialCommunityIcons 
          name="refresh" 
          size={24} 
          color={refreshing ? '#94A3B8' : '#003366'} 
        /> */}
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.tabActive,
          ]}
          onPress={() => setActiveTab(tab.id)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={20}
            color={activeTab === tab.id ? '#00BBF5' : '#94A3B8'}
          />
          <Text style={[
            styles.tabText,
            activeTab === tab.id && styles.tabTextActive,
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverview = () => {
    if (!dashboardData) return null;

    return (
      <ScrollView 
        style={styles.tabContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00BBF5']}
            tintColor="#00BBF5"
          />
        }
      >
        {/* Revenue Summary */}
        <View style={styles.revenueCard}>
          <LinearGradient
            colors={['#00BBF5', '#0099CC']}
            style={styles.revenueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >


<TouchableOpacity 

onPress={()=>               navigation.navigate("InfluencerWallet" )
}
>

                          <MaterialIcons name="payment" size={22} color="#FFF"  style={{position:"absolute"  , right:16 , top:25}}/>

</TouchableOpacity>
            <Text style={styles.revenueTitle}>Total Revenue</Text>
            <Text style={styles.revenueAmount}>{formatCurrency(getTotalRevenue())}</Text>
            <View style={styles.revenueStats}>
              <View style={styles.revenueStat}>
                <Text style={styles.revenueStatLabel}>This Month</Text>
                <Text style={styles.revenueStatValue}>{formatCurrency(getMonthlyRevenue())}</Text>
              </View>
              <View style={styles.revenueDivider} />
              <View style={styles.revenueStat}>
                <Text style={styles.revenueStatLabel}>Growth</Text>
                <Text style={styles.revenueStatValue}>{getGrowth()}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#E6F7FF' }]}>
              <MaterialCommunityIcons name="bullhorn" size={24} color="#00BBF5" />
            </View>
            <Text style={styles.metricValue}>{getActiveCampaigns()}</Text>
            <Text style={styles.metricLabel}>Active Campaigns</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="office-building-outline" size={24} color="#FF9800" />
            </View>
            <Text style={styles.metricValue}>{getBrandPartnersCount()}</Text>
            <Text style={styles.metricLabel}>Brand Partners</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#E8F5E8' }]}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.metricValue}>{getEngagementRate()}</Text>
            <Text style={styles.metricLabel}>Engagement Rate</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="account-group" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.metricValue}>
              {getTotalReach() >= 1000 
                ? `${(getTotalReach() / 1000).toFixed(1)}K` 
                : formatNumber(getTotalReach())}
            </Text>
            <Text style={styles.metricLabel}>Total Reach</Text>
          </View>
        </View>


        

        {/* Additional API Stats */}
        {/* <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="eye-outline" size={24} color="#00BBF5" />
              <Text style={styles.statValue}>{formatNumber(dashboardData.total_views || 0)}</Text>
              <Text style={styles.statLabel}>Total Views</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="cursor-click" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{formatNumber(dashboardData.total_clicks || 0)}</Text>
              <Text style={styles.statLabel}>Total Clicks</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="trending-up" size={24} color="#FF9800" />
              <Text style={styles.statValue}>{getGrowth()}</Text>
              <Text style={styles.statLabel}>Growth Rate</Text>
            </View>
          </View>
        </View> */}


        {/* <View style={styles.contentTypesSection}>
          <Text style={styles.sectionTitle}>Content Metrics</Text> */}
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#E6F7FF' }]}>
                <MaterialCommunityIcons name="thumb-up-outline" size={24} color="#00BBF5" />
              </View>
              <Text style={styles.metricValue}>{formatNumber(getTotalEngagement())}</Text>
              <Text style={styles.metricLabel}>Total Engagement</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="cursor-click" size={24} color="#FF9800" />
              </View>
              <Text style={styles.metricValue}>{formatNumber(dashboardData.total_clicks || 0)}</Text>
              <Text style={styles.metricLabel}>Total Clicks</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#E8F5E8' }]}>
                <MaterialCommunityIcons name="chart-line" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.metricValue}>{getAvgEngagement()}</Text>
              <Text style={styles.metricLabel}>Avg Engagement</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#F3E5F5' }]}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.metricValue}>{getGrowth()}</Text>
              <Text style={styles.metricLabel}>Growth Rate</Text>
            </View>
          </View>
        {/* </View> */}
        {/* Brand Partners Section */}
        {dashboardData.brand_partners && dashboardData.brand_partners.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Brand Partnerdds</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandPartnersScroll}>
              {dashboardData.brand_partners.map((brand, index) => (
                <View key={index} style={styles.brandPartnerCard}>
                  <View style={styles.brandPartnerIcon}>
                    <MaterialCommunityIcons name="office-building" size={24} color="#003366" />
                  </View>
                  <Text style={styles.brandPartnerName} numberOfLines={1}>
                    {brand.display_name || brand.user_login || `Partner ${index + 1}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Ads Breakdown */}
        {dashboardData.ads_breakdown && dashboardData.ads_breakdown.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Recent Campaigns</Text>
            <View style={styles.adsBreakdownContainer}>
              {dashboardData.ads_breakdown.slice(0, 3).map((ad, index) => (
                <View key={index} style={styles.adsBreakdownItem}>
                  <View style={styles.adsBreakdownHeader}>
                    <MaterialCommunityIcons name="currency-usd" size={16} color="#4CAF50" />
                    <Text style={styles.adsBreakdownTitle}>
                      {ad.ad_title}
                    </Text>
                  </View>
                  <Text style={styles.adsBreakdownEarnings}>
                    {formatCurrency(ad.earned || 0)}
                  </Text>
                </View>
              ))}
            </View>
            {/* <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => {
                // Navigate to detailed campaigns screen if needed
                Alert.alert('View All', 'This would show all campaigns');
              }}
            >
              <Text style={styles.viewAllText}>View All Campaigns →</Text>
            </TouchableOpacity> */}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderContentAnalytics = () => {
    if (!dashboardData) return null;

    return (
      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00BBF5']}
            tintColor="#00BBF5"
          />
        }
      >
        {/* Content Performance Stats */}
        <View style={styles.contentStatsCard}>
          <Text style={styles.sectionTitle}>Content Performance</Text>
          
          <View style={styles.contentStatsGrid}>
            <View style={styles.contentStatItem}>
              <LinearGradient
                colors={['#E6F7FF', '#F0F9FF']}
                style={styles.contentStatGradient}
              >
                <MaterialCommunityIcons name="video-outline" size={24} color="#00BBF5" />
                <Text style={styles.contentStatValue}>{getTotalVideos()}</Text>
                <Text style={styles.contentStatLabel}>Total Videos</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.contentStatItem}>
              <LinearGradient
                colors={['#E8F5E8', '#F1F8E9']}
                style={styles.contentStatGradient}
              >
                <MaterialCommunityIcons name="eye-outline" size={24} color="#4CAF50" />
                <Text style={styles.contentStatValue}>{formatNumber(getTotalReach())}</Text>
                <Text style={styles.contentStatLabel}>Total Views</Text>
              </LinearGradient>
            </View>
          </View>
          
          <View style={styles.contentStatsGrid}>
            <View style={styles.contentStatItem}>
              <LinearGradient
                colors={['#FFF3E0', '#FFF8E1']}
                style={styles.contentStatGradient}
              >
                <MaterialCommunityIcons name="heart-outline" size={24} color="#FF6B6B" />
                <Text style={styles.contentStatValue}>{formatNumber(getTotalEngagement())}</Text>
                <Text style={styles.contentStatLabel}>Total Engagement</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.contentStatItem}>
              <LinearGradient
                colors={['#F3E5F5', '#F1E6FF']}
                style={styles.contentStatGradient}
              >
                <MaterialCommunityIcons name="chart-line" size={24} color="#9C27B0" />
                <Text style={styles.contentStatValue}>{getAvgEngagement()}</Text>
                <Text style={styles.contentStatLabel}>Avg. Engagement</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Content Types Distribution */}
        <View style={styles.contentTypesSection}>
          <Text style={styles.sectionTitle}>Content Metrics</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#E6F7FF' }]}>
                <MaterialCommunityIcons name="thumb-up-outline" size={24} color="#00BBF5" />
              </View>
              <Text style={styles.metricValue}>{formatNumber(getTotalEngagement())}</Text>
              <Text style={styles.metricLabel}>Total Engagement</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="cursor-click" size={24} color="#FF9800" />
              </View>
              <Text style={styles.metricValue}>{formatNumber(dashboardData.total_clicks || 0)}</Text>
              <Text style={styles.metricLabel}>Total Clicks</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#E8F5E8' }]}>
                <MaterialCommunityIcons name="chart-line" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.metricValue}>{getAvgEngagement()}</Text>
              <Text style={styles.metricLabel}>Avg Engagement</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#F3E5F5' }]}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.metricValue}>{getGrowth()}</Text>
              <Text style={styles.metricLabel}>Growth Rate</Text>
            </View>
          </View>
        </View>

        {/* Revenue Breakdown */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.revenueBreakdown}>
            <View style={styles.revenueItem}>
              <View style={styles.revenueIconContainer}>
                <MaterialCommunityIcons name="currency-usd" size={20} color="#4CAF50" />
              </View>
              <View style={styles.revenueTextContainer}>
                <Text style={styles.revenueItemLabel}>Total Revenue</Text>
                <Text style={styles.revenueItemValue}>{formatCurrency(getTotalRevenue())}</Text>
              </View>
            </View>
            
            <View style={styles.revenueItem}>
              <View style={styles.revenueIconContainer}>
                <MaterialCommunityIcons name="calendar-month" size={20} color="#00BBF5" />
              </View>
              <View style={styles.revenueTextContainer}>
                <Text style={styles.revenueItemLabel}>Monthly Revenue</Text>
                <Text style={styles.revenueItemValue}>{formatCurrency(getMonthlyRevenue())}</Text>
              </View>
            </View>
            
            {dashboardData.last_month_revenue > 0 && (
              <View style={styles.revenueItem}>
                <View style={styles.revenueIconContainer}>
                  <MaterialCommunityIcons name="calendar-arrow-left" size={20} color="#FF9800" />
                </View>
                <View style={styles.revenueTextContainer}>
                  <Text style={styles.revenueItemLabel}>Last Month Revenue</Text>
                  <Text style={styles.revenueItemValue}>{formatCurrency(dashboardData.last_month_revenue)}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#00BBF5" />
          <Text style={styles.loadingText}>Loading Analytics...</Text>
        </View>
      );
    }

    if (!userId) {
      return (
        <View style={styles.errorContent}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>User ID Required</Text>
          <Text style={styles.errorText}>
            User ID is not available. Please go back and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!dashboardData) {
      return (
        <View style={styles.errorContent}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Unable to Load Data</Text>
          <Text style={styles.errorText}>
            There was an error loading your analytics data.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDashboardData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'content':
        return renderContentAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {renderHeader()}
      {renderTabs()}
      
      <View style={styles.mainContent}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#00BBF5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#F8FAFC',
  },
  tabActive: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#00BBF5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#00BBF5',
  },
  mainContent: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  revenueCard: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
    marginBottom: 20,
    shadowColor: '#00BBF5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  revenueGradient: {
    padding: 20,
    borderRadius: 16,
  },
  revenueTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  revenueStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueStat: {
    flex: 1,
    alignItems: 'center',
  },
  revenueStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  revenueStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  revenueDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    gap:20
  },
  metricCard: {
    width: (SCREEN_WIDTH - 48) / 2 - 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#003366',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#003366',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  brandPartnersScroll: {
    flexDirection: 'row',
  },
  brandPartnerCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  brandPartnerIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#E6F7FF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandPartnerName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  adsBreakdownContainer: {
    marginBottom: 12,
  },
  adsBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adsBreakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adsBreakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    flex: 1,
  },
  adsBreakdownEarnings: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    position:"absolute" ,
    right:10
  },
  viewAllButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#00BBF5',
    fontWeight: '600',
  },
  // Content Screen Styles
  contentContainer: {
    flex: 1,
  },
  contentStatsCard: {
    margin: 16,
    marginBottom: 24,
  },
  contentStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contentStatItem: {
    width: (SCREEN_WIDTH - 48) / 2 - 8,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  contentStatGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  contentStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#003366',
    marginTop: 12,
    marginBottom: 4,
  },
  contentStatLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  contentTypesSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  revenueBreakdown: {
    marginTop: 8,
  },
  revenueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  revenueIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  revenueTextContainer: {
    flex: 1,
  },
  revenueItemLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  revenueItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
  },
});

export default InfluencerAnalyticsScreen;