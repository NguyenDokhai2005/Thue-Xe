import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, RefreshControl, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

const VehicleListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải danh sách xe');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
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

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
    >
      <View style={styles.vehicleImageContainer}>
        <Image
          source={{ uri: `https://placehold.co/120x80/007bff/ffffff?text=${item.title.split(' ')[0]}` }}
          style={styles.vehicleImage}
        />
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>{item.title}</Text>
        <Text style={styles.vehicleType}>
          <Ionicons name={getVehicleTypeIcon(item.vehicleType)} size={16} color="#666" />
          {' '}{item.vehicleType}
        </Text>
        <Text style={styles.licensePlate}>
          <Ionicons name="card-outline" size={16} color="#666" />
          {' '}{item.licensePlate}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {item.dailyPrice.toLocaleString('vi-VN')} {item.currency}/ngày
          </Text>
          <TouchableOpacity style={styles.viewButton}>
            <Ionicons name="chevron-forward" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Không có xe nào</Text>
      <Text style={styles.emptySubtext}>Vui lòng thử lại sau</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách xe</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <Ionicons name="search" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default VehicleListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
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
  listContainer: { padding: 16 },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleImageContainer: { position: 'relative', marginBottom: 12 },
  vehicleImage: { width: '100%', height: 120, borderRadius: 8, resizeMode: 'cover' },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  vehicleInfo: { flex: 1 },
  vehicleTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 4 },
  vehicleType: { fontSize: 14, color: '#666', marginBottom: 2 },
  licensePlate: { fontSize: 14, color: '#666', marginBottom: 8 },
  description: { fontSize: 14, color: '#888', lineHeight: 20, marginBottom: 12 },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: 16, fontWeight: '700', color: '#007bff' },
  viewButton: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4 },
});
