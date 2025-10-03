import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://fumo.com.vn/wp-content/uploads/2025/06/hinh-nen-xe-lamborghini-huracan-3.jpg' }} // Thay bằng URL ảnh thực tế
          style={styles.heroImage}
        />
        <Text style={styles.title}>Luxury Car Rental</Text>
        <Text style={styles.subtitle}>
          Rent a luxury car for your travel whenever you want with your device!
        </Text>
        <TouchableOpacity style={styles.getStartedButton}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Available Cars Section */}
      <Text style={styles.sectionTitle}>Available Cars</Text>
      <View style={styles.carList}>
        <View style={styles.carItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120x80' }} // Thay bằng URL ảnh thực tế
            style={styles.carImage}
          />
          <View style={styles.carDetails}>
            <Text style={styles.carName}>GLE S 63 4MATIC</Text>
            <Text style={styles.carPrice}>$150/Day</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.carItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120x80' }} // Thay bằng URL ảnh thực tế
            style={styles.carImage}
          />
          <View style={styles.carDetails}>
            <Text style={styles.carName}>CLA 45 AMG</Text>
            <Text style={styles.carPrice}>$150/Day</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.carItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120x80' }} // Thay bằng URL ảnh thực tế
            style={styles.carImage}
          />
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
        <TouchableOpacity style={styles.brandItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }} // Thay bằng logo thương hiệu
            style={styles.brandImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.brandItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }} // Thay bằng logo thương hiệu
            style={styles.brandImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.brandItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }} // Thay bằng logo thương hiệu
            style={styles.brandImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.brandItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }} // Thay bằng logo thương hiệu
            style={styles.brandImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.brandItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/40' }} // Thay bằng logo thương hiệu
            style={styles.brandImage}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroSection: { backgroundColor: '#1a1a2e', padding: 20, alignItems: 'center' },
  heroImage: { width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 20 },
  getStartedButton: { backgroundColor: '#00aaff', padding: 15, borderRadius: 10, width: '80%' },
  getStartedText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', padding: 10, backgroundColor: '#f0f0f0' },
  carList: { padding: 10 },
  carItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  carImage: { width: 120, height: 80, marginRight: 10 },
  carDetails: { flex: 1 },
  carName: { fontSize: 16, fontWeight: 'bold' },
  carPrice: { fontSize: 14, color: '#555' },
  viewButton: { backgroundColor: '#00aaff', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  viewText: { color: '#fff', fontSize: 18 },
  brandList: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#f0f0f0' },
  brandItem: { alignItems: 'center' },
  brandImage: { width: 40, height: 40 },
});

export default HomeScreen;