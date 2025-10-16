import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- Cần thiết cho việc chuyển trang

const HomeScreen = () => {
  // Khởi tạo Navigation
  const navigation = useNavigation<any>();

  // Hàm xử lý chuyển trang
  const handleGetStarted = () => {
    // Tên màn hình phải khớp với tên trong App.tsx ('LoginScreen')
    // Đảm bảo bạn đã đặt tên route là "LoginScreen" (chữ L và S hoa) trong App.tsx
    navigation.navigate('LoginScreen');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          // Lưu ý: Sử dụng placeholder thay vì URL trực tiếp vì URL có thể không ổn định
          source={{ uri: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Luxury+Car' }} 
          style={styles.heroImage}
        />
        <Text style={styles.title}>Luxury Car Rental</Text>
        <Text style={styles.subtitle}>
          Rent a luxury car for your travel whenever you want with your device!
        </Text>
        {/* Nút chuyển sang LoginScreen */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Available Cars Section */}
      <Text style={styles.sectionTitle}>Available Cars</Text>
      <View style={styles.carList}>
        {/* Item 1 */}
        <View style={styles.carItem}>
          <Image source={{ uri: 'https://placehold.co/120x80/f0f0f0/333333?text=GLE+S+63' }} style={styles.carImage} />
          <View style={styles.carDetails}>
            <Text style={styles.carName}>GLE S 63 4MATIC</Text>
            <Text style={styles.carPrice}>$150/Day</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewText}>→</Text>
          </TouchableOpacity>
        </View>
        {/* Item 2 */}
        <View style={styles.carItem}>
          <Image source={{ uri: 'https://placehold.co/120x80/f0f0f0/333333?text=CLA+45+AMG' }} style={styles.carImage} />
          <View style={styles.carDetails}>
            <Text style={styles.carName}>CLA 45 AMG</Text>
            <Text style={styles.carPrice}>$150/Day</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewText}>→</Text>
          </TouchableOpacity>
        </View>
        {/* Item 3 */}
        <View style={styles.carItem}>
          <Image source={{ uri: 'https://placehold.co/120x80/f0f0f0/333333?text=AMG+CLA+45' }} style={styles.carImage} />
          <View style={styles.carDetails}>
            <Text style={styles.carName}>AMG CLA 45</Text>
            <Text style={styles.carPrice}>$150/Day</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Brands Section */}
      <Text style={styles.sectionTitle}>Brands</Text>
      <View style={styles.brandList}>
        {['Mercedes', 'BMW', 'Audi', 'Lexus', 'Porsche'].map((brand, index) => (
          <TouchableOpacity key={index} style={styles.brandItem}>
            <Image 
              source={{ uri: `https://placehold.co/40x40/f0f0f0/000?text=${brand.charAt(0)}` }} 
              style={styles.brandImage} 
            />
            <Text style={styles.brandText}>{brand}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroSection: { backgroundColor: '#1a1a2e', padding: 20, alignItems: 'center' },
  heroImage: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 20, borderRadius: 10 }, // Thêm borderRadius
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#ccc', fontSize: 14, textAlign: 'center', marginBottom: 30 }, // Màu chữ nhạt hơn
  getStartedButton: { 
    backgroundColor: '#00aaff', 
    padding: 15, 
    borderRadius: 10, 
    width: '80%', 
    shadowColor: '#00aaff', // Thêm shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  getStartedText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', paddingVertical: 15, paddingHorizontal: 20, backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderColor: '#ddd' },
  carList: { paddingHorizontal: 20, paddingVertical: 10 },
  carItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  carImage: { width: 100, height: 60, marginRight: 15, borderRadius: 5, resizeMode: 'cover' }, // Giảm kích thước ảnh và thêm border
  carDetails: { flex: 1 },
  carName: { fontSize: 16, fontWeight: '700', color: '#333' },
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
  brandList: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, paddingHorizontal: 10, backgroundColor: '#f0f0f0', flexWrap: 'wrap' },
  brandItem: { alignItems: 'center', width: 60, marginVertical: 10 },
  brandImage: { width: 40, height: 40, borderRadius: 20, marginBottom: 5, borderWidth: 1, borderColor: '#ccc' },
  brandText: { fontSize: 12, color: '#555' },
});

export default HomeScreen;
