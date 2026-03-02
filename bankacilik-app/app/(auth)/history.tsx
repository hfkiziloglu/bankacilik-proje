import { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';

const screenHeight = Dimensions.get('window').height;


class Stack<T> {
  private items: T[] = [];

  push(item: T) {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  toArray(): T[] {
    return [...this.items].reverse(); // LIFO
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/transactions/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Gelen veriyi stack'e push et
      const txStack = new Stack<any>();
      response.data.forEach((tx: any) => {
        txStack.push(tx);
      });

      setTransactions(txStack.toArray());
      setError('');
    } catch (err) {
      setError('İşlem geçmişi alınamadı.');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>📜 İşlem Geçmişi</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.type}</Text>
              <Text>₺{item.amount}</Text>
              <Text>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  content: {
    marginTop: Platform.OS === 'ios' ? screenHeight * 0.28 : screenHeight * 0.22,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 24,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
