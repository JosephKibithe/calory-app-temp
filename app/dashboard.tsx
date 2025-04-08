import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for demonstration
const mockMeals = [
  { id: 1, name: 'Breakfast', time: '8:30 AM', calories: 450, items: ['Oatmeal', 'Banana', 'Coffee'] },
  { id: 2, name: 'Lunch', time: '12:45 PM', calories: 680, items: ['Chicken Salad', 'Apple', 'Water'] },
];

// Mock user data
const userData = {
  calorieTarget: 2000,
  consumedCalories: 1130, // Sum of mockMeals calories
  remainingCalories: 870, // calorieTarget - consumedCalories
  macros: {
    protein: 75, // grams
    carbs: 120, // grams
    fat: 40, // grams
  }
};

export default function Dashboard() {
  const [meals, setMeals] = useState(mockMeals);
  
  // Calculate progress percentage for the circular progress bar
  const progressPercentage = (userData.consumedCalories / userData.calorieTarget) * 100;
  
  // Function to render the circular progress bar
  const renderProgressCircle = () => {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
    
    return (
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircle}>
          <View style={styles.progressBackground} />
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.calorieInfoContainer}>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieInfoValue}>{userData.consumedCalories}</Text>
            <Text style={styles.calorieInfoLabel}>consumed</Text>
          </View>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieInfoValue}>{userData.remainingCalories}</Text>
            <Text style={styles.calorieInfoLabel}>remaining</Text>
          </View>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieInfoValue}>{userData.calorieTarget}</Text>
            <Text style={styles.calorieInfoLabel}>target</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="person-circle-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContent}>
        {/* Calorie Progress Section */}
        <View style={styles.calorieCard}>
          {renderProgressCircle()}
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{userData.macros.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{userData.macros.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{userData.macros.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>
        
        {/* Meals Section */}
        <View style={styles.mealsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meals</Text>
            <Link href="/meal-history" style={styles.seeAllLink}>
              <Text style={styles.seeAllText}>See All</Text>
            </Link>
          </View>
          
          {meals.map(meal => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.mealContent}>
                <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                <Text style={styles.mealItems}>{meal.items.join(', ')}</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addMealButton} onPress={() => router.push('/capture')}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addMealButtonText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="home" size={24} color="#4CAF50" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/capture')}>
          <Ionicons name="camera-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/meal-history')}>
          <Ionicons name="bar-chart-outline" size={24} color="#757575" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
    paddingBottom: 60, // Add padding to account for the bottom navigation bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profileButton: {
    padding: 5,
  },

  calorieCard: {
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
  progressCircleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  calorieInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 5,
  },
  calorieInfo: {
    alignItems: 'center',
  },
  calorieInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calorieInfoLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  progressCircle: {
    height: 16,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E0E0E0',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 12,
    color: '#757575',
  },
  mealsSection: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllLink: {
    padding: 5,
  },
  seeAllText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  mealCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealTime: {
    fontSize: 14,
    color: '#757575',
  },
  mealContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4CAF50',
  },
  mealItems: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
    marginLeft: 10,
  },
  addMealButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addMealButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
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
    paddingVertical: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 3,
    color: '#757575',
  },
  navTextActive: {
    color: '#4CAF50',
  },
});
