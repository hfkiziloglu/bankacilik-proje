import { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../config';

const screenHeight = Dimensions.get('window').height;

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/register`, {
        full_name: fullName,
        email,
        password,
        // iban gönderilmiyor, backend üretiyor
      });
      setSuccess('Kayıt başarılı! Giriş yapabilirsiniz.');
      setError('');
    } catch (err) {
      setError('Kayıt başarısız. Bu e-posta zaten kayıtlı olabilir.');
      setSuccess('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>📝 Kayıt Ol</Text>

        <TextInput
          label="Ad Soyad"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Kayıt Ol
        </Button>

        <Button mode="text" onPress={() => router.push('/login')} style={styles.link}>
          Zaten hesabınız var mı? Giriş yap
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
    marginTop: Platform.OS === 'ios' ? screenHeight * 0.30 : screenHeight * 0.28,
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 24,
  },
  input: { marginBottom: 16 },
  button: { marginTop: 10 },
  link: { marginTop: 10 },
  success: { marginTop: 16, color: 'green', fontWeight: 'bold' },
  error: { marginTop: 16, color: 'red', fontWeight: 'bold' },
});
