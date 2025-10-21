import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.fullName || !formData.phone) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      // TODO: Implement API call to register
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone
        }),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Đăng ký thành công!', [
          { text: 'OK', onPress: () => navigation.navigate('LoginScreen') }
        ]);
      } else {
        const error = await response.json();
        Alert.alert('Lỗi', error.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Ionicons name="person-add-outline" size={28} color="#007bff" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Tạo tài khoản</Text>
        <Text style={styles.subtitle}>Đăng ký để bắt đầu thuê xe</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên đăng nhập"
              placeholderTextColor="#999"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập họ và tên"
              placeholderTextColor="#999"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>Đăng ký</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLink}> Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 30 },
  formContainer: { marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    color: '#000',
    backgroundColor: '#f9f9f9'
  },
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 12, 
    paddingHorizontal: 14,
    backgroundColor: '#f9f9f9'
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#000' },
  registerButton: { 
    backgroundColor: '#007bff', 
    paddingVertical: 16, 
    borderRadius: 12, 
    marginTop: 10,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  registerText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  loginText: { color: '#888', fontSize: 15 },
  loginLink: { color: '#007bff', fontWeight: '600', fontSize: 15 },
});
