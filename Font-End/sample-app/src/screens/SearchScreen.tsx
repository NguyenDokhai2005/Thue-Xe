import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

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

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('AVAILABLE');

  const vehicleTypes = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'SEDAN', label: 'Sedan' },
    { key: 'SUV', label: 'SUV' },
    { key: 'HATCHBACK', label: 'Hatchback' },
    { key: 'CONVERTIBLE', label: 'Convertible' },
  ];

  const statusOptions = [
    { key: 'AVAILABLE', label: 'Available', color: '#28a745' },
    { key: 'RENTED', label: 'Rented', color: '#dc3545' },
    { key: 'MAINTENANCE', label: 'Maintenance', color: '#ffc107' },
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [searchQuery, selectedType, selectedStatus, vehicles]);

  const fetchVehicles = async () => {
    setLoading(true);
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
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(vehicle =>
        vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by vehicle type
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(vehicle => vehicle.vehicleType === selectedType);
    }

    // Filter by status
    filtered = filtered.filter(vehicle => vehicle.status === selectedStatus);

    setFilteredVehicles(filtered);
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
        <View style={styles.vehicleImagePlaceholder}>
          <Ionicons name={getVehicleTypeIcon(item.vehicleType)} size={40} color="#007bff" />
        </View>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        </View>
      </View>
      
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle} numberOfLines={1}>{item.title}</Text>
        
        <View style={styles.statusPriceContainer}>
          {item.status === 'AVAILABLE' ? (
            <Text style={styles.price}>
              ${item.dailyPrice}/day
            </Text>
          ) : (
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          )}
        </View>

        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#ffc107" />
          <Text style={styles.rating}>4.5</Text>
        </View>

        <TouchableOpacity style={[
          styles.actionButton,
          item.status === 'MAINTENANCE' && styles.scheduleButton
        ]}>
          <Text style={[
            styles.actionButtonText,
            item.status === 'MAINTENANCE' && styles.scheduleButtonText
          ]}>
            {item.status === 'RENTED' ? 'View' : 
             item.status === 'MAINTENANCE' ? 'Schedule' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Không tìm thấy xe nào</Text>
      <Text style={styles.emptySubtext}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</Text>
    </View>
  );

  const renderStatusFilter = (item: { key: string; label: string; color: string }) => {
    const isSelected = selectedStatus === item.key;
    
    return (
      <TouchableOpacity
        key={item.key}
        style={[styles.statusFilterChip, isSelected && styles.statusFilterChipSelected]}
        onPress={() => setSelectedStatus(item.key)}
      >
        <Text style={[styles.statusFilterText, isSelected && styles.statusFilterTextSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cars</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="grid-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cars..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Status Filters */}
      <View style={styles.statusFiltersContainer}>
        <View style={styles.statusFiltersRow}>
          {statusOptions.map(item => renderStatusFilter(item))}
        </View>
      </View>

      {/* Vehicle List */}
      <FlatList
        data={filteredVehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AdminAddVehicle')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  headerActions: { flexDirection: 'row', gap: 12 },
  headerButton: { padding: 4 },
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
  statusFiltersContainer: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusFiltersRow: { flexDirection: 'row', gap: 12 },
  statusFilterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusFilterChipSelected: { 
    backgroundColor: '#007bff', 
    borderColor: '#007bff' 
  },
  statusFilterText: { fontSize: 14, color: '#666', fontWeight: '500' },
  statusFilterTextSelected: { color: '#fff' },
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
  vehicleImageContainer: { 
    position: 'relative', 
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  vehicleImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vehicleInfo: { padding: 12 },
  vehicleTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8 
  },
  statusPriceContainer: { marginBottom: 8 },
  price: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#28a745' 
  },
  statusText: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: { 
    fontSize: 14, 
    color: '#666', 
    marginLeft: 4,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  scheduleButton: {
    backgroundColor: '#007bff',
  },
  scheduleButtonText: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4, textAlign: 'center' },
});
