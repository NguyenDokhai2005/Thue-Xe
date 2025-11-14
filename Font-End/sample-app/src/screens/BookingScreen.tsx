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
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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

  // ----- STATE -----
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 60 * 1000)); 

  const [showStartTime, setShowStartTime] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const [tempDate, setTempDate] = useState<Date | null>(null);

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // ----- SET DEFAULT END DATE +1 -----
  useEffect(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    setEndDate(t);
  }, []);

  // ----- TÍNH NGÀY -----
  const calculateDays = () => {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const calculateTotalPrice = () => calculateDays() * vehicle.dailyPrice;

  // ----- FORMAT ISO CHUẨN API -----
  const toIsoString = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
    );
  };

  // ----- VALIDATE -----
  const validateBooking = () => {
    const now = new Date();
    if (startDate < now) {
      Alert.alert('Lỗi', 'Ngày bắt đầu không thể là quá khứ.');
      return false;
    }
    if (endDate <= startDate) {
      Alert.alert('Lỗi', 'Ngày kết thúc phải sau ngày bắt đầu.');
      return false;
    }
    return true;
  };

  // ----- HANDLE CHỌN NGÀY + GIỜ -----
  const onSelectDateTime = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
    isStart: boolean = true
  ) => {
    if (event.type === 'dismissed') {
      setShowStartDate(false);
      setShowStartTime(false);
      setShowEndDate(false);
      setShowEndTime(false);
      setTempDate(null);
      return;
    }

    // step 1 → chọn ngày
    if (!tempDate) {
      setTempDate(selectedDate!);

      if (isStart) {
        setShowStartDate(false);
        setShowStartTime(true);
      } else {
        setShowEndDate(false);
        setShowEndTime(true);
      }
      return;
    }

    // step 2 → chọn giờ
    const final = new Date(tempDate);
    final.setHours(selectedDate!.getHours());
    final.setMinutes(selectedDate!.getMinutes());

    if (isStart) {
      setStartDate(final);
      if (final >= endDate) {
        const autoEnd = new Date(final);
        autoEnd.setHours(autoEnd.getHours() + 1);
        setEndDate(autoEnd);
      }
    } else {
      setEndDate(final);
    }

    setTempDate(null);
    setShowStartTime(false);
    setShowEndTime(false);
  };

  // ----- GỬI BOOKING -----
  const handleBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại.');
        navigation.navigate('LoginScreen');
        return;
      }

      const payload = {
        vehicleId: vehicle.id,
        startAt: toIsoString(startDate),
        endAt: toIsoString(endDate),
        notes: notes.trim() || null,
      };

      console.log('PAYLOAD GỬI API:', payload);

      const baseUrl =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:8080'
          : 'http://localhost:8080';

      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let text = await response.text();
      let result = text ? JSON.parse(text) : null;

      console.log('RESPONSE API:', result);

      if (response.ok) {
        Alert.alert(
          'Đặt xe thành công!',
          result?.id
            ? `Mã đặt xe: #${result.id}\nChờ quản trị viên xác nhận.`
            : 'Đặt xe thành công.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                  })
                ),
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', result?.message || 'Không thể đặt xe.');
      }
    } catch (err) {
      console.log('LỖI:', err);
      Alert.alert('Lỗi mạng', 'Không kết nối được server.');
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // UI STARTS HERE
  // =================================================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt xe</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* THÔNG TIN XE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin xe</Text>
          <Text style={styles.carName}>{vehicle.title}</Text>
          <Text style={styles.carSub}>{vehicle.vehicleType}</Text>
          <Text style={styles.carSub}>Biển số: {vehicle.licensePlate}</Text>
          <Text style={styles.carPrice}>
            {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}/ngày
          </Text>
        </View>

        {/* PICK START DATETIME */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Thời gian bắt đầu</Text>

  <TouchableOpacity
    style={styles.pickButton}
    onPress={() => {
      setShowStartDate(true);
      setShowStartTime(false);
    }}
  >
    <Ionicons name="calendar-outline" size={20} color="#555" />
    <Text style={styles.pickText}>
      {startDate.toLocaleDateString('vi-VN')} {startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
    </Text>
  </TouchableOpacity>

  {/* Chọn Ngày - Android */}
  {showStartDate && (
    <DateTimePicker
      value={startDate}
      mode="date"
      display="calendar"
      onChange={(event, selectedDate) => {
        if (event.type === 'dismissed') {
          // Bấm nút back hoặc Cancel
          setShowStartDate(false);
          return;
        }

        if (event.type === 'set' && selectedDate) {
          // Người dùng bấm OK
          const tempDate = new Date(selectedDate);
          // Giữ lại giờ/phút cũ trước khi mở picker giờ
          tempDate.setHours(startDate.getHours());
          tempDate.setMinutes(startDate.getMinutes());
          
          setStartDate(tempDate);
          setShowStartDate(false);
          setShowStartTime(true); // Mở chọn giờ ngay
        }
      }}
    />
  )}

  {/* Chọn Giờ - Android */}
  {showStartTime && (
    <DateTimePicker
      value={startDate}
      mode="time"
      display="default"
      is24Hour={true}
      onChange={(event, selectedDate) => {
        setShowStartTime(false); // Luôn đóng picker giờ

        if (event.type === 'set' && selectedDate) {
          setStartDate(selectedDate); // Lưu giờ mới
        }
        // Nếu bấm Cancel thì giữ nguyên giờ cũ
      }}
    />
  )}
</View>

{/* PICK END DATETIME */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Thời gian kết thúc</Text>

  <TouchableOpacity
    style={styles.pickButton}
    onPress={() => {
      setShowEndDate(true);
      setShowEndTime(false);
    }}
  >
    <Ionicons name="calendar-outline" size={20} color="#555" />
    <Text style={styles.pickText}>
      {endDate.toLocaleDateString('vi-VN')} {endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
    </Text>
  </TouchableOpacity>

  {/* Chọn Ngày - Android */}
  {showEndDate && (
    <DateTimePicker
      value={endDate}
      mode="date"
      display="calendar"
      onChange={(event, selectedDate) => {
        if (event.type === 'dismissed') {
          setShowEndDate(false);
          return;
        }

        if (event.type === 'set' && selectedDate) {
          const tempDate = new Date(selectedDate);
          tempDate.setHours(endDate.getHours());
          tempDate.setMinutes(endDate.getMinutes());
          
          setEndDate(tempDate);
          setShowEndDate(false);
          setShowEndTime(true); // Mở chọn giờ
        }
      }}
    />
  )}

  {/* Chọn Giờ - Android */}
  {showEndTime && (
    <DateTimePicker
      value={endDate}
      mode="time"
      display="default"
      is24Hour={true}
      onChange={(event, selectedDate) => {
        setShowEndTime(false);

        if (event.type === 'set' && selectedDate) {
          setEndDate(selectedDate);
        }
      }}
    />
  )}
</View>

{/* GHI CHÚ - NOTES */}
<View style={styles.card}>
  <Text style={styles.cardTitle}>Ghi chú (nếu có)</Text>
  <TextInput
    style={styles.notesInput}
    placeholder="Ví dụ: Giao xe tại sân bay Tân Sơn Nhất, cần hóa đơn VAT, xe màu trắng..."
    placeholderTextColor="#999"
    multiline={true}
    numberOfLines={4}
    textAlignVertical="top"
    value={notes}
    onChangeText={setNotes}
    autoCapitalize="sentences"
    autoCorrect={true}
  />
</View>
        {/* TỔNG TIỀN */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text>Giá thuê/ngày</Text>
            <Text>
              {vehicle.dailyPrice.toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          </View>

          <View style={styles.row}>
            <Text>Số ngày thuê</Text>
            <Text>{calculateDays()} ngày</Text>
          </View>

          <View style={styles.row2}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {calculateTotalPrice().toLocaleString('vi-VN')} {vehicle.currency}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.bookText}>Xác nhận đặt xe</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;

// =================================================
// STYLES
// =================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    margin: 12,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  carName: { fontSize: 16, fontWeight: '600' },
  carSub: { fontSize: 14, color: '#555' },
  carPrice: { marginTop: 10, color: '#007bff', fontWeight: '700' },

  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
  },
  pickText: { marginLeft: 10, fontSize: 16 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#007bff' },

  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  bookButton: {
    backgroundColor: '#007bff',
    padding: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  bookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notesInput: {
  backgroundColor: '#f9f9f9',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingTop: 14,
  paddingBottom: 14,
  fontSize: 15,
  minHeight: 100,
  maxHeight: 160,
  marginTop: 8,
},
});
