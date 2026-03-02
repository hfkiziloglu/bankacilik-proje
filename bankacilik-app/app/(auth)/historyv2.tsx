import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';

type TransactionItem = {
  id: number;
  type: string;
  amount: number;
  timestamp: string;
};

const screenHeight = Dimensions.get('window').height;

export default function HistoryScreen() {
  const [history, setHistory] = useState<TransactionItem[]>([]);
  const [error, setError] = useState('');

  const getHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Token bulunamadı.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/transactions/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(response.data);
      setError('');
    } catch (err: any) {
      setError('İşlem geçmişi alınamadı.');
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const renderItem = ({ item }: { item: TransactionItem }) => (
    <View style={styles.item}>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.amount}>Tutar: ₺{item.amount}</Text>
      <Text style={styles.timestamp}>Tarih: {new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>📜 İşlem Geçmişi</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
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
    marginTop: Platform.OS === 'ios' ? screenHeight * 0.02 : screenHeight * 0.02,
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  type: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});
