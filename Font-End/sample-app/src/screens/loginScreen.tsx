// src/screens/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  ScrollView, SafeAreaView, Alert, ActivityIndicator
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosInstance';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); // Có thể undefined
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSaved = async () => {
      const saved = await AsyncStorage.getItem('rememberedUsername');
      if (saved) {
        setUsername(saved);
        setRememberMe(true);
      }
    };
    loadSaved();
  }, []);

  const handleGoBack = () => navigation.goBack();

  const handleLogin = async () => {
    const usernameTrimmed = username.trim();
    if (!usernameTrimmed || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ');
      return;
    }

    setLoading(true);
    try {
      const payload = { username: usernameTrimmed, password };
      const response = await api.post('/api/auth/login', payload);

      const { token, fullName, id, phone, role, username: userUsername } = response.data;
      if (!token) throw new Error('Không nhận được token');

      const user = { id, username: userUsername, fullName, phone, role };

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));

      if (rememberMe) {
        await AsyncStorage.setItem('rememberedUsername', usernameTrimmed);
      } else {
        await AsyncStorage.removeItem('rememberedUsername');
      }

      Alert.alert(
        'Đăng nhập thành công!',
        `Chào ${user.fullName || usernameTrimmed}!`,
        [
          {
            text: 'OK',
            onPress: () => {
              const parent = navigation.getParent();
const redirectState = parent?.getState();
const currentRoute = redirectState?.routes?.[redirectState.index || 0];
const redirectParams = currentRoute?.params || {};

const { redirectTo, redirectParams: targetParams } = redirectParams;

if (redirectTo && targetParams) {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'MainTabs',
          state: {
            routes: [
              {
                name: 'Home',
                state: {
                  routes: [
                    { name: 'HomeScreen' },
                    { name: redirectTo, params: targetParams }
                  ]
                }
              }
            ]
          }
        }
      ]
    })
  );
} else {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }]
    })
  );
}
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Sai tài khoản hoặc mật khẩu';
      Alert.alert('Đăng nhập thất bại', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Ionicons name="finger-print-outline" size={28} color="#007bff" />
        </View>

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rememberContainer}>
            <Checkbox value={rememberMe} onValueChange={setRememberMe} color={rememberMe ? '#007bff' : undefined} />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login</Text>}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png' }} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' }} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 30 },
  inputContainer: { marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 15, color: '#000' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14 },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#000' },
  rememberContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  rememberText: { color: '#555', fontSize: 15, marginLeft: 8 },
  loginButton: { backgroundColor: '#007bff', paddingVertical: 14, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  loginText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd' },
  dividerText: { marginHorizontal: 10, color: '#999', fontSize: 14 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialButton: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12 },
  socialIcon: { width: 28, height: 28 },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  signupText: { color: '#888', fontSize: 15 },
  signupLink: { color: '#007bff', fontWeight: '600', fontSize: 15 },
});