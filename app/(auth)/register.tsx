import React, { useState } from 'react'
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../src/store/authStore'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'

export default function RegisterScreen() {
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [localError, setLocalError]   = useState<string | null>(null)

  const { signUp, isLoading, error, clearError } = useAuthStore()
  const { colors, fontSize, letterSpacing, minTouch, isHighContrast } = useTheme()
  const router = useRouter()

  const handleRegister = async () => {
    clearError()
    setLocalError(null)

    if (!name.trim())  return setLocalError('Nome é obrigatório.')
    if (!email.trim()) return setLocalError('E-mail é obrigatório.')
    if (password.length < 6) return setLocalError('A senha deve ter no mínimo 6 caracteres.')
    if (password !== confirmPass) return setLocalError('As senhas não coincidem.')

    await signUp(email, password, name)
  }

  const displayError = localError || error

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

        {/* Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSize.label + 4, letterSpacing }]}>Criar conta</Text>

          {displayError && (
            <View style={[styles.errorBox, { borderLeftColor: colors.error }]}>
              <Text style={[styles.errorText, { color: colors.error, fontSize: fontSize.caption, letterSpacing }]}>
                <Ionicons name="alert-circle" size={fontSize.caption} color={colors.error} /> {displayError}
              </Text>
            </View>
          )}

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>Nome completo</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome completo"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            accessible
            accessibilityLabel="Campo de nome completo"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

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
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            accessible
            accessibilityLabel="Campo de senha"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>Confirmar senha</Text>
          <TextInput
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholder="Repita a senha"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            accessible
            accessibilityLabel="Campo de confirmação de senha"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Criar conta"
            style={[styles.button, { backgroundColor: colors.primary, minHeight: minTouch }, isLoading && { backgroundColor: colors.border }]}
          >
            {isLoading
              ? <ActivityIndicator color={colors.textOnPrimary} size="large" />
              : <Text style={[styles.buttonText, { fontSize: fontSize.body, color: colors.textOnPrimary, letterSpacing }]}>Criar conta</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Voltar ao login */}
        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: colors.textMuted, fontSize: fontSize.body, letterSpacing }]}>Já tem conta? </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Entrar"
          >
            <Text style={[styles.loginLink, { color: colors.primary, fontSize: fontSize.body, letterSpacing }]}>Entrar</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  logoText: { fontSize: 28, fontWeight: '800' },
  appName: { fontWeight: '800', fontStyle: 'italic', letterSpacing: 0.5 },
  subtitle: { marginTop: 6, textAlign: 'center' },
  card: {
    borderRadius: 20, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, marginBottom: 24,
  },
  cardTitle: { fontWeight: '700', marginBottom: 24 },
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 10, padding: 14, marginBottom: 16, borderLeftWidth: 4 },
  errorText: { fontWeight: '500' },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 2, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  button: {
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  buttonText: { fontWeight: '700', paddingVertical: 16 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: {},
  loginLink: { fontWeight: '700' },
})