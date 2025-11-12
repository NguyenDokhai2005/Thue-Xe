// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchVehicles, Vehicle } from '../api/vehicleApi';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    loadVehicles();
  }, []);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
    }).format(price);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.sectionTitle}>Danh sách xe</Text>

      {/* Trạng thái */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00aaff" />
          <Text style={styles.loadingText}>Đang tải xe...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              fetchVehicles().then(setVehicles).catch(() => {}).finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : vehicles.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có xe nào.</Text>
      ) : (
        <View style={styles.carList}>
          {vehicles.map((v) => (
            <View key={v.id} style={styles.carItem}>
              {/* Ảnh xe (placeholder) */}
              <Image
                source={{
                  uri: `https://placehold.co/120x80/f0f0f0/333333?text=${encodeURIComponent(
                    v.title.substring(0, 10)
                  )}`,
                }}
                style={styles.carImage}
              />

              {/* Thông tin xe */}
              <View style={styles.carDetails}>
                <Text style={styles.carName} numberOfLines={1}>
                  {v.title}
                </Text>
                <Text style={styles.carType}>{v.vehicleType}</Text>
                <Text style={styles.carPrice}>
                  {formatPrice(v.dailyPrice, v.currency)}/ngày
                </Text>
              </View>

              {/* Nút xem chi tiết */}
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => navigation.navigate('VehicleDetail', { vehicleId: v.id })}
              >
                <Text style={styles.viewText}>→</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  center: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 10 },
  retryButton: { backgroundColor: '#00aaff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  emptyText: { textAlign: 'center', padding: 30, color: '#888', fontSize: 16 },
  carList: { paddingHorizontal: 20, paddingVertical: 10 },
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  carImage: { width: 100, height: 60, borderRadius: 8, marginRight: 15 },
  carDetails: { flex: 1 },
  carName: { fontSize: 16, fontWeight: '700', color: '#333' },
  carType: { fontSize: 13, color: '#666', marginTop: 2 },
  carPrice: { fontSize: 14, color: '#00aaff', fontWeight: 'bold', marginTop: 4 },
  viewButton: {
    backgroundColor: '#1a1a2e',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewText: { color: '#fff', fontSize: 20, fontWeight: '900' },
});