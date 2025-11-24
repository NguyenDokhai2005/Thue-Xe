import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AdminAddVehicleScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    title: '',
    vehicleType: 'SEDAN',
    licensePlate: '',
    dailyPrice: '',
    currency: 'VND',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const vehicleTypes = [
    { key: 'SEDAN', label: 'Sedan' },
    { key: 'SUV', label: 'SUV' },
    { key: 'HATCHBACK', label: 'Hatchback' },
    { key: 'CONVERTIBLE', label: 'Convertible' },
  ];

  const currencies = [
    { key: 'VND', label: 'VND' },
    { key: 'USD', label: 'USD' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.title || !formData.licensePlate || !formData.dailyPrice) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return false;
    }
    
    const price = parseFloat(formData.dailyPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Lỗi', 'Giá thuê phải là số dương');
      return false;
    }
    
    return true;
  };

  const handleAddVehicle = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = await getStoredToken();
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập với quyền admin');
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await fetch('http://localhost:8080/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          vehicleType: formData.vehicleType,
          licensePlate: formData.licensePlate,
          dailyPrice: parseFloat(formData.dailyPrice),
          currency: formData.currency,
          description: formData.description,
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Thành công',
          'Thêm xe thành công!',
          [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        const error = await response.json();
        Alert.alert('Lỗi', error.message || 'Thêm xe thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Mock function - you need to implement actual token storage
  const getStoredToken = async () => {
    return 'mock_admin_token';
  };

  const renderSelectOption = (options: { key: string; label: string }[], field: string) => (
    <View style={styles.selectContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.selectOption,
            formData[field as keyof typeof formData] === option.key && styles.selectOptionSelected
          ]}
          onPress={() => handleInputChange(field, option.key)}
        >
          <Text style={[
            styles.selectOptionText,
            formData[field as keyof typeof formData] === option.key && styles.selectOptionTextSelected
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm xe mới</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Form */}
        <View style={styles.formContainer}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên xe *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên xe"
              placeholderTextColor="#999"
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
            />
          </View>

          {/* Vehicle Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loại xe *</Text>
            {renderSelectOption(vehicleTypes, 'vehicleType')}
          </View>

          {/* License Plate */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biển số xe *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập biển số xe"
              placeholderTextColor="#999"
              value={formData.licensePlate}
              onChangeText={(value) => handleInputChange('licensePlate', value)}
            />
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giá thuê/ngày *</Text>
            <View style={styles.priceContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Nhập giá thuê"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.dailyPrice}
                onChangeText={(value) => handleInputChange('dailyPrice', value)}
              />
              <View style={styles.currencyContainer}>
                {renderSelectOption(currencies, 'currency')}
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Nhập mô tả xe..."
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.addButton, { opacity: loading ? 0.7 : 1 }]}
          onPress={handleAddVehicle}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? 'Đang thêm...' : 'Thêm xe'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdminAddVehicleScreen;

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
  scrollView: { flex: 1 },
  formContainer: { padding: 16 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectOptionSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectOptionTextSelected: {
    color: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  currencyContainer: {
    minWidth: 80,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    height: 100,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
