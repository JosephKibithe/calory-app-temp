import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator, TextInput } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

// Default subscription data
const subscriptionData = {
  type: 'Free',
  renews: 'N/A',
  isActive: true,
};

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [calorieTarget, setCalorieTarget] = useState('');
  const [dietPreference, setDietPreference] = useState('No Restrictions');
  const [isSaving, setIsSaving] = useState(false);
  
  const { signOut } = useAuth();
  const { userProfile, loading, updateProfile } = useUser();

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setAge(userProfile.age ? userProfile.age.toString() : '');
      setHeight(userProfile.height ? userProfile.height.toString() : '');
      setWeight(userProfile.weight ? userProfile.weight.toString() : '');
      setCalorieTarget(userProfile.calorie_target ? userProfile.calorie_target.toString() : '2000');
    }
  }, [userProfile]);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        age: age ? parseInt(age) : undefined,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        calorie_target: calorieTarget ? parseInt(calorieTarget) : 2000,
      });
      setIsEditingProfile(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingItem = (icon: any, title: string, value: string | null, onPress?: () => void) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={22} color="#4CAF50" style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {value && <Text style={styles.settingValue}>{value}</Text>}
    </TouchableOpacity>
  );

  const renderToggleItem = (icon: any, title: string, value: boolean, onValueChange: (value: boolean) => void) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon} size={22} color="#4CAF50" style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
        thumbColor={value ? '#4CAF50' : '#F5F5F5'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            {/* Profile Section */}
            <View style={styles.section}>
              {isEditingProfile ? (
                <View style={styles.editProfileForm}>
                  <Text style={styles.sectionTitle}>Edit Profile</Text>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Full Name</Text>
                    <TextInput
                      style={styles.formInput}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter your full name"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Age</Text>
                    <TextInput
                      style={styles.formInput}
                      value={age}
                      onChangeText={setAge}
                      placeholder="Enter your age"
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Height (cm)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={height}
                      onChangeText={setHeight}
                      placeholder="Enter your height"
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Weight (kg)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="Enter your weight"
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Daily Calorie Target</Text>
                    <TextInput
                      style={styles.formInput}
                      value={calorieTarget}
                      onChangeText={setCalorieTarget}
                      placeholder="Enter your daily calorie target"
                      keyboardType="number-pad"
                    />
                  </View>
                  <View style={styles.formActions}>
                    <TouchableOpacity 
                      style={[styles.formButton, styles.cancelButton]}
                      onPress={() => setIsEditingProfile(false)}
                      disabled={isSaving}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.formButton, styles.saveButton]}
                      onPress={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.profileHeader}>
                    <View style={styles.profileAvatar}>
                      <Text style={styles.profileInitials}>{(userProfile?.full_name || 'U').charAt(0)}</Text>
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{userProfile?.full_name || 'User'}</Text>
                      <Text style={styles.profileEmail}>{userProfile?.email || ''}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.editProfileButton}
                    onPress={() => setIsEditingProfile(true)}
                  >
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}

        {!loading && (
          <>
            {/* Subscription Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Subscription</Text>
              <View style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                  <Text style={styles.subscriptionType}>{subscriptionData.type}</Text>
                  <View style={styles.subscriptionBadge}>
                    <Text style={styles.subscriptionBadgeText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.subscriptionRenewal}>
                  {subscriptionData.type === 'Free' ? 'Free plan' : `Renews on ${subscriptionData.renews}`}
                </Text>
                <TouchableOpacity style={styles.subscriptionButton}>
                  <Text style={styles.subscriptionButtonText}>Upgrade to Premium</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {!loading && (
          <>
            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              {renderSettingItem('nutrition-outline', 'Daily Calorie Target', userProfile?.calorie_target?.toString() || '2000', () => setIsEditingProfile(true))}
              {renderSettingItem('restaurant-outline', 'Diet Preference', dietPreference, () => console.log('Diet preference pressed'))}
              {renderToggleItem('notifications-outline', 'Notifications', notifications, setNotifications)}
              {renderToggleItem('moon-outline', 'Dark Mode', darkMode, setDarkMode)}
              {renderToggleItem('cloud-offline-outline', 'Offline Mode', offlineMode, setOfflineMode)}
            </View>
          </>
        )}

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          {renderSettingItem('help-circle-outline', 'Help & Support', null, () => console.log('Help & Support pressed'))}
          {renderSettingItem('shield-checkmark-outline', 'Privacy Policy', null, () => console.log('Privacy Policy pressed'))}
          {renderSettingItem('document-text-outline', 'Terms of Service', null, () => console.log('Terms of Service pressed'))}
          {renderSettingItem('information-circle-outline', 'About', 'Version 1.0.0', () => console.log('About pressed'))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/capture')}>
          <Ionicons name="camera-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/meal-history')}>
          <Ionicons name="bar-chart-outline" size={24} color="#757575" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings" size={24} color="#4CAF50" />
          <Text style={[styles.navText, styles.navTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 60, // Add padding to account for the bottom navigation bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  editProfileForm: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  formButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 34, // Adjusted from 0 to bring it higher up
    left: 10,
    right: 10,
    height: 56,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 999,
    borderRadius: 28,
    marginBottom: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#757575',
  },
  navTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#757575',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#757575',
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editProfileButtonText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  subscriptionCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  subscriptionBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  subscriptionBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  subscriptionRenewal: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
  },
  subscriptionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  subscriptionButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
    color: '#757575',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
