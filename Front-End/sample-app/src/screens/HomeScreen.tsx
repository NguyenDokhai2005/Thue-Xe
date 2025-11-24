// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchVehicles, Vehicle } from '../api/vehicleApi';

// Helper function để lấy ảnh xe
const getVehicleImageUrl = (vehicle: Vehicle): string => {
  // Ưu tiên primaryPhotoUrl, sau đó là ảnh đầu tiên trong photos, cuối cùng là placeholder
  let imageUrl: string | undefined;
  
  if (vehicle.primaryPhotoUrl) {
    imageUrl = vehicle.primaryPhotoUrl;
  } else if (vehicle.photos && vehicle.photos.length > 0) {
    imageUrl = vehicle.photos[0].url;
  }
  
  // Nếu có URL, convert localhost thành 10.0.2.2 cho Android emulator
  if (imageUrl) {
    const baseUrl = __DEV__
      ? (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080')
      : 'https://your-api.com';
    
    // Nếu URL đã là full URL với localhost, thay thế cho Android
    if (Platform.OS === 'android' && imageUrl.includes('localhost')) {
      imageUrl = imageUrl.replace('http://localhost:8080', baseUrl);
    }
    // Nếu URL là relative path, thêm base URL
    else if (imageUrl.startsWith('/')) {
      imageUrl = baseUrl + imageUrl;
    }
    
    return imageUrl;
  }
  
  // Fallback to placeholder
  return `https://placehold.co/150x100/f0f0f0/333333?text=${encodeURIComponent(vehicle.title.substring(0, 10))}`;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 cột

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const vehicleTypes = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'SEDAN', label: 'Sedan' },
    { key: 'SUV', label: 'SUV' },
    { key: 'HATCHBACK', label: 'Hatchback' },
    { key: 'CONVERTIBLE', label: 'Convertible' },
  ];

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [searchQuery, selectedType, vehicles]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải dữ liệu');
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    // Tìm kiếm
    if (searchQuery.trim()) {
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Lọc loại xe
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(v => v.vehicleType === selectedType);
    }

    setFilteredVehicles(filtered);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(price);
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
    >
      <View style={styles.vehicleImageContainer}>
        <Image
          source={{
            uri: getVehicleImageUrl(item),
          }}
          style={styles.vehicleImage}
          defaultSource={require('../../assets/icon.png')} // Fallback image nếu có
        />
        {item.status && item.status === 'AVAILABLE' && (
          <View style={styles.statusIndicator}>
            <Text style={styles.statusText}>Có sẵn</Text>
          </View>
        )}
      </View>

      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.vehicleType}>{item.vehicleType}</Text>

        <View style={styles.statusPriceContainer}>
          <Text style={styles.price}>
            {formatPrice(item.dailyPrice, item.currency)}/ngày
          </Text>
          {/* ẨN trạng thái nếu không có */}
          {/* <Text style={styles.statusText}>... */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thuê xe sang</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm xe, biển số..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Type Filters */}
      <View style={styles.filterContainer}>
        <FlatList
          data={vehicleTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedType === item.key && styles.filterChipSelected,
              ]}
              onPress={() => setSelectedType(item.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === item.key && styles.filterTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Danh sách xe */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Đang tải xe...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadVehicles}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : filteredVehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="car-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Không tìm thấy xe</Text>
          <Text style={styles.emptySubtext}>
            Thử thay đổi tìm kiếm hoặc bộ lọc
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVehicles}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={item => item.id.toString()}
          renderItem={renderVehicle}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HomeScreen;

// === STYLES (đã rút gọn) ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#333' },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333', marginLeft: 8 },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginRight: 8,
  },
  filterChipSelected: { backgroundColor: '#007bff', borderColor: '#007bff' },
  filterText: { fontSize: 14, color: '#666', fontWeight: '500' },
  filterTextSelected: { color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 12 },
  retryButton: { backgroundColor: '#007bff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  listContainer: { padding: 16 },
  row: { justifyContent: 'space-between' },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    width: CARD_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleImageContainer: { position: 'relative', marginBottom: 12 },
  vehicleImage: { width: '100%', height: 100, borderRadius: 12, backgroundColor: '#f0f0f0' },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  vehicleInfo: { padding: 12 },
  vehicleTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 4 },
  vehicleType: { fontSize: 13, color: '#666', marginBottom: 8 },
  statusPriceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 15, fontWeight: '700', color: '#28a745' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4, textAlign: 'center', paddingHorizontal: 40 },
});