import { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getBalance = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Token bulunamadı.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/users/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBalance(response.data.balance);
      setError('');
    } catch (err) {
      setError('Bakiye alınamadı.');
      setBalance(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login');
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>🏦 Senin Bankan</Text>

        <View style={{ height: 15 }} />

        <View style={styles.balanceBox}>
          {loading && <Text>Yükleniyor...</Text>}
          {balance !== null && (
            <Text style={styles.balance}>Bakiyeniz: ₺{balance.toFixed(2)}</Text>
          )}
          {error && <Text style={styles.error}>{error}</Text>}
          <Button mode="outlined" onPress={getBalance} style={styles.button}>
            Bakiyeyi Yenile
          </Button>
        </View>

        <Divider style={{ marginVertical: 20 }} />

        <View style={styles.actions}>
          <Button mode="contained" onPress={() => router.push('/transfer')} style={styles.button}>
            💸 Para Gönder
          </Button>

          <Button mode="contained" onPress={() => router.push('/deposit')} style={styles.button}>
            💰 Para Yatır
          </Button>

          <Button mode="contained" onPress={() => router.push('/withdraw')} style={styles.button}>
            🏧 Para Çek
          </Button>

          <Button mode="contained" onPress={() => router.push('/history')} style={styles.button}>
            📜 İşlem Geçmişi
          </Button>

          <Button mode="contained" onPress={() => router.push('/profile')} style={styles.button}>
            👤 Profil
          </Button>

          <Button mode="outlined" onPress={handleLogout} style={styles.logout}>
            🚪 Çıkış Yap
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  content: {
    marginTop: Platform.OS === 'ios' ? screenHeight * 0.20 : screenHeight * 0.13,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 24,
  },
  balanceBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  balance: { fontSize: 20, color: 'green', marginTop: 10 },
  error: { marginTop: 10, color: 'red' },
  actions: { marginTop: 10 },
  button: { marginVertical: 8 },
  logout: { marginTop: 20, borderColor: 'red', borderWidth: 1 },
});
