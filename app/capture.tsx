import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CaptureScreen() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    // Request camera permissions when component mounts
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to use this feature');
      }
    })();
  }, []);

  const takePicture = async () => {
    try {
      // Use the image picker to launch the camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setAnalyzing(true);
    
    // In a real app, we would send the image to the Deepseek API for analysis
    // For now, we'll simulate a delay and then navigate to the results screen
    setTimeout(() => {
      setAnalyzing(false);
      router.push('/analysis-results');
    }, 2000);
  };

  const resetCapture = () => {
    setCapturedImage(null);
  };

  // Loading state removed as we're using ImagePicker which handles permissions

  // Permission check is now handled by ImagePicker

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/dashboard')} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Capture Food</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.cameraPreview} />
        ) : (
          <View style={styles.camera}>
            <View style={styles.simulatedCamera}>
              <View style={styles.cameraOverlay}>
                <View style={styles.focusFrame} />
              </View>
              <View style={styles.cameraInstructions}>
                <Ionicons name="camera-outline" size={48} color="rgba(255,255,255,0.7)" />
                <Text style={styles.cameraInstructionsText}>Camera Preview</Text>
                <Text style={styles.cameraInstructionsSubtext}>Tap the button below to capture</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {capturedImage ? (
        <View style={styles.captureActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={resetCapture}
          >
            <Ionicons name="refresh-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.analyzeButton]} 
            onPress={analyzeImage}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.actionButtonText}>Analyzing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="nutrition-outline" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Analyze Food</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.captureControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Ionicons name="images-outline" size={28} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.flipButton}
            onPress={() => {
              Alert.alert('Camera', 'Camera flip would be available in the actual implementation');
            }}
          >
            <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          {capturedImage 
            ? 'Tap "Analyze Food" to identify items and calculate calories'
            : 'Position your meal in the frame and tap the button to capture'}
        </Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => {
            router.replace('/dashboard');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={24} color="#4CAF50" />
          <Text style={[styles.navText, styles.navTextActive]}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => {
            router.replace('/meal-history');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="bar-chart-outline" size={24} color="#757575" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => {
            router.replace('/settings');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  simulatedCamera: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  cameraInstructions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraInstructionsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cameraInstructionsSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 34, // Same width as back button for alignment
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  permissionSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
  permissionButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    margin: 10,
  },
  camera: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
    resizeMode: 'cover',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    opacity: 0.7,
  },
  captureControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  galleryButton: {
    padding: 15,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  flipButton: {
    padding: 15,
  },
  captureActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
    flex: 2,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  instructions: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  instructionsText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});
