import { Platform } from "react-native";
import Constants from "expo-constants";

// Define the type for the API response
type VisionResponse = {
  labels: string[];
  error?: string;
};

// Flag to use mock implementation instead of real API
const USE_MOCK = true; // Set to false when you have billing enabled

/**
 * Analyzes an image using Google Cloud Vision API
 * @param imageUri - The URI of the image to analyze
 * @returns Promise<string[]> - Array of detected food labels
 */
export async function analyzeImage(imageUri: string): Promise<string[]> {
  // Use mock implementation for testing
  if (USE_MOCK) {
    console.log("[VISION] Using mock implementation for testing");
    return mockAnalyzeImage(imageUri);
  }

  try {
    // Convert the image to base64
    const base64Image = await convertImageToBase64(imageUri);

    // Remove the data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // Use the API key from Expo Constants
    const apiKey = Constants.expoConfig?.extra?.googleCloudVisionApiKey;

    console.log(
      "[VISION] Using API key:",
      apiKey ? "API key found" : "API key missing"
    );

    if (!apiKey) {
      throw new Error("Google Cloud Vision API key is missing");
    }

    // Make API request to Google Cloud Vision
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    console.log("[VISION] Making API request to:", url);

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Data,
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 10,
            },
            {
              type: "OBJECT_LOCALIZATION",
              maxResults: 10,
            },
          ],
        },
      ],
    };

    console.log(
      "[VISION] Request body structure:",
      JSON.stringify(
        requestBody,
        (key, value) => {
          if (key === "content") return "[BASE64_DATA]";
          return value;
        },
        2
      )
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[VISION] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[VISION] API error response:", errorText);
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    console.log(
      "[VISION] Response data structure:",
      JSON.stringify(data, null, 2)
    );

    if (data.error) {
      throw new Error(data.error.message || "Vision API error");
    }

    // Extract labels from both label detection and object localization
    const labels = new Set<string>();

    // Add labels from label detection
    if (data.responses?.[0]?.labelAnnotations) {
      data.responses[0].labelAnnotations.forEach((annotation: any) => {
        if (annotation.description) {
          labels.add(annotation.description.toLowerCase());
        }
      });
    }

    // Add labels from object localization
    if (data.responses?.[0]?.localizedObjectAnnotations) {
      data.responses[0].localizedObjectAnnotations.forEach(
        (annotation: any) => {
          if (annotation.name) {
            labels.add(annotation.name.toLowerCase());
          }
        }
      );
    }

    console.log("[VISION] Detected labels:", Array.from(labels));

    // Get all food-related keywords
    const foodKeywords = [
      "food",
      "dish",
      "meal",
      "cuisine",
      "plate",
      "bowl",
      "utensil",
      "ingredient",
      "vegetable",
      "fruit",
      "meat",
      "dessert",
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "appetizer",
      "bread",
      "cheese",
      "rice",
      "pasta",
      "pizza",
      "burger",
      "sandwich",
      "salad",
      "soup",
      "steak",
      "chicken",
      "fish",
      "seafood",
      "drink",
      "beverage",
      "coffee",
      "tea",
      "juice",
      "smoothie",
      "milk",
      "wine",
      "beer",
      "cocktail",
    ];

    // Filter for food-related labels
    const foodLabels = Array.from(labels).filter(
      (label) =>
        // Check if the label contains any of the food keywords
        foodKeywords.some((keyword) => label.includes(keyword)) ||
        // Or if we have specific food items that don't contain the keywords
        [
          "apple",
          "banana",
          "orange",
          "egg",
          "cake",
          "pie",
          "cookie",
          "donut",
          "muffin",
          "bagel",
          "toast",
          "bacon",
        ].includes(label)
    );

    console.log("[VISION] Food-related labels:", foodLabels);

    return foodLabels;
  } catch (error: any) {
    console.error("[VISION] Error analyzing image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}

/**
 * Mock implementation that returns sample food labels based on image dimensions
 * @param imageUri - The URI of the image to analyze
 * @returns Promise<string[]> - Array of detected food labels
 */
async function mockAnalyzeImage(imageUri: string): Promise<string[]> {
  console.log("[VISION-MOCK] Simulating image analysis for:", imageUri);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Instead of random food items based on time, use a consistent set for reliability
  const reliableTestItems = [
    "chicken breast",
    "brown rice",
    "broccoli",
    "mixed vegetables",
    "olive oil",
  ];

  console.log(
    "[VISION-MOCK] Returning reliable test food items:",
    reliableTestItems
  );
  return reliableTestItems;

  /* Original random item selection - commented out for reliability
  // Breakfast food items
  const breakfastItems = [
    "eggs",
    "bacon",
    "pancakes",
    "toast",
    "coffee",
    "cereal",
    "oatmeal",
    "yogurt",
    "fruit",
    "milk",
  ];

  // Lunch food items
  const lunchItems = [
    "sandwich",
    "salad",
    "soup",
    "burger",
    "pasta",
    "pizza",
    "wrap",
    "sushi",
    "rice bowl",
    "taco",
  ];

  // Dinner food items
  const dinnerItems = [
    "steak",
    "salmon",
    "chicken",
    "vegetables",
    "potatoes",
    "pasta",
    "rice",
    "curry",
    "noodles",
    "roast",
  ];

  // Dessert items
  const dessertItems = [
    "cake",
    "ice cream",
    "cookies",
    "pie",
    "chocolate",
    "pudding",
    "brownie",
    "cheesecake",
    "fruit",
    "pastry",
  ];

  // Generate a random time (useful for picking meal type)
  const currentHour = new Date().getHours();
  let mealItems: string[];
  let count: number;

  // Select the appropriate meal items based on the time of day
  if (currentHour >= 5 && currentHour < 11) {
    // Breakfast time (5 AM - 11 AM)
    mealItems = breakfastItems;
    count = Math.floor(Math.random() * 3) + 1; // 1-3 items
  } else if (currentHour >= 11 && currentHour < 16) {
    // Lunch time (11 AM - 4 PM)
    mealItems = lunchItems;
    count = Math.floor(Math.random() * 4) + 1; // 1-4 items
  } else if (currentHour >= 16 && currentHour < 22) {
    // Dinner time (4 PM - 10 PM)
    mealItems = dinnerItems;
    count = Math.floor(Math.random() * 5) + 2; // 2-6 items
  } else {
    // Late night snack (10 PM - 5 AM)
    mealItems = [...dessertItems, ...lunchItems];
    count = Math.floor(Math.random() * 2) + 1; // 1-2 items
  }

  // Shuffle the array and pick random items
  const shuffled = mealItems.sort(() => 0.5 - Math.random());
  const selectedItems = shuffled.slice(0, count);

  console.log("[VISION-MOCK] Selected food items:", selectedItems);
  return selectedItems;
  */
}

/**
 * Converts an image URI to base64
 * @param uri - The URI of the image
 * @returns Promise<string> - Base64 encoded image
 */
async function convertImageToBase64(uri: string): Promise<string> {
  try {
    console.log("[VISION] Converting image to base64:", uri);

    // For web platform
    if (Platform.OS === "web") {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          console.log(
            "[VISION] Base64 conversion completed (web):",
            base64 ? `${base64.substring(0, 50)}...` : "null"
          );
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    // For mobile platforms
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        console.log(
          "[VISION] Base64 conversion completed (mobile):",
          base64 ? `${base64.substring(0, 50)}...` : "null"
        );
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error("[VISION] Error in FileReader:", error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("[VISION] Error converting image to base64:", error);
    throw new Error("Failed to process image");
  }
}
