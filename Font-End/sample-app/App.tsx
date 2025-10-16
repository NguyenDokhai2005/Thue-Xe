// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import các màn hình. Đảm bảo tên file vật lý khớp với tên import (Ví dụ: LoginScreen.tsx)
import HomePage from './src/screens/HomePage';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/loginScreen';

// Khởi tạo Bottom Tabs
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // Bọc ứng dụng trong NavigationContainer
    <NavigationContainer>
      
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: route.name !== 'Home',
          tabBarActiveTintColor: '#0d62ff',
          tabBarInactiveTintColor: '#8aa4d6',
          tabBarStyle: { height: 60 },
          tabBarLabelStyle: { marginBottom: 6 },
          tabBarIcon: ({ color, size }) => {
            const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
              Home: 'home',
              Search: 'search',
              Orders: 'bag',
              Profile: 'person',
            };
            const name = iconMap[route.name] ?? 'ellipse';
            return <Ionicons name={name} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomePage} options={{ headerTitle: 'RentCar Pro' }} />
        <Tab.Screen name="Search" component={HomeScreen} />
        <Tab.Screen name="Orders" component={HomeScreen} />
        <Tab.Screen name="Profile" component={LoginScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Có thể xóa styles này
});
