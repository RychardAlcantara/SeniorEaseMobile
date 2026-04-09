import React, { useState } from 'react'
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../src/store/authStore'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'

export default function ForgotPasswordScreen() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const { forgotPassword, isLoading, error, clearError } = useAuthStore()
  const { colors, fontSize, letterSpacing, minTouch, isHighContrast } = useTheme()
  const router = useRouter()

  const handleSend = async () => {
    clearError()
    setLocalError(null)
    if (!email.trim()) { setLocalError('Informe seu e-mail.'); return }
    const ok = await forgotPassword(email.trim())
    if (ok) setSent(true)
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

          {/* Ícone de cadeado */}
          <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="lock-closed-outline" size={36} color={colors.primary} />
          </View>

          <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSize.label + 4, letterSpacing }]}>
            Esqueci minha senha
          </Text>

          {!sent ? (
            <>
              <Text style={[styles.description, { color: colors.textMuted, fontSize: fontSize.body, letterSpacing }]}>
                Digite seu e-mail cadastrado e enviaremos um link para você redefinir sua senha.
              </Text>

              {displayError && (
                <View style={[styles.errorBox, { borderLeftColor: colors.error }]}>
                  <Text style={[styles.errorText, { color: colors.error, fontSize: fontSize.caption }]}>
                    <Ionicons name="alert-circle" size={fontSize.caption} color={colors.error} /> {displayError}
                  </Text>
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

              <TouchableOpacity
                onPress={handleSend}
                disabled={isLoading}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Enviar link de recuperação"
                style={[styles.button, { backgroundColor: colors.primary, minHeight: minTouch }, isLoading && { backgroundColor: colors.border }]}
              >
                {isLoading
                  ? <ActivityIndicator color={colors.textOnPrimary} size="large" />
                  : <Text style={[styles.buttonText, { fontSize: fontSize.body, color: colors.textOnPrimary, letterSpacing }]}>Enviar link</Text>
                }
              </TouchableOpacity>
            </>
          ) : (
            /* Estado de sucesso */
            <View style={styles.successContent}>
              <View style={[styles.successIconWrapper, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#4CAF50" />
              </View>
              <Text style={[styles.successTitle, { color: colors.text, fontSize: fontSize.label + 2, letterSpacing }]}>
                E-mail enviado!
              </Text>
              <Text style={[styles.successDescription, { color: colors.textMuted, fontSize: fontSize.body, letterSpacing }]}>
                Verifique sua caixa de entrada em{' '}
                <Text style={{ fontWeight: '700', color: colors.text }}>{email}</Text>
                {' '}e siga as instruções para redefinir sua senha.
              </Text>
              <Text style={[styles.successHint, { color: colors.textMuted, fontSize: fontSize.caption, letterSpacing }]}>
                Não recebeu? Verifique sua pasta de spam ou tente novamente.
              </Text>

              <TouchableOpacity
                onPress={() => { setSent(false); setEmail('') }}
                accessible
                accessibilityRole="button"
                style={[styles.retryButton, { borderColor: colors.primary }]}
              >
                <Text style={[styles.retryButtonText, { color: colors.primary, fontSize: fontSize.body, letterSpacing }]}>
                  Tentar com outro e-mail
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Voltar ao login */}
        <TouchableOpacity
          onPress={() => router.back()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Voltar ao login"
          style={styles.backRow}
        >
          <Ionicons name="arrow-back-outline" size={18} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary, fontSize: fontSize.body, letterSpacing }]}>
            Voltar ao login
          </Text>
        </TouchableOpacity>

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
    alignItems: 'center',
  },
  iconWrapper: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: { fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  description: { textAlign: 'center', marginBottom: 24, lineHeight: 22, alignSelf: 'stretch' },
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 10, padding: 14, marginBottom: 16, borderLeftWidth: 4, alignSelf: 'stretch' },
  errorText: { fontWeight: '500' },
  label: { fontWeight: '600', marginBottom: 8, alignSelf: 'flex-start' },
  input: { borderWidth: 2, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, alignSelf: 'stretch' },
  button: {
    borderRadius: 14, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  buttonText: { fontWeight: '700', paddingVertical: 16 },

  // Sucesso
  successContent: { alignItems: 'center', width: '100%' },
  successIconWrapper: {
    width: 88, height: 88, borderRadius: 44,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  successTitle: { fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  successDescription: { textAlign: 'center', lineHeight: 22, marginBottom: 12 },
  successHint: { textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  retryButton: {
    borderWidth: 2, borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 24, alignItems: 'center', alignSelf: 'stretch',
  },
  retryButtonText: { fontWeight: '600' },

  // Voltar
  backRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  backText: { fontWeight: '600' },
})