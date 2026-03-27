import React, { useState } from 'react'
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native'
import { useAuthStore } from '../../src/store/authStore'

export default function LoginScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const { signIn, isLoading, error } = useAuthStore()

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Logo / Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>SE</Text>
          </View>
          <Text style={styles.appName}>SeniorEase</Text>
          <Text style={styles.subtitle}>Tecnologia com simplicidade e cuidado</Text>
        </View>

        {/* Card do formulário */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar na sua conta</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor="#BDBDBD"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessible
            accessibilityLabel="Campo de e-mail"
            style={styles.input}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            accessible
            accessibilityLabel="Campo de senha"
            style={styles.input}
          />

          {/* Esqueci a senha */}
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel="Esqueci minha senha"
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity
            onPress={() => signIn(email, password)}
            disabled={isLoading}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Entrar"
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          >
            {isLoading
              ? <ActivityIndicator color="#FFF" size="large" />
              : <Text style={styles.loginButtonText}>Entrar</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Cadastro */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Ainda não tem conta? </Text>
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel="Cadastre-se"
          >
            <Text style={styles.registerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    padding: 24,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1565C0',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#757575',
    marginTop: 6,
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 24,
  },

  // Error
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#C62828',
  },
  errorText: {
    color: '#C62828',
    fontSize: 15,
    fontWeight: '500',
  },

  // Inputs
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#212121',
    backgroundColor: '#FAFAFA',
    minHeight: 56,
    marginBottom: 16,
  },

  // Esqueci a senha
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 15,
    color: '#1565C0',
    fontWeight: '600',
  },

  // Botão entrar
  loginButton: {
    backgroundColor: '#1565C0',
    borderRadius: 14,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#90CAF9',
    elevation: 0,
    shadowOpacity: 0,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },

  // Cadastro
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#757575',
  },
  registerLink: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1565C0',
  },
})