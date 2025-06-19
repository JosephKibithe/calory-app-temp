# Calorie Tracking App Development Journey

## Project Overview

A mobile application for tracking calories, food intake, and nutritional information using React Native, Expo, and Supabase.

## Project Structure

```
calory-app-temp/
│
├── app/                  # Main application screens
│   ├── analysis-results.tsx
│   ├── dashboard.tsx
│   ├── login.tsx
│   └── ... (other screens)
│
├── contexts/             # React context providers
│   ├── AuthContext.tsx   # Manages authentication state
│   └── UserContext.tsx   # Manages user profile and related data
│
├── lib/                  # Core application logic
│   ├── api.ts            # API methods for interacting with Supabase
│   ├── models.ts         # TypeScript interfaces for data models
│   ├── supabase.ts       # Supabase client configuration
│   └── vision.ts         # Image analysis using Google Cloud Vision (or mock)
│
├── .env                  # Environment configuration
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## Development Milestones

### 1. Initial Project Setup

- Created React Native project with Expo
- Set up basic project structure
- Configured Supabase integration

### 2. Authentication Flow

#### Challenges

- Implemented authentication using Supabase
- Created `AuthContext` and `UserContext`
- Improved sign-up process with robust error handling

#### Key Authentication Improvements

- Added detailed error logging
- Implemented email confirmation flow
- Enhanced user session management

### 3. Database Configuration

#### Supabase Schema

```sql
-- Food Items Table
CREATE TABLE public.food_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein FLOAT,
    carbs FLOAT,
    fat FLOAT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    quantity TEXT
);

-- Meals Table
CREATE TABLE public.meals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    consumed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Items (Junction Table)
CREATE TABLE public.meal_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    meal_id BIGINT REFERENCES public.meals(id) ON DELETE CASCADE,
    food_item_id BIGINT REFERENCES public.food_items(id),
    servings FLOAT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. API and Model Synchronization

- Updated `models.ts` to match Supabase schema
- Refactored `api.ts` to handle food item insertion
- Added comprehensive error logging and validation

### 5. Image Recognition and Food Detection

- Implemented Google Cloud Vision API integration for food detection
- Added fallback mock implementation for development and testing
- Enhanced image capture UI/UX with proper error handling
- Passed detected food labels to analysis results screen

### 6. Food Analysis and Nutrient Calculation

- Built a user-friendly interface for reviewing and editing detected food items
- Implemented calorie and macronutrient tracking
- Added option to manually input nutritional information
- Created food item saving mechanism to Supabase database

### 7. Current Challenges

- Cloud Vision API requires billing setup for production use
- Food item nutrient data needs to be complemented by a nutrition database
- Optimizing mobile performance for image processing

## Environment Configuration

```
SUPABASE_URL=https://gtacgmsnwthtrvhjjmrr.supabase.co
SUPABASE_ANON_KEY=<redacted>
GOOGLE_CLOUD_VISION_API_KEY=<redacted>
```

## Next Steps

1. Integrate a nutrition database API for more accurate food information
2. Implement meal history and trends visualization
3. Add goal tracking and personalized recommendations
4. Develop offline mode functionality
5. Enhance user profile and settings

## Lessons Learned

- Importance of matching database schemas with UI components
- Detailed error logging is crucial for debugging
- Mock implementations help testing without dependency on external services
- Mobile UI design requires careful planning for good UX
- TypeScript interfaces ensure consistency across the application

## Recommended Improvements

- Implement more comprehensive input validation
- Add more detailed user feedback
- Create more robust error recovery mechanisms
- Improve food detection accuracy
- Add multilingual support

## Development Environment

- React Native
- Expo
- TypeScript
- Supabase
- Google Cloud Vision API

## Troubleshooting Checklist

- ✅ Supabase URL and Anon Key configured
- ✅ Authentication context improved
- ❓ Food item saving mechanism
- ❓ User profile creation workflow

## Contact and Support

For further assistance, please reach out to the development team.
