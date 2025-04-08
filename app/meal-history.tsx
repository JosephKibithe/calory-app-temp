import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for meal history
const mockMealHistory = [
  {
    date: 'Today',
    meals: [
      { id: 1, name: 'Breakfast', time: '8:30 AM', calories: 450, items: ['Oatmeal', 'Banana', 'Coffee'] },
      { id: 2, name: 'Lunch', time: '12:45 PM', calories: 680, items: ['Chicken Salad', 'Apple', 'Water'] },
    ],
    totalCalories: 1130,
  },
  {
    date: 'Yesterday',
    meals: [
      { id: 3, name: 'Breakfast', time: '7:45 AM', calories: 520, items: ['Eggs', 'Toast', 'Orange Juice'] },
      { id: 4, name: 'Lunch', time: '1:15 PM', calories: 750, items: ['Sandwich', 'Chips', 'Soda'] },
      { id: 5, name: 'Dinner', time: '7:30 PM', calories: 850, items: ['Pasta', 'Salad', 'Wine'] },
    ],
    totalCalories: 2120,
  },
  {
    date: 'April 6, 2025',
    meals: [
      { id: 6, name: 'Breakfast', time: '9:00 AM', calories: 380, items: ['Yogurt', 'Granola', 'Berries'] },
      { id: 7, name: 'Lunch', time: '12:30 PM', calories: 620, items: ['Soup', 'Bread', 'Fruit'] },
      { id: 8, name: 'Dinner', time: '6:45 PM', calories: 720, items: ['Grilled Chicken', 'Rice', 'Vegetables'] },
    ],
    totalCalories: 1720,
  },
];

// Filter options for the meal history
const filterOptions = ['All', 'This Week', 'Last Week', 'This Month'];

export default function MealHistory() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [mealHistory, setMealHistory] = useState(mockMealHistory);

  const renderMealItem = ({ item }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.mealTime}>{item.time}</Text>
      </View>
      <View style={styles.mealContent}>
        <Text style={styles.mealCalories}>{item.calories} cal</Text>
        <Text style={styles.mealItems}>{item.items.join(', ')}</Text>
      </View>
    </View>
  );

  const renderDaySection = ({ item }) => (
    <View style={styles.daySection}>
      <View style={styles.daySectionHeader}>
        <Text style={styles.dayTitle}>{item.date}</Text>
        <Text style={styles.dayCalories}>{item.totalCalories} cal</Text>
      </View>
      <FlatList
        data={item.meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal History</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterOption,
              selectedFilter === option && styles.filterOptionSelected,
            ]}
            onPress={() => setSelectedFilter(option)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === option && styles.filterTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={mealHistory}
        renderItem={renderDaySection}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
      />

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
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bar-chart" size={24} color="#4CAF50" />
          <Text style={[styles.navText, styles.navTextActive]}>History</Text>
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
    paddingBottom: 60, // Add padding to account for the bottom navigation bar
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterOptionSelected: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#757575',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  daySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  daySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayCalories: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
  },
  mealCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mealName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  mealTime: {
    fontSize: 13,
    color: '#757575',
  },
  mealContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  mealItems: {
    fontSize: 13,
    color: '#757575',
    flex: 1,
    marginLeft: 8,
  },
});
