import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Booking {
  id: number;
  user: {
    id: number;
    username: string;
    fullName: string;
    phone: string;
  };
  vehicle: {
    id: number;
    title: string;
    licensePlate: string;
    dailyPrice: number;
    currency: string;
  };
  startAt: string;
  endAt: string;
  status: string;
  notes?: string;
  totalPrice: number;
}

const AdminBookingManagementScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const statusOptions = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'ACTIVE', label: 'Đang thuê' },
    { key: 'COMPLETED', label: 'Hoàn thành' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = await getStoredToken();
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập với quyền admin');
        navigation.navigate('LoginScreen');
        return;
      }

      // Note: This endpoint might need to be implemented in the backend
      const response = await fetch('http://localhost:8080/api/bookings/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải danh sách đặt xe');
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
    fetchBookings();
  };

  // Mock function - you need to implement actual token storage
  const getStoredToken = async () => {
    return 'mock_admin_token';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'ACTIVE': return '#28a745';
      case 'COMPLETED': return '#6c757d';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'ACTIVE': return 'Đang thuê';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return 'time-outline';
      case 'ACTIVE': return 'checkmark-circle-outline';
      case 'COMPLETED': return 'checkmark-done-outline';
      case 'CANCELLED': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDays = (startAt: string, endAt: string) => {
    const start = new Date(startAt);
    const end = new Date(endAt);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      const token = await getStoredToken();
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Đã xác nhận đặt xe');
        fetchBookings(); // Refresh the list
      } else {
        Alert.alert('Lỗi', 'Không thể xác nhận đặt xe');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  const handleCompleteBooking = async (bookingId: number) => {
    try {
      const token = await getStoredToken();
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Đã hoàn thành đặt xe');
        fetchBookings(); // Refresh the list
      } else {
        Alert.alert('Lỗi', 'Không thể hoàn thành đặt xe');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có chắc chắn muốn hủy đặt xe này?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: async () => {
            try {
              const token = await getStoredToken();
              const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                Alert.alert('Thành công', 'Đã hủy đặt xe');
                fetchBookings(); // Refresh the list
              } else {
                Alert.alert('Lỗi', 'Không thể hủy đặt xe');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể kết nối đến server');
            }
          }
        }
      ]
    );
  };

  const filteredBookings = selectedStatus === 'ALL' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus);

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingId}>#{item.id}</Text>
          <Text style={styles.customerName}>{item.user.fullName}</Text>
          <Text style={styles.customerPhone}>{item.user.phone}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>{item.vehicle.title}</Text>
        <Text style={styles.licensePlate}>{item.vehicle.licensePlate}</Text>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {formatDate(item.startAt)} - {formatDate(item.endAt)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {calculateDays(item.startAt, item.endAt)} ngày
          </Text>
        </View>

        {item.notes && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.totalPrice}>
          {item.totalPrice.toLocaleString('vi-VN')} {item.vehicle.currency}
        </Text>
        
        <View style={styles.actionButtons}>
          {item.status === 'PENDING' && (
            <>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirmBooking(item.id)}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelBooking(item.id)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </>
          )}
          
          {item.status === 'ACTIVE' && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompleteBooking(item.id)}
            >
              <Text style={styles.completeButtonText}>Hoàn thành</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Không có đặt xe nào</Text>
      <Text style={styles.emptySubtext}>Chưa có đặt xe nào phù hợp với bộ lọc</Text>
    </View>
  );

  const renderFilterChip = (item: { key: string; label: string }) => {
    const isSelected = selectedStatus === item.key;
    
    return (
      <TouchableOpacity
        key={item.key}
        style={[styles.filterChip, isSelected && styles.filterChipSelected]}
        onPress={() => setSelectedStatus(item.key)}
      >
        <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
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
        <Text style={styles.headerTitle}>Quản lý đặt xe</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Tổng đặt xe</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bookings.filter(b => b.status === 'PENDING').length}
          </Text>
          <Text style={styles.statLabel}>Chờ xác nhận</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bookings.filter(b => b.status === 'ACTIVE').length}
          </Text>
          <Text style={styles.statLabel}>Đang thuê</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {bookings.filter(b => b.status === 'COMPLETED').length}
          </Text>
          <Text style={styles.statLabel}>Hoàn thành</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Trạng thái:</Text>
        <View style={styles.filterRow}>
          {statusOptions.map(item => renderFilterChip(item))}
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          Hiển thị {filteredBookings.length} đặt xe
        </Text>
      </View>

      {/* Booking List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
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

export default AdminBookingManagementScreen;

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
  filtersContainer: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterChipSelected: { backgroundColor: '#007bff', borderColor: '#007bff' },
  filterChipText: { fontSize: 14, color: '#666' },
  filterChipTextSelected: { color: '#fff' },
  resultsContainer: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff' },
  resultsText: { fontSize: 14, color: '#666' },
  listContainer: { padding: 16 },
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: { flex: 1 },
  bookingId: { fontSize: 14, fontWeight: '600', color: '#007bff', marginBottom: 4 },
  customerName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  customerPhone: { fontSize: 14, color: '#666' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  vehicleInfo: { marginBottom: 12 },
  vehicleTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  licensePlate: { fontSize: 14, color: '#666' },
  bookingDetails: { marginBottom: 12 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: { fontSize: 14, color: '#666', marginLeft: 8 },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPrice: { fontSize: 16, fontWeight: '700', color: '#007bff' },
  actionButtons: { flexDirection: 'row', gap: 8 },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  confirmButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  completeButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  completeButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4, textAlign: 'center' },
});
