// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

interface User {
  id?: number;
  username: string;
  fullName?: string;
  phone?: string;
  email?: string;
  role?: string;                    // có thể là "ADMIN", "CUSTOMER", "USER"...
  roles?: string[];                 // có thể là mảng ["ROLE_ADMIN"]
  authorities?: { authority: string }[]; // Spring Security trả kiểu này
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (token && userInfo) {
        const parsed = JSON.parse(userInfo);
        setUser(parsed);
      }
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userInfo');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              })
            );
          },
        },
      ]
    );
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  // Hàm xác định người dùng có phải ADMIN không
  const isAdmin = () => {
    if (!user) return false;
    const roles = 
      user.roles ||
      user.authorities?.map((a: any) => a.authority) ||
      (user.role ? [user.role] : []) ||
      [];

    return roles.some((r: string) => 
      r === 'ADMIN' || 
      r === 'ROLE_ADMIN' || 
      r.includes('ADMIN')
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
        </View>

        {/* Avatar & Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
          </View>

          {user ? (
            <>
              <Text style={styles.userName}>
                {user.fullName || user.username}
              </Text>

              {/* FIX HOÀN TOÀN – HIỂN THỊ ROLE ĐÚNG 100% */}
              <Text style={[
                styles.userRole,
                { color: isAdmin() ? '#d4a017' : '#28a745' }
              ]}>
                {isAdmin() ? 'Quản trị viên' : 'Khách hàng'}
              </Text>

              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{user.username}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{user.phone || 'Chưa cập nhật'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <Text style={styles.infoText}>
                  {user.email || `${user.username}@example.com`}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.guestTitle}>Chào mừng bạn!</Text>
              <Text style={styles.guestSubtitle}>
                Đăng nhập để sử dụng đầy đủ tính năng
              </Text>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {user ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('BookingHistory')}
              >
                <Ionicons name="receipt-outline" size={24} color="#007bff" />
                <Text style={styles.actionText}>Lịch sử đặt xe</Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#dc3545" />
                <Text style={[styles.actionText, { color: '#dc3545' }]}>
                  Đăng xuất
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Đăng nhập</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('RegisterScreen')}
              >
                <Text style={styles.secondaryButtonText}>Tạo tài khoản mới</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Phiên bản 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 Car Rental App</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  scrollView: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  profileCard: {
    backgroundColor: '#fff',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: { marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 4 },
  userRole: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 16 
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  infoText: { fontSize: 16, color: '#666', marginLeft: 12, flex: 1 },
  guestTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginTop: 8 },
  guestSubtitle: { fontSize: 14, color: '#888', marginTop: 4, textAlign: 'center' },
  actionSection: { paddingHorizontal: 16, marginTop: 8 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: { flex: 1, marginLeft: 12, fontSize: 16, color: '#333' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  secondaryButton: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 12,
  },
  secondaryButtonText: { color: '#007bff', fontSize: 16, fontWeight: '600' },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  appVersion: { fontSize: 14, color: '#aaa' },
  copyright: { fontSize: 12, color: '#ccc', marginTop: 4 },
});