import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

type OnboardingStep = 'goal' | 'diet' | 'target';

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>('goal');
  const [goal, setGoal] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [calorieTarget, setCalorieTarget] = useState<string>('2000');

  const handleNext = () => {
    if (step === 'goal') {
      setStep('diet');
    } else if (step === 'diet') {
      setStep('target');
    } else {
      // In a real app, we would save this data to Supabase
      console.log('Onboarding complete with data:', { goal, diet, calorieTarget });
      router.replace('/dashboard');
    }
  };

  const handleBack = () => {
    if (step === 'diet') {
      setStep('goal');
    } else if (step === 'target') {
      setStep('diet');
    }
  };

  const renderGoalStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your goal?</Text>
      <View style={styles.optionsContainer}>
        {['Lose Weight', 'Maintain Weight', 'Gain Weight'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              goal === option && styles.optionButtonSelected,
            ]}
            onPress={() => setGoal(option)}
          >
            <Text
              style={[
                styles.optionText,
                goal === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDietStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Any dietary preferences?</Text>
      <View style={styles.optionsContainer}>
        {['No Restrictions', 'Vegetarian', 'Vegan', 'Keto', 'Paleo'].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              diet === option && styles.optionButtonSelected,
            ]}
            onPress={() => setDiet(option)}
          >
            <Text
              style={[
                styles.optionText,
                diet === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTargetStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set your daily calorie target</Text>
      <TextInput
        style={styles.input}
        value={calorieTarget}
        onChangeText={setCalorieTarget}
        keyboardType="numeric"
        placeholder="Daily calorie target"
      />
      <Text style={styles.helperText}>
        Based on your goal to {goal.toLowerCase()}, we recommend around{' '}
        {goal === 'Lose Weight' ? '1800' : goal === 'Gain Weight' ? '2500' : '2000'} calories per day.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={[styles.progressLine, step !== 'goal' ? styles.progressLineActive : null]} />
          <View style={[styles.progressDot, step !== 'goal' ? styles.progressDotActive : null]} />
          <View style={[styles.progressLine, step === 'target' ? styles.progressLineActive : null]} />
          <View style={[styles.progressDot, step === 'target' ? styles.progressDotActive : null]} />
        </View>

        {step === 'goal' && renderGoalStep()}
        {step === 'diet' && renderDietStep()}
        {step === 'target' && renderTargetStep()}

        <View style={styles.buttonRow}>
          {step !== 'goal' && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.nextButton, !goal && step === 'goal' && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!goal && step === 'goal'}
          >
            <Text style={styles.nextButtonText}>
              {step === 'target' ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#4CAF50',
  },
  progressLine: {
    height: 2,
    width: 50,
    backgroundColor: '#E0E0E0',
  },
  progressLineActive: {
    backgroundColor: '#4CAF50',
  },
  stepContainer: {
    flex: 1,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
  },
  optionButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
