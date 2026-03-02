import { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { TextInput, Button, Text, Card, RadioButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';

const screenHeight = Dimensions.get('window').height;

export default function TransferScreen() {
  const [method, setMethod] = useState<'email' | 'iban'>('email');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Giriş yapılmamış.');
        return;
      }

      const body: any = {
        amount: parseFloat(amount),
      };

      if (method === 'email') {
        body.receiver_email = recipient;
      } else {
        body.receiver_iban = recipient;
      }

      const response = await axios.post(`${API_BASE_URL}/transactions/transfer`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResult(`Transfer başarılı. Yeni bakiyeniz: ₺${response.data.sender_balance}`);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Transfer hatası.');
      setResult('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.pageTitle}>💸 Para Gönder</Text>

        <Card style={styles.card}>
          <Card.Content>

            <Text style={styles.label}>Gönderim Yöntemi:</Text>
            <RadioButton.Group
              onValueChange={(value) => setMethod(value as 'email' | 'iban')}
              value={method}
            >
              <View style={styles.radioRow}>
                <RadioButton value="email" />
                <Text>E-posta</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="iban" />
                <Text>IBAN</Text>
              </View>
            </RadioButton.Group>

            <TextInput
              label={method === 'email' ? 'Alıcı E-posta' : 'Alıcı IBAN'}
              value={recipient}
              onChangeText={setRecipient}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
            />

            <TextInput
              label="Tutar"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />

            <Button mode="contained" onPress={handleTransfer} style={styles.button}>
              Gönder
            </Button>

            {result ? <Text style={styles.success}>{result}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  content: {
    marginTop: Platform.OS === 'ios' ? screenHeight * 0.28 : screenHeight * 0.24,
    paddingHorizontal: 20,
  },
  pageTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 24,
  },
  card: { borderRadius: 12, padding: 10 },
  label: { marginBottom: 8, fontWeight: 'bold' },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { marginBottom: 16 },
  button: { marginTop: 8 },
  success: { marginTop: 20, color: 'green', fontWeight: 'bold' },
  error: { marginTop: 20, color: 'red', fontWeight: 'bold' },
});
