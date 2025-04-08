import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for food analysis results
const initialFoodItems = [
  {
    id: 1,
    name: 'Grilled Chicken Breast',
    quantity: '1 piece (120g)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    verified: true,
  },
  {
    id: 2,
    name: 'Brown Rice',
    quantity: '1 cup (195g)',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    verified: true,
  },
  {
    id: 3,
    name: 'Steamed Broccoli',
    quantity: '1 cup (91g)',
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    verified: true,
  },
];

export default function AnalysisResults() {
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  
  // Calculate total nutrition values
  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = foodItems.reduce((sum, item) => sum + item.fat, 0);

  const handleSaveItem = (id: number, updatedItem: any) => {
    setFoodItems(foodItems.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
    setEditingItem(null);
  };

  const handleRemoveItem = (id: number) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
  };

  const handleAddMeal = () => {
    // In a real app, we would save this data to Supabase
    console.log('Saving meal with items:', foodItems);
    router.replace('/dashboard');
  };

  const renderFoodItem = (item: any) => {
    if (editingItem === item.id) {
      return (
        <View key={item.id} style={styles.editItemCard}>
          <Text style={styles.editTitle}>Edit Food Item</Text>
          
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Food Name:</Text>
            <TextInput
              style={styles.editInput}
              value={item.name}
              onChangeText={(text) => setFoodItems(foodItems.map(i => 
                i.id === item.id ? { ...i, name: text } : i
              ))}
            />
          </View>
          
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Quantity:</Text>
            <TextInput
              style={styles.editInput}
              value={item.quantity}
              onChangeText={(text) => setFoodItems(foodItems.map(i => 
                i.id === item.id ? { ...i, quantity: text } : i
              ))}
            />
          </View>
          
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Calories:</Text>
            <TextInput
              style={styles.editInput}
              value={item.calories.toString()}
              keyboardType="numeric"
              onChangeText={(text) => setFoodItems(foodItems.map(i => 
                i.id === item.id ? { ...i, calories: parseInt(text) || 0 } : i
              ))}
            />
          </View>
          
          <View style={styles.macroEditRow}>
            <View style={styles.macroEditField}>
              <Text style={styles.editLabel}>Protein (g):</Text>
              <TextInput
                style={styles.editInput}
                value={item.protein.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setFoodItems(foodItems.map(i => 
                  i.id === item.id ? { ...i, protein: parseFloat(text) || 0 } : i
                ))}
              />
            </View>
            
            <View style={styles.macroEditField}>
              <Text style={styles.editLabel}>Carbs (g):</Text>
              <TextInput
                style={styles.editInput}
                value={item.carbs.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setFoodItems(foodItems.map(i => 
                  i.id === item.id ? { ...i, carbs: parseFloat(text) || 0 } : i
                ))}
              />
            </View>
            
            <View style={styles.macroEditField}>
              <Text style={styles.editLabel}>Fat (g):</Text>
              <TextInput
                style={styles.editInput}
                value={item.fat.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setFoodItems(foodItems.map(i => 
                  i.id === item.id ? { ...i, fat: parseFloat(text) || 0 } : i
                ))}
              />
            </View>
          </View>
          
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={[styles.editButton, styles.cancelButton]} 
              onPress={() => setEditingItem(null)}
            >
              <Text style={styles.editButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, styles.saveButton]} 
              onPress={() => handleSaveItem(item.id, item)}
            >
              <Text style={styles.editButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    return (
      <View key={item.id} style={styles.foodItemCard}>
        <View style={styles.foodItemHeader}>
          <View style={styles.foodItemNameContainer}>
            <Text style={styles.foodItemName}>{item.name}</Text>
            <Text style={styles.foodItemQuantity}>{item.quantity}</Text>
          </View>
          
          <View style={styles.foodItemActions}>
            <TouchableOpacity 
              style={styles.actionIcon} 
              onPress={() => setEditingItem(item.id)}
            >
              <Ionicons name="pencil-outline" size={18} color="#757575" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionIcon} 
              onPress={() => handleRemoveItem(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.nutritionRow}>
          <View style={styles.calorieBox}>
            <Text style={styles.calorieValue}>{item.calories}</Text>
            <Text style={styles.calorieLabel}>calories</Text>
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{item.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{item.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{item.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.verificationRow}>
          <Ionicons 
            name={item.verified ? "checkmark-circle" : "alert-circle-outline"} 
            size={16} 
            color={item.verified ? "#4CAF50" : "#FFC107"} 
          />
          <Text style={[styles.verificationText, { color: item.verified ? "#4CAF50" : "#FFC107" }]}>
            {item.verified ? "AI verified" : "Needs verification"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Meal Summary</Text>
          
          <View style={styles.totalNutrition}>
            <View style={styles.totalCalories}>
              <Text style={styles.totalCaloriesValue}>{totalCalories}</Text>
              <Text style={styles.totalCaloriesLabel}>Total Calories</Text>
            </View>
            
            <View style={styles.totalMacros}>
              <View style={styles.totalMacroItem}>
                <Text style={styles.totalMacroValue}>{totalProtein.toFixed(1)}g</Text>
                <Text style={styles.totalMacroLabel}>Protein</Text>
              </View>
              
              <View style={styles.totalMacroItem}>
                <Text style={styles.totalMacroValue}>{totalCarbs.toFixed(1)}g</Text>
                <Text style={styles.totalMacroLabel}>Carbs</Text>
              </View>
              
              <View style={styles.totalMacroItem}>
                <Text style={styles.totalMacroValue}>{totalFat.toFixed(1)}g</Text>
                <Text style={styles.totalMacroLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.foodItemsSection}>
          <Text style={styles.sectionTitle}>Identified Food Items</Text>
          <Text style={styles.sectionSubtitle}>
            AI has identified {foodItems.length} items in your meal
          </Text>
          
          {foodItems.map(renderFoodItem)}
          
          <TouchableOpacity style={styles.addItemButton}>
            <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.addItemButtonText}>Add Another Food Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveMealButton}
          onPress={handleAddMeal}
        >
          <Text style={styles.saveMealButtonText}>Save to Meal History</Text>
        </TouchableOpacity>
      </View>

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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 34, // Same width as back button for alignment
  },
  content: {
    flex: 1,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  totalNutrition: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCalories: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingRight: 15,
  },
  totalCaloriesValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  totalCaloriesLabel: {
    fontSize: 14,
    color: '#757575',
  },
  totalMacros: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 15,
  },
  totalMacroItem: {
    alignItems: 'center',
  },
  totalMacroValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalMacroLabel: {
    fontSize: 12,
    color: '#757575',
  },
  foodItemsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 80, // Extra space for the footer
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 20,
  },
  foodItemCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodItemNameContainer: {
    flex: 1,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodItemQuantity: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  foodItemActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    padding: 5,
    marginLeft: 10,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  calorieBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    width: 80,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calorieLabel: {
    fontSize: 12,
    color: '#4CAF50',
  },
  macrosContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 12,
    color: '#757575',
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 12,
    marginLeft: 5,
  },
  editItemCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  editField: {
    marginBottom: 12,
  },
  editLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  editInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
  },
  macroEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroEditField: {
    flex: 1,
    marginHorizontal: 3,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addItemButtonText: {
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveMealButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveMealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
