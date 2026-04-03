import React, { useState } from 'react'
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native'
import { useAuthStore } from '../../src/store/authStore'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'

export default function LoginScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const { signIn, isLoading, error } = useAuthStore()
  const { colors, fontSize, letterSpacing, minTouch, isHighContrast } = useTheme()

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >

        {/* Logo / Header */}
        <View style={styles.header}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.textOnPrimary, letterSpacing }]}>SE</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary, fontSize: fontSize.title, letterSpacing }]}>SeniorEase</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted, fontSize: fontSize.caption, letterSpacing }]}>Tecnologia com simplicidade e cuidado</Text>
        </View>

        {/* Card do formulário */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSize.label + 4, letterSpacing }]}>Entrar na sua conta</Text>

          {error && (
            <View style={[styles.errorBox, { borderLeftColor: colors.error }]}>
              <Text style={[styles.errorText, { color: colors.error, fontSize: fontSize.caption, letterSpacing }]}><Ionicons name="alert-circle" size={fontSize.caption} color={colors.error} /> {error}</Text>
            </View>
          )}

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessible
            accessibilityLabel="Campo de e-mail"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            accessible
            accessibilityLabel="Campo de senha"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          {/* Esqueci a senha */}
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel="Esqueci minha senha"
            style={styles.forgotButton}
          >
            <Text style={[styles.forgotText, { color: colors.primary, fontSize: fontSize.caption, letterSpacing }]}>Esqueci minha senha</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity
            onPress={() => signIn(email, password)}
            disabled={isLoading}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Entrar"
            style={[styles.loginButton, { backgroundColor: colors.primary, minHeight: minTouch }, isLoading && { backgroundColor: colors.border }]}
          >
            {isLoading
              ? <ActivityIndicator color={colors.textOnPrimary} size="large" />
              : <Text style={[styles.loginButtonText, { fontSize: fontSize.body, color: colors.textOnPrimary, letterSpacing }]}>Entrar</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Cadastro */}
        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.textMuted, fontSize: fontSize.body, letterSpacing }]}>Ainda não tem conta? </Text>
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityLabel="Cadastre-se"
          >
            <Text style={[styles.registerLink, { color: colors.primary, fontSize: fontSize.body, letterSpacing }]}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
  },
  appName: {
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
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
    fontWeight: '700',
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  errorText: {
    fontWeight: '500',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotText: {
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    fontWeight: '700',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {},
  registerLink: {
    fontWeight: '700',
  },
})