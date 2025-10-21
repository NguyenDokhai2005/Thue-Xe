// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import các màn hình chính
import HomePage from './src/screens/HomePage';
import LoginScreen from './src/screens/loginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VehicleListScreen from './src/screens/VehicleListScreen';
import VehicleDetailScreen from './src/screens/VehicleDetailScreen';
import BookingScreen from './src/screens/BookingScreen';
import BookingHistoryScreen from './src/screens/BookingHistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';

// Import các màn hình admin
import AdminVehicleManagementScreen from './src/screens/AdminVehicleManagementScreen';
import AdminAddVehicleScreen from './src/screens/AdminAddVehicleScreen';
import AdminBookingManagementScreen from './src/screens/AdminBookingManagementScreen';

// Khởi tạo navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator cho các màn hình chính
function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="VehicleList" component={VehicleListScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      
      {/* Admin Screens */}
      <Stack.Screen name="AdminVehicleManagement" component={AdminVehicleManagementScreen} />
      <Stack.Screen name="AdminAddVehicle" component={AdminAddVehicleScreen} />
      <Stack.Screen name="AdminBookingManagement" component={AdminBookingManagementScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator cho Search tab
function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
      <Stack.Screen name="AdminAddVehicle" component={AdminAddVehicleScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator cho Orders tab
function OrdersStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator cho Profile tab
function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
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
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Search" component={SearchStackNavigator} />
        <Tab.Screen name="Orders" component={OrdersStackNavigator} />
        <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Có thể xóa styles này
});
