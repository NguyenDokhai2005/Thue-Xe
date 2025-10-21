import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Vehicle {
  id: number;
  title: string;
  vehicleType: string;
  licensePlate: string;
  dailyPrice: number;
  currency: string;
  description: string;
  status: string;
}

const { width } = Dimensions.get('window');

const VehicleDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { vehicleId } = route.params;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleDetails();
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin xe');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'SEDAN': return 'car-outline';
      case 'SUV': return 'car-sport-outline';
      case 'HATCHBACK': return 'car-outline';
      case 'CONVERTIBLE': return 'car-sport-outline';
      default: return 'car-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#28a745';
      case 'RENTED': return '#dc3545';
      case 'MAINTENANCE': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Có sẵn';
      case 'RENTED': return 'Đã thuê';
      case 'MAINTENANCE': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  const handleBookNow = () => {
    if (vehicle?.status === 'AVAILABLE') {
      navigation.navigate('BookingScreen', { vehicle });
    } else {
      Alert.alert('Thông báo', 'Xe này hiện không khả dụng để thuê');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Không tìm thấy thông tin xe</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết xe</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Vehicle Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://placehold.co/${width}x200/007bff/ffffff?text=${vehicle.title}` }}
            style={styles.vehicleImage}
          />
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vehicle.status) }]}>
            <Text style={styles.statusText}>{getStatusText(vehicle.status)}</Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.vehicleTitle}>{vehicle.title}</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name={getVehicleTypeIcon(vehicle.vehicleType)} size={20} color="#666" />
            <Text style={styles.detailText}>{vehicle.vehicleType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{vehicle.licensePlate}</Text>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Giá thuê</Text>
            <Text style={styles.price}>
              {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}/ngày
            </Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{vehicle.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Tính năng</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Ionicons name="snow-outline" size={24} color="#007bff" />
                <Text style={styles.featureText}>Điều hòa</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="wifi-outline" size={24} color="#007bff" />
                <Text style={styles.featureText}>Wifi</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="musical-notes-outline" size={24} color="#007bff" />
                <Text style={styles.featureText}>Âm thanh</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#007bff" />
                <Text style={styles.featureText}>Bảo hiểm</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalPriceLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}/ngày
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            { backgroundColor: vehicle.status === 'AVAILABLE' ? '#007bff' : '#ccc' }
          ]}
          onPress={handleBookNow}
          disabled={vehicle.status !== 'AVAILABLE'}
        >
          <Text style={styles.bookButtonText}>
            {vehicle.status === 'AVAILABLE' ? 'Đặt ngay' : 'Không khả dụng'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VehicleDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  featuresSection: { marginBottom: 100 },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  featureText: { fontSize: 14, color: '#333', marginLeft: 8 },
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
