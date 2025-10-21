import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, TextInput, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface User {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  role: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await getStoredToken();
      
      if (!token) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập');
        navigation.navigate('LoginScreen');
        return;
      }

      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setEditData({
          fullName: data.fullName,
          phone: data.phone,
        });
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  // Mock function - you need to implement actual token storage
  const getStoredToken = async () => {
    return 'mock_token';
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = await getStoredToken();
      
      const response = await fetch('http://localhost:8080/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user?.id,
          fullName: editData.fullName,
          phone: editData.phone,
        }),
      });

      if (response.ok) {
        Alert.alert('Thành công', 'Cập nhật thông tin thành công');
        setEditing(false);
        fetchUserProfile(); // Refresh user data
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    });
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: async () => {
            // Clear token from storage
            await clearStoredToken();
            navigation.navigate('LoginScreen');
          }
        }
      ]
    );
  };

  // Mock function - you need to implement actual token clearing
  const clearStoredToken = async () => {
    // Clear token from AsyncStorage or SecureStore
  };

  const menuItems = [
    {
      icon: 'car-outline',
      title: 'Lịch sử đặt xe',
      onPress: () => navigation.navigate('BookingHistory'),
    },
    {
      icon: 'settings-outline',
      title: 'Cài đặt',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Trợ giúp',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
    },
    {
      icon: 'information-circle-outline',
      title: 'Về ứng dụng',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển'),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-outline" size={64} color="#ccc" />
            </View>
            
            <Text style={styles.loginTitle}>Chưa đăng nhập</Text>
            <Text style={styles.loginSubtitle}>
              Vui lòng đăng nhập để xem thông tin cá nhân và sử dụng các tính năng của ứng dụng
            </Text>
            
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.registerButtonText}>Chưa có tài khoản? Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://placehold.co/80x80/007bff/ffffff?text=' + user.username.charAt(0).toUpperCase() }}
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.role}>{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</Text>
        </View>

        {/* User Info */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
            {!editing ? (
              <TouchableOpacity onPress={handleEdit}>
                <Ionicons name="create-outline" size={20} color="#007bff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.saveText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên đăng nhập</Text>
            <Text style={styles.value}>{user.username}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Họ và tên</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={editData.fullName}
                onChangeText={(text) => setEditData(prev => ({ ...prev, fullName: text }))}
                placeholder="Nhập họ và tên"
              />
            ) : (
              <Text style={styles.value}>{user.fullName}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số điện thoại</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                value={editData.phone}
                onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.value}>{user.phone}</Text>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color="#666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Change Password */}
        <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
          <Ionicons name="key-outline" size={20} color="#007bff" />
          <Text style={styles.changePasswordText}>Đổi mật khẩu</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
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
  profileCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  username: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 4 },
  role: { fontSize: 14, color: '#666' },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  editActions: { flexDirection: 'row', gap: 12 },
  cancelButton: { paddingHorizontal: 12, paddingVertical: 6 },
  cancelText: { color: '#666', fontSize: 14 },
  saveButton: { paddingHorizontal: 12, paddingVertical: 6 },
  saveText: { color: '#007bff', fontSize: 14, fontWeight: '600' },
  infoRow: { marginBottom: 16 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, color: '#333' },
  input: {
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 16, color: '#333', marginLeft: 12 },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changePasswordText: { fontSize: 16, color: '#333', marginLeft: 12, flex: 1 },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 8 },
  loginSubtitle: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    lineHeight: 20, 
    marginBottom: 24 
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  registerButton: { paddingVertical: 8 },
  registerButtonText: { color: '#007bff', fontSize: 14, textAlign: 'center' },
});
