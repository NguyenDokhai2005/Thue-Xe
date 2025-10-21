import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default end date to next day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEndDate(tomorrow);
  }, []);

  const calculateDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotalPrice = () => {
    return calculateDays() * vehicle.dailyPrice;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const validateBooking = () => {
    if (startDate >= endDate) {
      Alert.alert('Lỗi', 'Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }
    
    const now = new Date();
    if (startDate < now) {
      Alert.alert('Lỗi', 'Ngày bắt đầu không thể trong quá khứ');
      return false;
    }
    
    return true;
  };

  const handleBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      // Get token from storage (you'll need to implement this)
      const token = await getStoredToken(); // You need to implement this function
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để đặt xe');
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
          notes: notes,
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Thành công',
          'Đặt xe thành công! Vui lòng chờ admin xác nhận.',
          [
            { text: 'OK', onPress: () => navigation.navigate('BookingHistory') }
          ]
        );
      } else {
        const error = await response.json();
        Alert.alert('Lỗi', error.message || 'Đặt xe thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Mock function - you need to implement actual token storage
  const getStoredToken = async () => {
    // This should get the JWT token from AsyncStorage or SecureStore
    return 'mock_token';
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt xe</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Vehicle Info */}
        <View style={styles.vehicleCard}>
          <Text style={styles.cardTitle}>Thông tin xe</Text>
          <Text style={styles.vehicleName}>{vehicle.title}</Text>
          <Text style={styles.vehicleType}>{vehicle.vehicleType}</Text>
          <Text style={styles.licensePlate}>Biển số: {vehicle.licensePlate}</Text>
          <Text style={styles.dailyPrice}>
            {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}/ngày
          </Text>
        </View>

        {/* Booking Details */}
        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>Chi tiết đặt xe</Text>
          
          {/* Start Date */}
          <View style={styles.dateSection}>
            <Text style={styles.label}>Ngày bắt đầu</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#007bff" />
              <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
          </View>

          {/* End Date */}
          <View style={styles.dateSection}>
            <Text style={styles.label}>Ngày kết thúc</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#007bff" />
              <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View style={styles.notesSection}>
            <Text style={styles.label}>Ghi chú (tùy chọn)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Nhập ghi chú..."
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Tóm tắt giá</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số ngày thuê:</Text>
            <Text style={styles.summaryValue}>{calculateDays()} ngày</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Giá/ngày:</Text>
            <Text style={styles.summaryValue}>
              {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              {calculateTotalPrice().toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.bookButton, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleBooking}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt xe'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="datetime"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}
    </SafeAreaView>
  );
};

export default BookingScreen;

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
  scrollView: { flex: 1, padding: 16 },
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
  summaryCard: {
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
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  vehicleName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  vehicleType: { fontSize: 14, color: '#666', marginBottom: 4 },
  licensePlate: { fontSize: 14, color: '#666', marginBottom: 8 },
  dailyPrice: { fontSize: 16, fontWeight: '700', color: '#007bff' },
  dateSection: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  dateText: { fontSize: 16, color: '#333', marginLeft: 8 },
  notesSection: { marginBottom: 16 },
  notesInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 16, color: '#666' },
  summaryValue: { fontSize: 16, fontWeight: '600', color: '#333' },
  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 12,
  },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#007bff' },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
