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
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Context/AuthContext';
import GetBankDetailsAPI from '../../Fetch_API/GetBankDetailsAPI';
import SaveBankDetailsAPI from '../../Fetch_API/SaveBankDetailsAPI';
import RequestWithdrawAPI from '../../Fetch_API/RequestWithdrawAPI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const InfluencerWalletScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [requestingWithdraw, setRequestingWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [walletBalance, setWalletBalance] = useState(1000); // Default balance, you should get this from your dashboard API
  
  const { userId } = useContext(AuthContext);

const showNotification = (message, type = 'error') => {
  setNotification({
    visible: true,
    message,
    type
  });
};
  const [notification, setNotification] = useState({
  visible: false,
  message: '',
  type: 'error', // 'error', 'success', 'info'
});


useEffect(() => {
  if (notification.visible) {
    const timer = setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }
}, [notification.visible]);
  // Helper function to mask sensitive data
  const maskString = (str, visibleChars = 4) => {
    if (!str) return '';
    const strLength = str.length;
    if (strLength <= visibleChars * 2) return '•'.repeat(strLength);
    
    const firstVisible = str.substring(0, visibleChars);
    const lastVisible = str.substring(strLength - visibleChars);
    const maskedMiddle = '•'.repeat(strLength - (visibleChars * 2));
    
    return firstVisible + maskedMiddle + lastVisible;
  };

  // Mask account name (show first and last characters)
  const maskAccountName = (name) => {
    if (!name) return '';
    if (name.length <= 4) return '•'.repeat(name.length);
    
    const firstChar = name.charAt(0);
    const lastChar = name.charAt(name.length - 1);
    const maskedMiddle = '•'.repeat(name.length - 2);
    
    return firstChar + maskedMiddle + lastChar;
  };

  // Mask UPI ID
  const maskUpiId = (upiId) => {
    if (!upiId) return '';
    const [prefix, suffix] = upiId.split('@');
    if (!suffix) return maskString(upiId);
    
    const maskedPrefix = maskString(prefix, 2);
    return `${maskedPrefix}@${suffix}`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

const fetchBankDetails = useCallback(async () => {
  if (!userId) {
    console.error('Cannot fetch bank details: userId is null');
    setLoading(false);
    setRefreshing(false);
    return;
  }

  try {
    setLoading(true);
    const data = await GetBankDetailsAPI(userId);
    setBankDetails(data);
    if (data) {
      // Pre-fill form with existing data for editing
      setFormData({
        bank_account_name:  '',
        bank_account_number:  '',
        bank_ifsc:   '',
        bank_name:   '',
        bank_upi_id:   '',
      });
    }
  } catch (error) {
    console.error('Error fetching bank details:', error);
    showNotification(error.message || 'Failed to fetch bank details', 'error');
    setBankDetails(null);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [userId]);

  useEffect(() => {
    if (userId) {
      fetchBankDetails();
    }
  }, [fetchBankDetails, userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBankDetails();
  }, [fetchBankDetails]);

  const toggleDetailsVisibility = () => {
    setShowFullDetails(!showFullDetails);
  };

  const handleAddUpdate = () => {
    setFormErrors({});
    setShowAddModal(true);
  };

  const handleWithdraw = () => {
    if (!bankDetails) {
      Alert.alert(
        'Bank Details Required',
        'Please add your bank details before requesting a withdrawal.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Bank Details', onPress: () => setShowAddModal(true) }
        ]
      );
      return;
    }
    
    setWithdrawAmount('');
    setWithdrawError('');
    setShowWithdrawModal(true);
  };

const handleWithdrawSubmit = async () => {
  if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
    setWithdrawError('Please enter a valid amount');
    showNotification('Please enter a valid amount', 'error');
    return;
  }

  const amount = parseFloat(withdrawAmount);
  
  if (amount > walletBalance) {
    setWithdrawError(`Cannot withdraw more than ${formatCurrency(walletBalance)}`);
    showNotification(`Cannot withdraw more than ${formatCurrency(walletBalance)}`, 'error');
    return;
  }

  if (amount < 1) {
    setWithdrawError('Minimum withdrawal amount is $1.00');
    showNotification('Minimum withdrawal amount is $1.00', 'error');
    return;
  }

  setRequestingWithdraw(true);
  try {
    const result = await RequestWithdrawAPI(userId, amount);
    
    if (result.status === 200) {
      showNotification(
        `Withdrawal request submitted successfully!\nRequested Amount: ${formatCurrency(amount)}`,
        'success'
      );
      
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      // Update wallet balance with remaining balance from API
      setWalletBalance(result.remaining_balance);
    } else {
      throw new Error(result.message || 'Failed to submit withdrawal request');
    }
  } catch (error) {
    console.error('Error requesting withdrawal:', error);
    showNotification(error.message || 'Failed to submit withdrawal request', 'error');
  } finally {
    setRequestingWithdraw(false);
  }
};

  const [formData, setFormData] = useState({
    bank_account_name: '',
    bank_account_number: '',
    bank_ifsc: '',
    bank_name: '',
    bank_upi_id: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.bank_account_name?.trim()) {
      errors.bank_account_name = 'Account holder name is required';
    }
    
    if (!formData.bank_account_number?.trim()) {
      errors.bank_account_number = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(formData.bank_account_number.replace(/\s/g, ''))) {
      errors.bank_account_number = 'Enter a valid account number (9-18 digits)';
    }
    
    if (!formData.bank_ifsc?.trim()) {
      errors.bank_ifsc = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bank_ifsc.toUpperCase())) {
      errors.bank_ifsc = 'Enter a valid IFSC code (e.g., HDFC0001234)';
    }
    
    if (!formData.bank_name?.trim()) {
      errors.bank_name = 'Bank name is required';
    }
    
    if (formData.bank_upi_id && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(formData.bank_upi_id)) {
      errors.bank_upi_id = 'Enter a valid UPI ID (e.g., username@upi)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSave = async () => {
  if (!validateForm()) {
    return;
  }

  setSaving(true);
  try {
    const saveData = {
      influencer_id: userId,
      ...formData
    };

    const result = await SaveBankDetailsAPI(saveData);
    
    if (result.status === 200) {
      showNotification(result.message || 'Bank details saved successfully', 'success');
      setShowAddModal(false);
      // Refresh bank details
      fetchBankDetails();
    } else {
      throw new Error(result.message || 'Failed to save bank details');
    }
  } catch (error) {
    console.error('Error saving bank details:', error);
    showNotification(error.message || 'Failed to save bank details', 'error');
  } finally {
    setSaving(false);
  }
};

  const handleCancel = () => {
    if (bankDetails) {
      // Reset form to existing data
      setFormData({
        bank_account_name: '',
        bank_account_number: '',
        bank_ifsc: '',
        bank_name: '',
        bank_upi_id: '',
      });
    } else {
      // Reset to empty form
      setFormData({
        bank_account_name: '',
        bank_account_number: '',
        bank_ifsc: '',
        bank_name: '',
        bank_upi_id: '',
      });
    }
    setFormErrors({});
    setShowAddModal(false);
  };

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
        <Text style={styles.headerTitle}>Wallet & Payments</Text>
        <Text style={styles.headerSubtitle}>
          {bankDetails ? 'Manage your funds securely' : 'Add your bank details'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={onRefresh}
        activeOpacity={0.7}
        disabled={refreshing}
      >
 
      </TouchableOpacity>
    </View>
  );


  const renderNotification = () => {
  if (!notification.visible) return null;

  const backgroundColor = notification.type === 'success' ? '#4CAF50' : 
                         notification.type === 'info' ? '#2196F3' : '#F44336';
  
  const icon = notification.type === 'success' ? 'check-circle' :
               notification.type === 'info' ? 'information' : 'alert-circle';

  return (
    <View style={[styles.notificationContainer, { backgroundColor }]}>
      <MaterialCommunityIcons name={icon} size={20} color="#fff" />
      <Text style={styles.notificationText}>{notification.message}</Text>
      <TouchableOpacity 
        onPress={() => setNotification(prev => ({ ...prev, visible: false }))}
        style={styles.notificationClose}
      >
        <MaterialCommunityIcons name="close" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

  const renderAddModal = () => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={showAddModal}
    onRequestClose={handleCancel}
  >
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.modalContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {bankDetails ? 'Update Bank Details' : 'Add Bank Details'}
            </Text>
            <TouchableOpacity onPress={handleCancel}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
             <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Account Holder Name *</Text>
              <TextInput
                style={[
                  styles.formInput,
                  formErrors.bank_account_name && styles.formInputError
                ]}
                value={formData.bank_account_name}
                onChangeText={(text) => handleFormChange('bank_account_name', text)}
                placeholder="Enter account holder name"
                placeholderTextColor="#94A3B8"
              />
              {formErrors.bank_account_name && (
                <Text style={styles.errorText}>{formErrors.bank_account_name}</Text>
              )}
            </View>

             <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Account Number *</Text>
              <TextInput
                style={[
                  styles.formInput,
                  formErrors.bank_account_number && styles.formInputError
                ]}
                value={formData.bank_account_number}
                onChangeText={(text) => handleFormChange('bank_account_number', text)}
                placeholder="Enter account number"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={18}
              />
              {formErrors.bank_account_number && (
                <Text style={styles.errorText}>{formErrors.bank_account_number}</Text>
              )}
            </View>

            {/* IFSC Code */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>IFSC Code *</Text>
              <TextInput
                style={[
                  styles.formInput,
                  formErrors.bank_ifsc && styles.formInputError
                ]}
                value={formData.bank_ifsc}
                onChangeText={(text) => handleFormChange('bank_ifsc', text.toUpperCase())}
                placeholder="Enter IFSC code (e.g., HDFC0001234)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={11}
              />
              {formErrors.bank_ifsc && (
                <Text style={styles.errorText}>{formErrors.bank_ifsc}</Text>
              )}
            </View>

            {/* Bank Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bank Name *</Text>
              <TextInput
                style={[
                  styles.formInput,
                  formErrors.bank_name && styles.formInputError
                ]}
                value={formData.bank_name}
                onChangeText={(text) => handleFormChange('bank_name', text)}
                placeholder="Enter bank name"
                placeholderTextColor="#94A3B8"
              />
              {formErrors.bank_name && (
                <Text style={styles.errorText}>{formErrors.bank_name}</Text>
              )}
            </View>

            {/* UPI ID (Optional) */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>UPI ID (Optional)</Text>
              <TextInput
                style={[
                  styles.formInput,
                  formErrors.bank_upi_id && styles.formInputError
                ]}
                value={formData.bank_upi_id}
                onChangeText={(text) => handleFormChange('bank_upi_id', text)}
                placeholder="Enter UPI ID (e.g., username@upi)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
              />
              {formErrors.bank_upi_id && (
                <Text style={styles.errorText}>{formErrors.bank_upi_id}</Text>
              )}
              <Text style={styles.formHint}>
                Optional - For UPI payments
              </Text>
            </View>

            {/* Note */}
            <View style={styles.noteContainer}>
              <MaterialCommunityIcons name="information-outline" size={16} color="#00BBF5" />
              <Text style={styles.noteText}>
                Your bank details are encrypted and stored securely. We never share them with third parties.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="check" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>
                    {bankDetails ? 'Update Details' : 'Save Details'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </Modal>
);

  const renderWalletBalanceCard = () => (
    <View style={styles.walletCardContainer}>
      <LinearGradient
        colors={['#2196F3', '#2d8deeff', '#0D47A1']}
        style={styles.walletCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.walletCardHeader}>
          <MaterialCommunityIcons name="wallet-outline" size={24} color="#fff" />
          <Text style={styles.walletCardTitle}>Available Balance</Text>
        </View>
        
         
        <TouchableOpacity 
          style={styles.withdrawButton}
          onPress={handleWithdraw}
          activeOpacity={0.7}
          disabled={!bankDetails || walletBalance < 1}
        >
          <MaterialCommunityIcons name="bank-transfer-out" size={20} color="#fff" />
          <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
        </TouchableOpacity>
        
        {(!bankDetails || walletBalance < 1) && (
          <Text style={styles.walletNote}>
            {!bankDetails 
              ? 'Add bank details to withdraw' 
              : 'Minimum $1.00 required for withdrawal'}
          </Text>
        )}
      </LinearGradient>
    </View>
  );

const renderBankCard = () => {
  if (!bankDetails) return null;

  return (
    <View style={styles.bankCardContainer}>
      <LinearGradient
                  colors={['#00BBF5', '#0099CC']}
        style={styles.bankCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Add Withdraw Money Icon at Top Right */}
        <TouchableOpacity 
          style={styles.withdrawMoneyIcon}
          onPress={handleWithdraw}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="cash" size={24} color="#FFD700" />
        </TouchableOpacity>

        <View style={styles.cardHeader}>
          <View style={styles.bankLogoContainer}>
            <MaterialCommunityIcons name="bank-outline" size={24} color="#fff" />
            <Text style={styles.bankName}>
              {bankDetails.bank_name || 'Bank Name'}
            </Text>
          </View>
          <View style={styles.cardTypeContainer}>
            <MaterialCommunityIcons name="credit-card-chip" size={32} color="#FFD700" />
          </View>
        </View>

        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumberLabel}>Account Number</Text>
          <View style={styles.cardNumberRow}>
            <MaterialCommunityIcons name="credit-card" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.cardNumber}>
              {showFullDetails 
                ? bankDetails.bank_account_number 
                : maskString(bankDetails.bank_account_number, 4)}
            </Text>
          </View>
        </View>

        <View style={styles.cardDetailRow}>
          <View style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>Account Holder</Text>
            <Text style={styles.cardDetailValue}>
              {showFullDetails 
                ? bankDetails.bank_account_name 
                : maskAccountName(bankDetails.bank_account_name)}
            </Text>
          </View>
        </View>

        <View style={styles.cardDetailRow}>
          <View style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>IFSC Code</Text>
            <Text style={styles.cardDetailValue}>
              {showFullDetails 
                ? bankDetails.bank_ifsc 
                : maskString(bankDetails.bank_ifsc, 2)}
            </Text>
          </View>
          
          <View style={styles.cardDetail}>
            <Text style={styles.cardDetailLabel}>UPI ID</Text>
            <Text style={styles.cardDetailValue}>
              {showFullDetails 
                ? bankDetails.bank_upi_id 
                : maskUpiId(bankDetails.bank_upi_id)}
            </Text>
          </View>
        </View>

        <View style={styles.securityNotice}>
          <MaterialCommunityIcons name="shield-check-outline" size={16} color="#4CAF50" />
          <Text style={styles.securityText}>
            {showFullDetails ? 'Full details visible' : 'Details masked for security'}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.bankCardActions}>
 

        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleAddUpdate}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

  const renderWithdrawalInfo = () => (
    <View style={styles.withdrawalInfoContainer}>
       

      
      <View style={styles.infoCard}>
        <View style={styles.infoCardHeader}>
          <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#FF9800" />
          <Text style={styles.infoCardTitle}>Important Notes</Text>
        </View>
        
        <View style={styles.noteItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.noteText}>
            Withdrawals are processed within 3-5 business days
          </Text>
        </View>
        
        <View style={styles.noteItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.noteText}>
            Minimum withdrawal amount is $1.00
          </Text>
        </View>
        
        <View style={styles.noteItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.noteText}>
            You can only make 3 withdrawal requests
          </Text>
        </View>
        
        <View style={styles.noteItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.noteText}>
            Admin will manually process payments
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIconContainer}>
        <MaterialCommunityIcons name="bank-plus" size={80} color="#00BBF5" />
      </View>
      <Text style={styles.emptyStateTitle}>Add Bank Details</Text>
      <Text style={styles.emptyStateText}>
        To receive payments and withdraw funds, please add your bank account details securely.
      </Text>
      
 
      
      <View style={styles.emptyStateBenefits}>
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Secure & Encrypted Storage</Text>
        </View>
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Fast Withdrawal Processing</Text>
        </View>
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.benefitText}>Direct Bank Transfers</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddUpdate}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Add Bank Details</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWithdrawModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showWithdrawModal}
      onRequestClose={() => setShowWithdrawModal(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Withdrawal</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.withdrawFormContainer}
              showsVerticalScrollIndicator={false}
            >
 
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Withdrawal Amount ($)</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[
                      styles.amountInput,
                      withdrawError && styles.formInputError
                    ]}
                    value={withdrawAmount}
                    onChangeText={(text) => {
                      setWithdrawAmount(text.replace(/[^0-9.]/g, ''));
                      setWithdrawError('');
                    }}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                    maxLength={10}
                  />
                </View>
                {withdrawError && (
                  <Text style={styles.errorText}>{withdrawError}</Text>
                )}
                
                <View style={styles.quickAmounts}>
                  {[10, 50, 100, 500].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.quickAmountButton}
                      onPress={() => {
                        setWithdrawAmount(amount.toString());
                        setWithdrawError('');
                      }}
                    >
                      <Text style={styles.quickAmountText}>${amount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.bankInfoPreview}>
                <Text style={styles.bankInfoLabel}>Funds will be sent to:</Text>
                <View style={styles.bankInfoRow}>
                  <MaterialCommunityIcons name="bank" size={16} color="#666" />
                  <Text style={styles.bankInfoText} numberOfLines={1}>
                    {bankDetails?.bank_name || 'Not specified'}
                  </Text>
                </View>
                <View style={styles.bankInfoRow}>
                  <MaterialCommunityIcons name="account" size={16} color="#666" />
                  <Text style={styles.bankInfoText} numberOfLines={1}>
                    {maskAccountName(bankDetails?.bank_account_name || '')}
                  </Text>
                </View>
                <View style={styles.bankInfoRow}>
                  <MaterialCommunityIcons name="credit-card" size={16} color="#666" />
                  <Text style={styles.bankInfoText} numberOfLines={1}>
                    {maskString(bankDetails?.bank_account_number || '', 4)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.noteContainer}>
                <MaterialCommunityIcons name="information-outline" size={16} color="#00BBF5" />
                <Text style={styles.noteText}>
                  • Withdrawals are processed within 3-5 business days{'\n'}
                  • Minimum withdrawal amount is $1.00{'\n'}
                  • You can only withdraw 3 times
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowWithdrawModal(false)}
                disabled={requestingWithdraw}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.withdrawSubmitButton]}
                onPress={handleWithdrawSubmit}
                disabled={requestingWithdraw || !withdrawAmount}
              >
                {requestingWithdraw ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="send" size={20} color="#fff" />
                    <Text style={styles.withdrawSubmitText}>Withdraw</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#00BBF5" />
          <Text style={styles.loadingText}>Loading wallet information...</Text>
          <Text style={styles.loadingSubtext}>Securely fetching your data</Text>
        </View>
      );
    }

    if (!bankDetails) {
      return renderEmptyState();
    }

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00BBF5']}
            tintColor="#00BBF5"
          />
        }
      >
 
        {renderBankCard()}
        {renderWithdrawalInfo()}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      {renderHeader()}
          {renderNotification()} 

      <View style={styles.mainContent}>
        {renderContent()}
      </View>
      {renderAddModal()}
      {renderWithdrawModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 15 : 35,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
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
  mainContent: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  walletCardContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  walletCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  walletCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  walletCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  walletAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 24,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 8,
  },
  withdrawButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '700',
  },
  walletNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#E6F7FF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateBenefits: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00BBF5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#00BBF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  bankCardContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  bankCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  bankLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  cardTypeContainer: {
    opacity: 0.9,
  },
  cardNumberContainer: {
    marginBottom: 24,
  },
  cardNumberLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    fontWeight: '500',
  },
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  cardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardDetail: {
    flex: 1,
  },
  cardDetailLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontWeight: '500',
  },
  cardDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  bankCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BBF5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  withdrawalInfoContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003366',
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00BBF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  infoStepText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    lineHeight: 18,
  },
  // Withdraw Modal Styles
  withdrawFormContainer: {
    maxHeight: 400,
  },
  balanceInfo: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#E6F7FF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00BBF5',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#003366',
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#003366',
    paddingVertical: 12,
    paddingRight: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 20,
  },
  quickAmountButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
  },
  bankInfoPreview: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bankInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 12,
  },
  bankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  bankInfoText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  withdrawSubmitButton: {
    backgroundColor: '#00BBF5',
  },
  withdrawSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  // Common Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  formInputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
    marginHorizontal: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E6F7FF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    gap: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#00BBF5',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
    formContainer: {
    padding: 20,
    maxHeight: 400,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#003366',
  },
  formHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
   withdrawMoneyIcon: {
    position: 'absolute',
bottom:90,
right:20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },

   notificationContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  notificationClose: {
    padding: 4,
  },
});

export default InfluencerWalletScreen;