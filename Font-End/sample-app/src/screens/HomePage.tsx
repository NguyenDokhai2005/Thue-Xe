import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>RentCar Pro</Text>

      <LinearGradient
        colors={["#0d62ff", "#0aa1ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="car" size={36} color="#0d62ff" />
        </View>
        <Text style={styles.title}>Welcome to RentCar{"\n"}Pro</Text>
        <Text style={styles.subtitle}>
          Your premium car rental experience{"\n"}
          with seamless navigation
        </Text>

        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <Ionicons name="home" color="#0d62ff" size={16} />
            <Text style={styles.featureText}>Quick Access</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="search" color="#0d62ff" size={16} />
            <Text style={styles.featureText}>Smart Search</Text>
          </View>
        </View>
        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <Ionicons name="calendar" color="#0d62ff" size={16} />
            <Text style={styles.featureText}>Easy Booking</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="person" color="#0d62ff" size={16} />
            <Text style={styles.featureText}>Your Profile</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  headerTitle: {
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#0b0b0b',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#0d62ff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: '#eaf4ff',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  featureText: {
    marginLeft: 6,
    color: '#0d62ff',
    fontWeight: '600',
    fontSize: 12,
  },
});



