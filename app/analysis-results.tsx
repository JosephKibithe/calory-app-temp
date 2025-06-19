import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { FoodItem } from "../lib/models";
import { useAuth } from "../contexts/AuthContext";
import { foodItemsApi } from "../lib/api";
import { supabase } from "../lib/supabase";

// Define the type for food item updates
type FoodItemUpdate = Partial<
  Omit<FoodItem, "id" | "created_by" | "created_at">
>;

// Mock nutrition database for demonstration purposes
const mockNutritionDatabase: Record<
  string,
  { calories: number; protein: number; carbs: number; fat: number }
> = {
  apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  orange: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  bread: { calories: 75, protein: 2.6, carbs: 13.8, fat: 1 },
  pasta: { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  beef: { calories: 250, protein: 26, carbs: 0, fat: 17 },
  fish: { calories: 100, protein: 22, carbs: 0, fat: 1.3 },
  milk: { calories: 60, protein: 3.2, carbs: 5, fat: 3.2 },
  egg: { calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  cheese: { calories: 110, protein: 7, carbs: 0.4, fat: 9 },
  yogurt: { calories: 80, protein: 5, carbs: 6, fat: 3 },
  potato: { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  tomato: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  carrot: { calories: 25, protein: 0.6, carbs: 6, fat: 0.1 },
  lettuce: { calories: 5, protein: 0.5, carbs: 1, fat: 0.1 },
  cucumber: { calories: 8, protein: 0.3, carbs: 1.9, fat: 0.1 },
  broccoli: { calories: 31, protein: 2.6, carbs: 6, fat: 0.3 },
  spinach: { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1 },
};

export default function AnalysisResults() {
  const params = useLocalSearchParams();
  const { user } = useAuth();

  // Parse the labels from params
  const [detectedLabels, setDetectedLabels] = useState<string[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate AI nutrition analysis for a food item
  const getAINutritionInfo = (
    foodName: string
  ): { calories: number; protein: number; carbs: number; fat: number } => {
    // Convert to lowercase and check if it exists in our mock database
    const normalizedName = foodName.toLowerCase();

    // Look for exact matches or partial matches
    let nutritionInfo = mockNutritionDatabase[normalizedName];

    if (!nutritionInfo) {
      // Try to find partial matches
      const partialMatches = Object.keys(mockNutritionDatabase).filter(
        (key) => normalizedName.includes(key) || key.includes(normalizedName)
      );

      if (partialMatches.length > 0) {
        // Use the first partial match
        nutritionInfo = mockNutritionDatabase[partialMatches[0]];
      } else {
        // Generate random realistic values for unknown items
        nutritionInfo = {
          calories: Math.floor(Math.random() * 300) + 50,
          protein: Math.floor(Math.random() * 20) + 1,
          carbs: Math.floor(Math.random() * 30) + 5,
          fat: Math.floor(Math.random() * 15) + 1,
        };
      }
    }

    return nutritionInfo;
  };

  // Auto-populate nutritional information for all food items
  const autoFillNutritionInfo = async () => {
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedFoodItems = foodItems.map((item) => {
        const nutritionInfo = getAINutritionInfo(item.name);

        return {
          ...item,
          calories: nutritionInfo.calories,
          protein: nutritionInfo.protein,
          carbs: nutritionInfo.carbs,
          fat: nutritionInfo.fat,
          verified: false, // Set to false as this is AI-generated
        };
      });

      setFoodItems(updatedFoodItems);
      console.log("Updated food items after AI analysis:", updatedFoodItems);

      if (updatedFoodItems.length === 0) {
        throw new Error("No food items were generated");
      }

      Alert.alert(
        "Success",
        "Nutritional information auto-filled based on AI analysis. Please verify and adjust if needed."
      );
    } catch (err) {
      console.error("Error auto-filling nutrition info:", err);
      Alert.alert(
        "Error",
        "Failed to auto-fill nutritional information. You can still add items manually."
      );

      // If we have no food items, add a default one for manual entry
      if (foodItems.length === 0) {
        const defaultItems: FoodItem[] = [
          {
            id: 1,
            name: "Food Item",
            quantity: "1 serving",
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            verified: false,
            created_by: user?.id || "system",
            created_at: new Date().toISOString(),
            meal_type: "lunch",
          },
        ];
        setFoodItems(defaultItems);
        setDetectedLabels(["Manual Entry"]);
        setTimeout(() => setEditingItem(1), 500);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load the detected labels from params
  useEffect(() => {
    console.log("Analysis results received params:", params);

    if (!params.labels) {
      console.error("No labels parameter provided");
      Alert.alert(
        "No Food Items Detected",
        "We couldn't detect any food items in the image. Please try again with a clearer image or add items manually.",
        [
          {
            text: "Add Manually",
            onPress: () => {
              // Create a default food item for manual entry
              const defaultItems: FoodItem[] = [
                {
                  id: 1,
                  name: "Food Item",
                  quantity: "1 serving",
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  verified: false,
                  created_by: user?.id || "system",
                  created_at: new Date().toISOString(),
                  meal_type: "lunch",
                },
              ];
              setFoodItems(defaultItems);
              setDetectedLabels(["Manual Entry"]);
              setTimeout(() => setEditingItem(1), 500);
            },
          },
          {
            text: "Try Again",
            onPress: () => router.back(),
          },
        ]
      );
      return;
    }

    try {
      let labels: string[];

      // Handle the labels parameter
      if (typeof params.labels === "string") {
        try {
          labels = JSON.parse(params.labels);
        } catch (parseErr) {
          console.error("Error parsing labels JSON:", parseErr);
          // If JSON parsing fails, try to use it as a comma-separated string
          labels = params.labels.split(",").map((l) => l.trim());
        }
      } else if (Array.isArray(params.labels)) {
        labels = params.labels;
      } else {
        throw new Error("Invalid labels format");
      }

      console.log("Parsed labels:", labels);

      // Check if we have any valid labels
      if (
        !labels ||
        labels.length === 0 ||
        (labels.length === 1 && !labels[0])
      ) {
        throw new Error("Empty labels array");
      }

      setDetectedLabels(labels);

      // Convert labels to food items
      const newFoodItems: FoodItem[] = labels.map(
        (label: string, index: number) => ({
          id: index + 1, // Temporary ID
          name: label,
          quantity: "1 serving",
          calories: 0, // To be filled by user or AI
          protein: 0,
          carbs: 0,
          fat: 0,
          verified: false,
          created_by: user?.id || "system",
          created_at: new Date().toISOString(),
          meal_type: "lunch", // Default, can be changed
        })
      );

      setFoodItems(newFoodItems);

      // Automatically fill nutritional information after a short delay
      setTimeout(() => autoFillNutritionInfo(), 500);
    } catch (err) {
      console.error("Error processing labels:", err);
      Alert.alert(
        "Detection Error",
        "We had trouble processing the detected food items. Please try again or add items manually.",
        [
          {
            text: "Add Manually",
            onPress: () => {
              // Create a default food item for manual entry
              const defaultItems: FoodItem[] = [
                {
                  id: 1,
                  name: "Food Item",
                  quantity: "1 serving",
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  verified: false,
                  created_by: user?.id || "system",
                  created_at: new Date().toISOString(),
                  meal_type: "lunch",
                },
              ];
              setFoodItems(defaultItems);
              setDetectedLabels(["Manual Entry"]);
              setTimeout(() => setEditingItem(1), 500);
            },
          },
          {
            text: "Try Again",
            onPress: () => router.back(),
          },
        ]
      );
    }
  }, [params.labels, user]);

  // Memoize total nutrition calculations
  const { totalCalories, totalProtein, totalCarbs, totalFat } = useMemo(
    () => ({
      totalCalories: foodItems.reduce(
        (sum, item) => sum + (item.calories || 0),
        0
      ),
      totalProtein: foodItems.reduce(
        (sum, item) => sum + (item.protein || 0),
        0
      ),
      totalCarbs: foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0),
      totalFat: foodItems.reduce((sum, item) => sum + (item.fat || 0), 0),
    }),
    [foodItems]
  );

  const handleSaveItem = (id: number, updatedItem: FoodItemUpdate) => {
    try {
      // Validate the updated item
      if (updatedItem.calories !== undefined && updatedItem.calories < 0) {
        throw new Error("Calories cannot be negative");
      }
      if (updatedItem.protein !== undefined && updatedItem.protein < 0) {
        throw new Error("Protein cannot be negative");
      }
      if (updatedItem.carbs !== undefined && updatedItem.carbs < 0) {
        throw new Error("Carbs cannot be negative");
      }
      if (updatedItem.fat !== undefined && updatedItem.fat < 0) {
        throw new Error("Fat cannot be negative");
      }

      setFoodItems(
        foodItems.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
      setEditingItem(null);
    } catch (error: any) {
      Alert.alert("Validation Error", error.message);
    }
  };

  const handleRemoveItem = (id: number) => {
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setFoodItems(foodItems.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const saveFoodItemsToSupabase = async () => {
    setSaving(true);
    setError(null);

    try {
      console.log(
        "Starting to save food items to Supabase. Total items:",
        foodItems.length
      );

      // Validate food items before saving
      const validFoodItems = foodItems.filter((item) => item.calories > 0);

      if (validFoodItems.length === 0) {
        Alert.alert(
          "No Valid Items",
          "Please add calorie information to at least one food item before saving."
        );
        setSaving(false);
        return;
      }

      // Format data for the API
      const mealType = "lunch"; // This could be made selectable in future updates
      const foodItemsToSave = validFoodItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        calories: item.calories,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0,
        verified: item.verified || false,
      }));

      // Call the new API method that handles the entire meal saving process
      console.log(
        "Calling saveMealWithFoodItems API with items:",
        foodItemsToSave
      );
      const result = await foodItemsApi.saveMealWithFoodItems(
        mealType,
        foodItemsToSave
      );

      console.log("API result:", result);

      if (result.success) {
        Alert.alert("Success", `${result.message}`, [
          {
            text: "View Dashboard",
            onPress: () => router.replace("/dashboard"),
          },
        ]);
      } else {
        Alert.alert("Error", `${result.message}`);
      }
    } catch (err: any) {
      console.error("Error saving food items:", err);
      setError(err.message || "Failed to save food items");
      Alert.alert("Error", `Failed to save food items: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddMeal = async () => {
    // Validate that at least one item has calories
    const hasValidItems = foodItems.some((item) => item.calories > 0);

    if (!hasValidItems) {
      Alert.alert(
        "Incomplete Information",
        "Please add calorie information for at least one food item before saving the meal."
      );
      return;
    }

    // Save to Supabase
    await saveFoodItemsToSupabase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.labelContainer}>
        <Text style={styles.labelTitle}>Detected Food Items:</Text>
        <View style={styles.labelList}>
          {detectedLabels.map((label, index) => (
            <View key={index} style={styles.labelBadge}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>
            Analyzing nutritional content...
          </Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.foodList}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Food Items</Text>
                <Text style={styles.sectionSubtitle}>
                  Review and edit nutritional information
                </Text>
              </View>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={autoFillNutritionInfo}
              >
                <Ionicons name="refresh" size={18} color="#4CAF50" />
                <Text style={styles.refreshText}>Refresh AI Analysis</Text>
              </TouchableOpacity>
            </View>

            {foodItems.map((item) => (
              <View key={item.id} style={styles.foodItem}>
                <View style={styles.foodItemHeader}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveItem(item.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={22} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>

                {editingItem === item.id ? (
                  // Edit mode
                  <View style={styles.editForm}>
                    <View style={styles.formRow}>
                      <Text style={styles.formLabel}>Quantity:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={item.quantity}
                        onChangeText={(text) =>
                          handleSaveItem(item.id, { quantity: text })
                        }
                        placeholder="e.g., 100g, 1 cup"
                      />
                    </View>

                    <View style={styles.formRow}>
                      <Text style={styles.formLabel}>Calories:</Text>
                      <TextInput
                        style={styles.formInput}
                        value={item.calories ? item.calories.toString() : ""}
                        onChangeText={(text) =>
                          handleSaveItem(item.id, {
                            calories: text ? parseInt(text) : 0,
                          })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.formRow}>
                      <Text style={styles.formLabel}>Protein (g):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={item.protein ? item.protein.toString() : ""}
                        onChangeText={(text) =>
                          handleSaveItem(item.id, {
                            protein: text ? parseFloat(text) : 0,
                          })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.formRow}>
                      <Text style={styles.formLabel}>Carbs (g):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={item.carbs ? item.carbs.toString() : ""}
                        onChangeText={(text) =>
                          handleSaveItem(item.id, {
                            carbs: text ? parseFloat(text) : 0,
                          })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.formRow}>
                      <Text style={styles.formLabel}>Fat (g):</Text>
                      <TextInput
                        style={styles.formInput}
                        value={item.fat ? item.fat.toString() : ""}
                        onChangeText={(text) =>
                          handleSaveItem(item.id, {
                            fat: text ? parseFloat(text) : 0,
                          })
                        }
                        placeholder="0"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.formButtons}>
                      <TouchableOpacity
                        style={[styles.formButton, styles.cancelButton]}
                        onPress={() => setEditingItem(null)}
                      >
                        <Text style={styles.formButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.formButton, styles.saveButton]}
                        onPress={() => setEditingItem(null)}
                      >
                        <Text style={styles.formButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  // Display mode
                  <View style={styles.foodItemDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity:</Text>
                      <Text style={styles.detailValue}>{item.quantity}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Calories:</Text>
                      <Text style={styles.detailValue}>
                        {item.calories} kcal
                      </Text>
                    </View>

                    <View style={styles.nutritionRow}>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Protein</Text>
                        <Text style={styles.nutritionValue}>
                          {item.protein}g
                        </Text>
                      </View>

                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Carbs</Text>
                        <Text style={styles.nutritionValue}>{item.carbs}g</Text>
                      </View>

                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionLabel}>Fat</Text>
                        <Text style={styles.nutritionValue}>{item.fat}g</Text>
                      </View>
                    </View>

                    {!item.verified && (
                      <View style={styles.verificationBadge}>
                        <Ionicons
                          name="information-circle-outline"
                          size={16}
                          color="#ff9800"
                        />
                        <Text style={styles.verificationText}>
                          AI estimated - please verify
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setEditingItem(item.id)}
                    >
                      <Ionicons name="create-outline" size={16} color="#fff" />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.totals}>
            <Text style={styles.totalsTitle}>Meal Totals</Text>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Calories:</Text>
              <Text style={styles.totalValue}>{totalCalories} kcal</Text>
            </View>

            <View style={styles.totalNutrition}>
              <View style={styles.totalNutritionItem}>
                <Text style={styles.totalNutritionLabel}>Protein</Text>
                <Text style={styles.totalNutritionValue}>{totalProtein}g</Text>
              </View>

              <View style={styles.totalNutritionItem}>
                <Text style={styles.totalNutritionLabel}>Carbs</Text>
                <Text style={styles.totalNutritionValue}>{totalCarbs}g</Text>
              </View>

              <View style={styles.totalNutritionItem}>
                <Text style={styles.totalNutritionLabel}>Fat</Text>
                <Text style={styles.totalNutritionValue}>{totalFat}g</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.addMealButton,
              saving && styles.addMealButtonDisabled,
            ]}
            onPress={handleAddMeal}
            disabled={saving}
          >
            {saving ? (
              <Text style={styles.addMealButtonText}>Saving...</Text>
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.addMealButtonText}>
                  Save to Meal History
                </Text>
              </>
            )}
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerRight: {
    width: 40,
  },
  labelContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
  },
  labelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  labelList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  labelBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    color: "#2196f3",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  foodList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  refreshText: {
    fontSize: 12,
    color: "#4CAF50",
    marginLeft: 4,
  },
  foodItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  removeButton: {
    padding: 4,
  },
  foodItemDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#757575",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff9c4",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  verificationText: {
    fontSize: 12,
    color: "#ff9800",
    marginLeft: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 6,
  },
  editForm: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  formLabel: {
    width: 100,
    fontSize: 14,
    color: "#757575",
  },
  formInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  formButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  formButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  totals: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  totalsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: "#757575",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalNutrition: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
  },
  totalNutritionItem: {
    alignItems: "center",
    flex: 1,
  },
  totalNutritionLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
  },
  totalNutritionValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addMealButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  addMealButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  addMealButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
});
