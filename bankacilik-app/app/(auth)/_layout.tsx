/* V3 BAŞLIKSIZ BOŞLUKLU
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={styles.wrapper}>
      <Stack
        screenOptions={{
          headerShown: false, // başlığı gizle
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50, 
    flex: 1,
    backgroundColor: '#f4f4f4', // isteğe bağlı, uygulama arka planı
  },
});
*/



/* V1 BAŞLIKLI
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return <Stack />;
}
*/



// V2 BAŞLIKSIZ BOŞLUKSUZ
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    />
  );
}
