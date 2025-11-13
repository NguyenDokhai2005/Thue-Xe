// src/screens/BookingScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { vehicle } = route.params as { vehicle: Vehicle };

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Khởi tạo thời gian đẹp hơn
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    // Start: làm tròn lên +2 tiếng từ giờ hiện tại
    const start = new Date(now);
    start.setHours(start.getHours() + 2);
    start.setMinutes(0, 0, 0);

    setStartDate(start);
    setEndDate(tomorrow);
  }, []);

  const calculateDays = (): number => {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  };

  const calculateTotalPrice = (): number => calculateDays() * vehicle.dailyPrice;

  const formatISO = (date: Date): string => {
    return date.toISOString().slice(0, 16) + ':00'; // 2025-11-15T14:00:00
  };

  const validateBooking = (): boolean => {
    if (startDate >= endDate) {
      Alert.alert('Lỗi', 'Thời gian kết thúc phải sau thời gian bắt đầu');
      return false;
    }
    if (startDate < new Date()) {
      Alert.alert('Lỗi', 'Thời gian bắt đầu không được trong quá khứ');
      return false;
    }
    return true;
  };

  // XỬ LÝ DateTimePicker HOÀN HẢO CHO EXPO 51
  const onDateChange = (
    event: any,
    selectedDate?: Date,
    isStart: boolean = true
  ) => {
    // Android: khi bấm Cancel → event.type === 'dismissed'
    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') {
        isStart ? setShowStartPicker(false) : setShowEndPicker(false);
        return;
      }
      // Chỉ xử lý khi bấm "OK" (set)
      if (!selectedDate) return;
    }

    // iOS hoặc Android đã chọn xong
    if (selectedDate) {
      if (isStart) {
        setStartDate(selectedDate);
        setShowStartPicker(false);

        // Tự động đẩy endDate nếu bị nhỏ hơn
        if (selectedDate >= endDate) {
          const newEnd = new Date(selectedDate);
          newEnd.setDate(newEnd.getDate() + 1);
          newEnd.setHours(12, 0, 0, 0);
          setEndDate(newEnd);
        }
      } else {
        setEndDate(selectedDate);
        setShowEndPicker(false);
      }
    }
  };

  const handleBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
        navigation.navigate('LoginScreen');
        return;
      }

      const payload = {
        vehicleId: vehicle.id,
        startAt: formatISO(startDate),
        endAt: formatISO(endDate),
        notes: notes.trim() || null,
      };

      const baseUrl = __DEV__
        ? Platform.OS === 'android'
          ? 'http://10.0.2.2:8080'
          : 'http://localhost:8080'
        : 'https://your-api.com';

      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Thành công!',
          `Đặt xe thành công! Mã đặt chỗ: #${result.id || result.bookingId}`,
          [{
            text: 'OK',
            onPress: () => navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              })
            ),
          }]
        );
      } else {
        const msg = result.message || result.error || 'Đã có lỗi xảy ra';
        Alert.alert('Đặt xe thất bại', msg);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert('Lỗi kết nối', 'Không thể kết nối đến máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt xe</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Thông tin xe */}
        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Thông tin xe</Text>
          <Text style={styles.vehicleName}>{vehicle.title}</Text>
          <Text style={styles.vehicleType}>{vehicle.vehicleType}</Text>
          <Text style={styles.licensePlate}>Biển số: {vehicle.licensePlate}</Text>
          <Text style={styles.dailyPrice}>
            {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}/ngày
          </Text>
        </View>

        {/* Thời gian thuê */}
        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Thời gian thuê</Text>

          {/* Từ */}
          <View style={styles.dateSection}>
            <Text style={styles.label}>Từ</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>{formatDisplayDate(startDate)}</Text>
            </TouchableOpacity>
          </View>

          {/* Đến */}
          <View style={styles.dateSection}>
            <Text style={styles.label}>Đến</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>{formatDisplayDate(endDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số ngày thuê</Text>
            <Text style={styles.summaryValue}>{calculateDays()} ngày</Text>
          </View>
        </View>

        {/* Picker (chỉ hiện khi cần) */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="datetime"
            minimumDate={new Date()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, d) => onDateChange(e, d, true)}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="datetime"
            minimumDate={new Date(startDate.getTime() + 60 * 60 * 1000)} // ít nhất 1 tiếng sau
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, d) => onDateChange(e, d, false)}
          />
        )}

        {/* Ghi chú */}
        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Ghi chú (không bắt buộc)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Ví dụ: Cần xe sạch, có ghế trẻ em..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Tổng tiền */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giá thuê/ngày</Text>
            <Text style={styles.summaryValue}>
              {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số ngày</Text>
            <Text style={styles.summaryValue}>× {calculateDays()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {calculateTotalPrice().toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Nút đặt xe cố định dưới cùng */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.disabledButton]}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.bookButtonText}>
              Xác nhận đặt xe • {calculateTotalPrice().toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;

// Styles giữ nguyên, chỉ thêm chút đẹp hơn
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 16 },
  vehicleName: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 6 },
  vehicleType: { fontSize: 15, color: '#666', marginBottom: 4 },
  licensePlate: { fontSize: 15, color: '#444', marginBottom: 8 },
  dailyPrice: { fontSize: 17, fontWeight: 'bold', color: '#007bff' },
  dateSection: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: { fontSize: 16, color: '#333', marginLeft: 10, flex: 1 },
  notesInput: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 16, color: '#666' },
  summaryValue: { fontSize: 16, fontWeight: '600', color: '#222' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#007bff' },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: { opacity: 0.7 },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});