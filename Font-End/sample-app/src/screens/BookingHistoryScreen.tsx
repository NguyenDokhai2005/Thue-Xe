import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Booking {
  id: number;
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

const BookingHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Get token from storage (you'll need to implement this)
      const token = await getStoredToken();
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem lịch sử đặt xe');
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await fetch('http://localhost:8080/api/bookings/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        Alert.alert('Lỗi', 'Không thể tải lịch sử đặt xe');
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
    return 'mock_token';
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

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>{item.vehicle.title}</Text>
          <Text style={styles.licensePlate}>{item.vehicle.licensePlate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color="#fff" />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
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
        
        {item.status === 'PENDING' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelBooking(item.id)}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Chưa có đặt xe nào</Text>
      <Text style={styles.emptySubtext}>Hãy đặt xe đầu tiên của bạn</Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('VehicleList')}
      >
        <Text style={styles.exploreButtonText}>Khám phá xe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đặt xe</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VehicleList')}>
          <Ionicons name="add" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
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

export default BookingHistoryScreen;

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
  vehicleInfo: { flex: 1 },
  vehicleTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  licensePlate: { fontSize: 14, color: '#666' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 },
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
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 4, marginBottom: 24 },
  exploreButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
