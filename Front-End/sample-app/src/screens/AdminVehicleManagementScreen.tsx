import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, RefreshControl
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

const AdminVehicleManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = await getStoredToken();
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập với quyền admin');
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await fetch('http://localhost:8080/api/vehicles', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles();
  };

  // Mock function - you need to implement actual token storage
  const getStoredToken = async () => {
    return 'mock_admin_token';
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

  const handleDeleteVehicle = async (vehicleId: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa xe này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: async () => {
            try {
              const token = await getStoredToken();
              const response = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                Alert.alert('Thành công', 'Đã xóa xe thành công');
                fetchVehicles(); // Refresh the list
              } else {
                Alert.alert('Lỗi', 'Không thể xóa xe');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể kết nối đến server');
            }
          }
        }
      ]
    );
  };

  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.vehicleCard}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>{item.title}</Text>
          <Text style={styles.vehicleType}>{item.vehicleType}</Text>
          <Text style={styles.licensePlate}>{item.licensePlate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.vehicleDetails}>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>
          {item.dailyPrice.toLocaleString('vi-VN')} {item.currency}/ngày
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AdminEditVehicle', { vehicle: item })}
        >
          <Ionicons name="create-outline" size={16} color="#007bff" />
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteVehicle(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#dc3545" />
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Chưa có xe nào</Text>
      <Text style={styles.emptySubtext}>Hãy thêm xe đầu tiên</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AdminAddVehicle')}
      >
        <Text style={styles.addButtonText}>Thêm xe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý xe</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AdminAddVehicle')}>
          <Ionicons name="add" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{vehicles.length}</Text>
          <Text style={styles.statLabel}>Tổng xe</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {vehicles.filter(v => v.status === 'AVAILABLE').length}
          </Text>
          <Text style={styles.statLabel}>Có sẵn</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {vehicles.filter(v => v.status === 'RENTED').length}
          </Text>
          <Text style={styles.statLabel}>Đã thuê</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {vehicles.filter(v => v.status === 'MAINTENANCE').length}
          </Text>
          <Text style={styles.statLabel}>Bảo trì</Text>
        </View>
      </View>

      {/* Vehicle List */}
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

export default AdminVehicleManagementScreen;

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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#007bff' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  listContainer: { padding: 16 },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: { flex: 1 },
  vehicleTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  vehicleType: { fontSize: 14, color: '#666', marginBottom: 2 },
  licensePlate: { fontSize: 14, color: '#666' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  vehicleDetails: { marginBottom: 12 },
  description: { fontSize: 14, color: '#888', lineHeight: 20, marginBottom: 8 },
  price: { fontSize: 16, fontWeight: '700', color: '#007bff' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  editButtonText: { color: '#007bff', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  deleteButtonText: { color: '#dc3545', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4, marginBottom: 24 },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
