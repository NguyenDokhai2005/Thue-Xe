// src/screens/VehicleDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { CommonActions } from '@react-navigation/native';
interface Vehicle {
  id: number;
  title: string;
  vehicleType: string;
  licensePlate: string;
  dailyPrice: number;
  currency: string;
  description?: string;
  status?: string;
}

const { width } = Dimensions.get('window');

const VehicleDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { vehicleId } = route.params;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  };

  const fetchVehicleDetails = async () => {
    try {
      const baseUrl = __DEV__
        ? (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080')
        : 'https://your-api.com';

      const response = await fetch(`${baseUrl}/api/vehicles/${vehicleId}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy xe');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
  // CHUYỂN SANG TAB PROFILE + MỞ LOGIN + NHỚ TRẢ VỀ
  navigation.dispatch(
    CommonActions.navigate({
      name: 'MainTabs',
      params: {
        screen: 'Profile',
        params: {
          screen: 'LoginScreen',
          params: {
            redirectTo: 'VehicleDetail',
            redirectParams: { vehicleId }
          }
        }
      }
    })
  );
} else {
  navigation.navigate('Booking', { vehicle });
}
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'AVAILABLE': return '#28a745';
      case 'RENTED': return '#dc3545';
      case 'MAINTENANCE': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Có sẵn';
      case 'RENTED': return 'Đã thuê';
      case 'MAINTENANCE': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết xe</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://placehold.co/600x400/f0f0f0/333?text=${encodeURIComponent(vehicle.title)}` }}
            style={styles.vehicleImage}
          />
          {vehicle.status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
              <Text style={styles.statusText}>{getStatusText(vehicle.status)}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.vehicleTitle}>{vehicle.title}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="car-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{vehicle.vehicleType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <Text style={styles.detailText}>Biển số: {vehicle.licensePlate}</Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Giá thuê/ngày</Text>
            <Text style={styles.price}>
              {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          </View>

          {vehicle.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Mô tả</Text>
              <Text style={styles.description}>{vehicle.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalPriceLabel}>Giá thuê/ngày</Text>
          <Text style={styles.totalPrice}>
            {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: vehicle.status === 'AVAILABLE' ? '#007bff' : '#ccc' }]}
          onPress={handleBookNow}
          disabled={vehicle.status !== 'AVAILABLE'}
        >
          <Text style={styles.bookButtonText}>
            {vehicle.status === 'AVAILABLE' ? 'Đặt ngay' : 'Không thể đặt'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VehicleDetailScreen;

// === STYLES (giữ nguyên + bổ sung) ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  scrollView: { flex: 1 },
  imageContainer: { position: 'relative' },
  vehicleImage: { width: '100%', height: 200, resizeMode: 'cover' },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  infoContainer: { padding: 16 },
  vehicleTitle: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 16 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: { fontSize: 16, color: '#666', marginLeft: 12 },
  priceSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  priceLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  price: { fontSize: 20, fontWeight: '700', color: '#007bff' },
  descriptionSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  description: { fontSize: 16, color: '#666', lineHeight: 24 },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceInfo: { flex: 1 },
  totalPriceLabel: { fontSize: 14, color: '#666' },
  totalPrice: { fontSize: 18, fontWeight: '700', color: '#007bff' },
  bookButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 16,
  },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});