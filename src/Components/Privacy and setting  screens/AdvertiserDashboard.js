import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Dimensions, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../../Context/AuthContext';
import deleteUserAd from '../../Fetch_API/deleteUserAd';
import fetchActiveAds from '../../Fetch_API/fetchActiveAds';
import fetchExpiredAds from '../../Fetch_API/fetchExpiredAds';
import renewUserAd from '../../Fetch_API/renewUserAd';
import { TextInput } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth } = Dimensions.get('window');

// ✅ HELPER FUNCTION (OUTSIDE COMPONENTS)
const getSiteLabels = (which) => {
  if (which === 'myfame') return ['MyFame'];
  if (which === 'rofhub') return ['RofHub'];
  if (which === 'both_site') return ['MyFame', 'RofHub'];
  return [];
};

// ✅ NEW HELPER FUNCTION to extract which_site from ad_creation_domain
const getWhichSiteFromDomain = (domain) => {
  if (!domain) return 'both_site'; // default fallback
  
  // Check for new patterns first
  if (domain === 'rofhub_domain_myfame') return 'myfame';
  if (domain === 'rofhub_domain_both') return 'both_site';
  
  // Check for old patterns
  if (domain === 'myfame_domain_myfame') return 'myfame';
  if (domain === 'myfame_domain_rofhub') return 'rofhub';
  if (domain === 'myfame_domain_both') return 'both_site';
  
  return 'both_site'; // default fallback
};

// ✅ FILTER OPTIONS based on API rules
const FILTER_OPTIONS = [
  { 
    key: 'all_myfame_ads_only', 
    label: 'MyFame', 
    icon: 'phone-portrait-outline',
    description: 'All MyFame ads from both domains'
  },
  { 
    key: 'all_rofhub_ads', 
    label: 'RofHub', 
    icon: 'tablet-portrait-outline',
    description: 'RofHub ads created at MyFame'
  },
  { 
    key: 'myfame_domain_both', 
    label: 'Both', 
    icon: 'apps-outline',
    description: 'Ads for both apps created at MyFame'
  }
];

// ✅ Helper function to get filter label
const getFilterLabel = (key) => {
  const option = FILTER_OPTIONS.find(opt => opt.key === key);
  return option ? option.label : 'MyFame Ads';
};

// Action Dropdown
const ActionDropdown = ({ visible, position, onClose, ad, type, handleEdit, handleDelete, handleRenew, handleViewAd }) => {
  // Hide dropdown for rofhub domains
  const isRofhubDomain = ad?.ad_creation_domain?.startsWith('rofhub_');
  if (isRofhubDomain) return null;
  
  if (!visible || !ad) return null;

  const adjustedPosition = {
    top: position.y - 60,
    left: Math.max(10, Math.min(position.x - 140, screenWidth - 150))
  };

  return (
    <View style={[styles.dropdownContainer, adjustedPosition]}>
      <View style={styles.dropdownArrow} />
      
      <TouchableOpacity 
        style={styles.dropdownOption} 
        onPress={() => { onClose(); handleViewAd(ad); }}
        activeOpacity={0.7}
      >
        <Icon name="eye-outline" size={18} color="#00BBF5" />
        <Text style={styles.dropdownOptionText}>View Ad</Text>
      </TouchableOpacity>

      {type === 'active' && (
        <TouchableOpacity 
          style={styles.dropdownOption} 
          onPress={() => { onClose(); handleEdit(ad); }}
          activeOpacity={0.7}
        >
          <Icon name="pencil-outline" size={18} color="#00BBF5" />
          <Text style={styles.dropdownOptionText}>Edit</Text>
        </TouchableOpacity>
      )}

      {type === 'expired' && (
        <TouchableOpacity 
          style={styles.dropdownOption} 
          onPress={() => { onClose(); handleRenew(ad); }}
          activeOpacity={0.7}
        >
          <Icon name="refresh-outline" size={18} color="#00BBF5" />
          <Text style={styles.dropdownOptionText}>Renew</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={[styles.dropdownOption, styles.deleteOption]} 
        onPress={() => { onClose(); handleDelete(ad, type); }}
        activeOpacity={0.7}
      >
        <Icon name="trash-outline" size={18} color="#FF4D4D" />
        <Text style={[styles.dropdownOptionText, styles.deleteText]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Ad Panel with which_site badges
const AdPanel = ({ ad, type, handleEdit, handleDelete, handleRenew, onMenuPress, onViewAd }) => {
  const dotsRef = useRef();

  const handleDotsPress = () => {
    if (dotsRef.current) {
      dotsRef.current.measureInWindow((x, y, width, height) => {
        onMenuPress(ad, { 
          x: x + width,
          y: y + height
        });
      });
    }
  };

  // Get which_site based on ad_creation_domain
  const whichSite = getWhichSiteFromDomain(ad.ad_creation_domain);
  const siteLabels = getSiteLabels(whichSite);
  
  // Check if domain starts with 'rofhub' to hide menu icon and renew button
  const isRofhubDomain = ad.ad_creation_domain?.startsWith('rofhub_');
  const showMenuIcon = !isRofhubDomain;
  const showRenewButton = type === 'expired' && !isRofhubDomain;

  return (
    <TouchableOpacity style={styles.panel} onPress={() => onViewAd(ad)} activeOpacity={0.8}>
      <View style={styles.panelHeader}>
        <View style={styles.panelTextContainer}>
          <Text style={styles.panelTitle}>{ad.title}</Text>
          <Text style={styles.panelPrice}>{ad.price || 'No Price'}</Text>
          <Text style={styles.panelDescription} numberOfLines={2}>{ad.description}</Text>
          <Text style={styles.panelCategory}>Category: {ad.category}</Text>

          {/* Display which site */}
          <View style={styles.siteBadgeContainer}>
            {siteLabels.map((site, i) => (
              <View key={i} style={styles.siteBadge}>
                <Text style={styles.siteBadgeText}>{site}</Text>
              </View>
            ))}
          </View>

        </View>

        {showMenuIcon && (
          <TouchableOpacity 
            ref={dotsRef}
            onPress={(e) => { 
              e.stopPropagation(); 
              handleDotsPress();
            }} 
            style={styles.dotsButton}
          >
            <Icon name="ellipsis-vertical" size={22} color="#003366" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.panelFooter}>
        <View style={[
          styles.statusBadge,
          ad.approval_status === 'approved' ? styles.approvedBadge : styles.pendingBadge
        ]}>
          <Text style={[
            styles.statusText,
            ad.approval_status === 'approved' ? styles.approvedText : styles.pendingText
          ]}>
            {ad.approval_status === 'approved' ? '✓ Approved' : 'Pending'}
          </Text>
        </View>

        {type === 'active' && ad.days_remaining && (
          <View style={styles.daysBadge}>
            <Text style={styles.daysText}>{ad.days_remaining} days left</Text>
          </View>
        )}
      </View>

      {showRenewButton && (
        <View style={styles.panelActions}>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleRenew(ad); }} style={styles.panelButton}>
            <Icon name="refresh-outline" size={20} color="#00BBF5" />
            <Text style={styles.panelButtonText}>Renew</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ✅ Domain Filter Dropdown Component with 3 filters
const DomainFilterDropdown = ({ visible, onClose, selectedDomain, onSelectDomain }) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.filterDropdownContainer}>
          {FILTER_OPTIONS.map((domain) => (
            <TouchableOpacity
              key={domain.key}
              style={[
                styles.filterOption,
                selectedDomain === domain.key && styles.filterOptionSelected
              ]}
              onPress={() => {
                onSelectDomain(domain.key);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.filterOptionContent}>
                <Icon 
                  name={domain.icon} 
                  size={18} 
                  color={selectedDomain === domain.key ? '#00BBF5' : '#666'} 
                  style={styles.filterOptionIcon}
                />
                <View style={styles.filterOptionTextContainer}>
                  <Text style={[
                    styles.filterOptionText,
                    selectedDomain === domain.key && styles.filterOptionTextSelected
                  ]}>
                    {domain.label}
                  </Text>
 
                </View>
              </View>
 
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Active Ads Screen - WITH FILTER
const ActiveAdsScreen = ({ 
  activeAds, 
  loading, 
  handleEdit, 
  handleDelete, 
  onMenuPress, 
  onViewAd, 
  selectedDomain, 
  onOpenFilter,
  showFilterButton 
}) => {
  const [search, setSearch] = useState('');

  if (loading) return <Loader />;

  // Filter ads based on search (domain filtering is done at API level)
  const filteredAds = activeAds.filter(ad => {
    const searchMatch = search === '' || 
      ad.title.toLowerCase().includes(search.toLowerCase()) ||
      ad.category.toLowerCase().includes(search.toLowerCase()) ||
      ad.description.toLowerCase().includes(search.toLowerCase());
    
    return searchMatch;
  });

  return (
    <LinearGradient colors={['#e6f7ff', '#fdfdfd']} style={{ flex: 1 }}>
      {/* Header with filter button - ONLY for Active Ads */}
      <View style={styles.filterHeader}>
        <Text style={styles.filterHeaderTitle}>Active Ads</Text>
        {showFilterButton && (
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={onOpenFilter}
            activeOpacity={0.7}
          >
            <Icon name="filter-outline" size={18} color="#003366" />
            <Text style={styles.filterButtonText}>
              {getFilterLabel(selectedDomain)}
            </Text>
            <Icon name="chevron-down" size={16} color="#003366" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ads by title, category..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {filteredAds.length ? filteredAds.map(ad => (
          <AdPanel 
            key={ad.ad_id} 
            ad={ad} 
            type="active" 
            handleEdit={handleEdit} 
            handleDelete={handleDelete} 
            onMenuPress={onMenuPress} 
            onViewAd={onViewAd} 
          />
        )) : (
          <View style={styles.emptyState}>
            <Icon name="megaphone-outline" size={60} color="#CBD5E1" />
            <Text style={styles.emptyText}>No active ads found</Text>
            <Text style={styles.emptySubtext}>
              {selectedDomain !== 'all' 
                ? `No ads found for the selected domain filter`
                : 'Try adjusting your search'}
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

// Expired Ads Screen - WITH FILTER
const ExpiredAdsScreen = ({ 
  expiredAds, 
  loading, 
  handleDelete, 
  handleRenew, 
  onMenuPress, 
  onViewAd,
  selectedDomain,
  onOpenFilter,
  showFilterButton 
}) => {
  const [search, setSearch] = useState('');

  if (loading) return <Loader />;

  // Filter ads based on search (domain filtering is done at API level)
  const filteredAds = expiredAds.filter(ad => {
    const searchMatch = search === '' || 
      ad.title.toLowerCase().includes(search.toLowerCase()) ||
      ad.category.toLowerCase().includes(search.toLowerCase()) ||
      ad.description.toLowerCase().includes(search.toLowerCase());
    
    return searchMatch;
  });

  return (
    <LinearGradient colors={['#e6f7ff', '#fdfdfd']} style={{ flex: 1 }}>
      {/* Header with filter button for Expired Ads */}
      <View style={styles.filterHeader}>
        <Text style={styles.filterHeaderTitle}>Expired Ads</Text>
        {showFilterButton && (
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={onOpenFilter}
            activeOpacity={0.7}
          >
            <Icon name="filter-outline" size={18} color="#003366" />
            <Text style={styles.filterButtonText}>
              {getFilterLabel(selectedDomain)}
            </Text>
            <Icon name="chevron-down" size={16} color="#003366" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ads by title, category..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {filteredAds.length ? filteredAds.map(ad => (
          <AdPanel 
            key={ad.ad_id} 
            ad={ad} 
            type="expired" 
            handleDelete={handleDelete} 
            handleRenew={handleRenew} 
            onMenuPress={onMenuPress} 
            onViewAd={onViewAd} 
          />
        )) : (
          <View style={styles.emptyState}>
            <Icon name="megaphone-outline" size={60} color="#CBD5E1" />
            <Text style={styles.emptyText}>No expired ads found</Text>
            <Text style={styles.emptySubtext}>
              {selectedDomain !== 'all' 
                ? `No ads found for the selected domain filter`
                : 'Try adjusting your search'}
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

// Loader
const Loader = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#00BBF5" />
  </View>
);

// Tabs Component
const AdvertiserDashboardTabs = ({ 
  activeAds, 
  expiredAds, 
  handleEdit, 
  handleDelete, 
  handleRenew, 
  loadingActive, 
  loadingExpired, 
  onMenuPress, 
  onViewAd,
  selectedDomain,
  selectedExpiredDomain,
  onOpenFilter,
  onOpenExpiredFilter,
  showFilterButton
}) => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#003366',
      tabBarInactiveTintColor: '#777',
      tabBarIndicatorStyle: { backgroundColor: '#00BBF5', height: 3, borderRadius: 2 },
      tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
      tabBarLabelStyle: { fontWeight: '700', fontSize: 16 },
      tabBarPressColor: 'rgba(0,187,245,0.1)',
    }}
  >
    <Tab.Screen name="Active Ads">
      {() => <ActiveAdsScreen 
        activeAds={activeAds} 
        loading={loadingActive} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
        onMenuPress={onMenuPress} 
        onViewAd={onViewAd}
        selectedDomain={selectedDomain}
        onOpenFilter={onOpenFilter}
        showFilterButton={showFilterButton}
      />}
    </Tab.Screen>
    <Tab.Screen name="Expired Ads">
      {() => <ExpiredAdsScreen 
        expiredAds={expiredAds} 
        loading={loadingExpired} 
        handleDelete={handleDelete} 
        handleRenew={handleRenew} 
        onMenuPress={onMenuPress} 
        onViewAd={onViewAd}
        selectedDomain={selectedExpiredDomain}
        onOpenFilter={onOpenExpiredFilter}
        showFilterButton={showFilterButton}
      />}
    </Tab.Screen>
  </Tab.Navigator>
);

// Main Dashboard
const AdvertiserDashboard = (props) => {
  const { userId } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [activeAds, setActiveAds] = useState([]);
  const [expiredAds, setExpiredAds] = useState([]);
  const [loadingActive, setLoadingActive] = useState(true);
  const [loadingExpired, setLoadingExpired] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedAdType, setSelectedAdType] = useState('active');
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  
  // ✅ Set default to 'all_myfame_ads_only' for both tabs
  const [selectedActiveDomain, setSelectedActiveDomain] = useState('all_myfame_ads_only');
  const [selectedExpiredDomain, setSelectedExpiredDomain] = useState('all_myfame_ads_only');
  const [activeFilterDropdownVisible, setActiveFilterDropdownVisible] = useState(false);
  const [expiredFilterDropdownVisible, setExpiredFilterDropdownVisible] = useState(false);

  // ✅ Load ads when filter changes or userId changes
  useEffect(() => {
    const loadAds = async () => {
      if (!userId) return;

      setLoadingActive(true);
      // ✅ Pass ad_creation_domain parameter to API
      const active = await dispatch(fetchActiveAds(userId, selectedActiveDomain));
      if (active) {
        setActiveAds(active);
      }
      setLoadingActive(false);

      setLoadingExpired(true);
      // ✅ Pass ad_creation_domain parameter to API
      const expired = await dispatch(fetchExpiredAds(userId, selectedExpiredDomain));
      if (expired) {
        setExpiredAds(expired);
      }
      setLoadingExpired(false);
    };
    loadAds();
  }, [userId, selectedActiveDomain, selectedExpiredDomain]);

  const handleMenuPress = (ad, position) => {
    // Don't show menu for rofhub domains
    if (ad.ad_creation_domain?.startsWith('rofhub_')) {
      return;
    }
    
    const isActive = activeAds.some(a => a.ad_id === ad.ad_id);
    setSelectedAdType(isActive ? 'active' : 'expired');
    setSelectedAd(ad);
    setDropdownPosition(position);
    setDropdownVisible(true);
  };

  const handleViewAd = (ad) => {
    setDropdownVisible(false);
    props.navigation.navigate('SingleAdScreen', { ad_id: ad.ad_id, ad });
  };

  const handleEdit = (ad) => {
    setDropdownVisible(false);
    props.navigation.replace('EditAdScreen', { ad_id: ad.ad_id });
  };

  const handleDelete = (ad, type) => {
    setDropdownVisible(false);
    Alert.alert('Delete Ad', `Are you sure you want to delete "${ad.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const success = await dispatch(deleteUserAd(userId, ad.ad_id));
          if (success) {
            // Update the appropriate list
            if (type === 'active') {
              setActiveAds(prev => prev.filter(a => a.ad_id !== ad.ad_id));
            } else {
              setExpiredAds(prev => prev.filter(a => a.ad_id !== ad.ad_id));
            }
          } else {
            Alert.alert('Error', 'Failed to delete ad.');
          }
        },
      },
    ]);
  };

  const handleRenew = async (ad) => {
    setDropdownVisible(false);

    Alert.alert("Renew Ad", `Are you sure you want to renew "${ad.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Renew",
        onPress: async () => {
          try {
            const result = await dispatch(renewUserAd(userId, ad.ad_id));

            if (!result?.data) {
              Alert.alert("Error", result?.message || "Unable to renew ad.");
              return;
            }

            const api = result.data;

            if (api.status === 200 || api.status === 201) {
              // Remove from expired and reload active ads with current filter
              setExpiredAds(prev => prev.filter(a => a.ad_id !== ad.ad_id));
              
              // Reload active ads with current filter
              const refreshedActive = await dispatch(fetchActiveAds(userId, selectedActiveDomain));
              if (refreshedActive) {
                setActiveAds(refreshedActive);
              }

              Alert.alert("Success", `"${ad.title}" renewed successfully!`);
              return;
            }

            if (api.status === 202 && api.client_secret) {
              const clientSecret = api.client_secret;

              const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: "Myfame",
              });

              if (initError) {
                Alert.alert("Payment Error", initError.message);
                return;
              }

              const { error: paymentError } = await presentPaymentSheet();

              if (paymentError) {
                Alert.alert("Payment Failed", paymentError.message);
                return;
              }

              // Remove from expired and reload active ads with current filter
              setExpiredAds(prev => prev.filter(a => a.ad_id !== ad.ad_id));
              
              // Reload active ads with current filter
              const refreshedActive = await dispatch(fetchActiveAds(userId, selectedActiveDomain));
              if (refreshedActive) {
                setActiveAds(refreshedActive);
              }

              Alert.alert("Success", `"${ad.title}" renewed successfully!`);
              return;
            }

            Alert.alert("Error", "Unexpected renewal response.");
          } catch (err) {
            console.log("Renew error:", err);
            Alert.alert("Error", "Something went wrong while renewing ad.");
          }
        },
      },
    ]);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Overlay to close dropdown when clicking outside */}
      {dropdownVisible && (
        <TouchableOpacity 
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={closeDropdown}
        />
      )}

      <AdvertiserDashboardTabs
        activeAds={activeAds}
        expiredAds={expiredAds}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleRenew={handleRenew}
        loadingActive={loadingActive}
        loadingExpired={loadingExpired}
        onMenuPress={handleMenuPress}
        onViewAd={handleViewAd}
        selectedDomain={selectedActiveDomain}
        selectedExpiredDomain={selectedExpiredDomain}
        onOpenFilter={() => setActiveFilterDropdownVisible(true)}
        onOpenExpiredFilter={() => setExpiredFilterDropdownVisible(true)}
        showFilterButton={true}
      />

      <ActionDropdown
        visible={dropdownVisible}
        position={dropdownPosition}
        onClose={closeDropdown}
        ad={selectedAd}
        type={selectedAdType}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleRenew={handleRenew}
        handleViewAd={handleViewAd}
      />

      {/* Active Ads Filter Dropdown */}
      <DomainFilterDropdown
        visible={activeFilterDropdownVisible}
        onClose={() => setActiveFilterDropdownVisible(false)}
        selectedDomain={selectedActiveDomain}
        onSelectDomain={setSelectedActiveDomain}
      />

      {/* Expired Ads Filter Dropdown */}
      <DomainFilterDropdown
        visible={expiredFilterDropdownVisible}
        onClose={() => setExpiredFilterDropdownVisible(false)}
        selectedDomain={selectedExpiredDomain}
        onSelectDomain={setSelectedExpiredDomain}
      />
    </View>
  );
};

// ✅ Updated Styles (just added new styles)
const styles = StyleSheet.create({
  // Existing styles remain the same...
  
  // Filter Header
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003366',
  },

  // Domain Filter Dropdown
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterDropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    width: screenWidth * 0.4,
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    position: "absolute",
    top: 160,
    right: 11,
    borderWidth: 1,
    borderColor: 'rgba(0, 187, 245, 0.1)',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  filterOptionSelected: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1.5,
    borderColor: '#00BBF5',
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterOptionIcon: {
    marginRight: 12,
  },
  filterOptionTextContainer: {
    flex: 1,
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
  },
  filterOptionTextSelected: {
    color: '#003366',
    fontWeight: '600',
  },
  filterOptionDescription: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  
  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },

  scroll: { 
    padding: 16, 
    paddingBottom: 60,
  },

  panel: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 5,
    position: 'relative',
  },
  panelHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 10 
  },
  panelTextContainer: { 
    flex: 1, 
    marginRight: 10 
  },
  panelTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#003366', 
    marginBottom: 4 
  },
  panelPrice: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#00BBF5', 
    marginBottom: 4 
  },
  panelDescription: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 2 
  },
  panelCategory: { 
    fontSize: 12, 
    color: '#888', 
    fontStyle: 'italic' 
  },

  siteBadgeContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginTop: 8 
  },
  siteBadge: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00BBF5',
    marginRight: 8,
    marginBottom: 6,
  },
  siteBadgeText: { 
    color: '#003366', 
    fontSize: 12, 
    fontWeight: '700' 
  },

  panelFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12 
  },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    borderWidth: 1 
  },
  approvedBadge: { 
    backgroundColor: '#E8F5E8', 
    borderColor: '#4CAF50' 
  },
  pendingBadge: { 
    backgroundColor: '#FFF3E0', 
    borderColor: '#FF9800' 
  },

  statusText: { 
    fontSize: 12, 
    fontWeight: '600' 
  },
  approvedText: { 
    color: '#2E7D32' 
  },
  pendingText: { 
    color: '#EF6C00' 
  },

  daysBadge: { 
    backgroundColor: '#E3F2FD', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  daysText: { 
    fontSize: 11, 
    color: '#1976D2', 
    fontWeight: '500' 
  },

  dotsButton: { 
    padding: 5,
    position: 'relative',
    zIndex: 10,
  },

  panelActions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    position: "absolute", 
    bottom: 10, 
    right: 10
  },
  panelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  panelButtonText: {
    fontSize: 14,
    color: '#00BBF5',
    fontWeight: '600',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Dropdown styles
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 187, 245, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 100,
    width: 140,
  },
  dropdownArrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 187, 245, 0.15)',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'white',
  },
  dropdownOptionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#FF4D4D',
    fontWeight: '600',
  },
});

export default AdvertiserDashboard;