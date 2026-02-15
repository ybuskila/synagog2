import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

export function AdminLogin() {
  const { login: onLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('שגיאה', 'נא למלא דוא"ל וסיסמה');
      return;
    }
    setLoading(true);
    const token = await login(email.trim(), password);
    setLoading(false);
    if (token) {
      await onLogin(token);
    } else {
      Alert.alert('שגיאה', 'כניסה נכשלה. בדוק פרטים ונסה שוב.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>כניסת גבאי</Text>
      <Text style={styles.subtitle}>התחבר כדי לערוך זמני תפילות</Text>

      <TextInput
        style={styles.input}
        placeholder="דוא״ל"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>התחבר</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: { fontSize: 24, fontWeight: '700', color: '#1a5f2a', textAlign: 'right' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'right', marginTop: 8, marginBottom: 32 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'right',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#1a5f2a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
