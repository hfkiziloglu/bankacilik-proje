import { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';

const screenHeight = Dimensions.get('window').height;

export default function WithdrawScreen() {
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Giriş yapılmamış.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/transactions/withdraw`,
        {
          amount: parseFloat(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(`Para çekme başarılı. Yeni bakiye: ₺${response.data.balance}`);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'İşlem sırasında hata oluştu.');
      setResult('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          🏧 Para Çek
        </Text>

        <TextInput
          label="Tutar"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleWithdraw} style={styles.button}>
          Para Çek
        </Button>
        {result ? <Text style={styles.success}>{result}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
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
    marginTop: Platform.OS === 'ios' ? screenHeight * 0.36 : screenHeight * 0.36,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  success: {
    marginTop: 20,
    color: 'green',
    fontWeight: 'bold',
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontWeight: 'bold',
  },
});
