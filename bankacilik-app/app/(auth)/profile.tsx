import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';

const screenHeight = Dimensions.get('window').height;

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [iban, setIban] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFullName(response.data.full_name);
      setIban(response.data.iban);
      setEmail(response.data.email);
      setBalance(response.data.balance);
    } catch (err) {
      setError('Profil bilgileri alınamadı.');
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      await axios.put(`${API_BASE_URL}/users/update`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          full_name: fullName,
          email: email,
        },
      });

      setSuccess('Bilgiler güncellendi.');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Güncelleme başarısız.');
      setSuccess('');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>👤 Profil Bilgileri</Text>

        {balance !== null && (
          <Text style={styles.balance}>Bakiyeniz: ₺{balance.toFixed(2)}</Text>
        )}

        <TextInput
          label="Ad Soyad"
          value={fullName}
          onChangeText={setFullName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="IBAN"
          value={iban}
          mode="outlined"
          disabled
          style={styles.input}
        />

        <Button mode="contained" onPress={handleUpdate} style={styles.button}>
          Güncelle
        </Button>

        <Button mode="outlined" onPress={handleLogout} style={styles.logout}>
          Çıkış Yap
        </Button>

        {success ? <Text style={styles.success}>{success}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  content: {
    marginTop: Platform.OS === 'ios' ? screenHeight * 0.27 : screenHeight * 0.24,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 24,
  },
  balance: {
    fontSize: 18,
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: { marginBottom: 16 },
  button: { marginTop: 10 },
  logout: { marginTop: 20, borderColor: 'red', borderWidth: 1 },
  success: { marginTop: 16, color: 'green', fontWeight: 'bold' },
  error: { marginTop: 16, color: 'red', fontWeight: 'bold' },
});
