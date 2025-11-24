import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView,
  RefreshControl, Alert, ActivityIndicator, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Booking {
  id: number;
  vehicleId: number;
  vehicleTitle: string;
  totalAmount: number;
  currency: string;
  status: string;
  startAt: string;
  endAt: string;
  notes: string | null;
  dailyPriceSnapshot: number;
}

const BookingHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

  const fetchBookings = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Chưa đăng nhập', 'Vui lòng đăng nhập để xem lịch sử');
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data: Booking[] = await response.json();
        console.log('DỮ LIỆU BOOKING:', JSON.stringify(data, null, 2));
        setBookings(data);
      } else if (response.status === 401) {
        Alert.alert('Phiên hết hạn', 'Vui lòng đăng nhập lại');
        await AsyncStorage.removeItem('userToken');
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Lỗi', 'Không tải được danh sách đặt xe');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi mạng', 'Không kết nối được server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleCancelBooking = async (id: number) => {
    Alert.alert('Xác nhận hủy', 'Bạn chắc chắn muốn hủy đơn này?', [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Có, hủy',
        style: 'destructive',
        onPress: async () => {
          const token = await AsyncStorage.getItem('userToken');
          const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            Alert.alert('Thành công', 'Đã hủy đơn đặt xe');
            fetchBookings();
          } else Alert.alert('Lỗi', 'Không thể hủy');
        }
      }
    ]);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'PENDING': return '#ffc107';
      case 'ACTIVE': return '#28a745';
      case 'COMPLETED': return '#6c757d';
      case 'CANCELLED': return '#dc3545';
      default: return '#999';
    }
  };

  const getStatusText = (s: string) => {
    switch (s) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'ACTIVE': return 'Đang thuê';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return s;
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const calculateDays = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{item.vehicleTitle}</Text>
          <Text style={styles.plate}>ID xe: {item.vehicleId}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.badgeText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.text}>{formatDate(item.startAt)} → {formatDate(item.endAt)}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.text}>{calculateDays(item.startAt, item.endAt)} ngày</Text>
        </View>
        {item.notes && (
          <View style={styles.row}>
            <Ionicons name="document-text-outline" size={16} color="#666" />
            <Text style={styles.text}>{item.notes}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Ionicons name="cash-outline" size={16} color="#666" />
          <Text style={styles.price}>
            {item.totalAmount.toLocaleString('vi-VN')} {item.currency}
          </Text>
        </View>
      </View>

      {item.status === 'PENDING' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancelBooking(item.id)}>
            <Text style={styles.cancelText}>Hủy đặt xe</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Lịch sử đặt xe</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={bookings.length === 0 ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : { padding: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="car-outline" size={80} color="#ccc" />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Chưa có đơn nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default BookingHistoryScreen;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  topTitle: { fontSize: 18, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#333' },
  plate: { fontSize: 14, color: '#666', marginTop: 4 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  details: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { marginLeft: 10, fontSize: 15, color: '#444', flex: 1 },
  price: { marginLeft: 10, fontSize: 16, fontWeight: '700', color: '#007bff' },
  footer: { marginTop: 12, alignItems: 'flex-end' },
  cancelBtn: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});