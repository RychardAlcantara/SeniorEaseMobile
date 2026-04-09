import React, { useState } from 'react'
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ActivityIndicator, ScrollView, Image, Alert, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../src/store/authStore'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'
import { ScreenShell, PageHeader } from '../../src/presentation/components/PageHeader'

export default function ProfileScreen() {
  const { user, updateProfile, updatePassword, isLoading, error, clearError } = useAuthStore()
  const { colors, fontSize, letterSpacing, minTouch, isHighContrast } = useTheme()
  const router = useRouter()

  // Perfil
  const [name, setName]         = useState(user?.name ?? '')
  const [photo, setPhoto]       = useState<string | null>(user?.photoURL ?? null)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)

  // Senha
  const [currentPass, setCurrentPass]   = useState('')
  const [newPass, setNewPass]           = useState('')
  const [confirmPass, setConfirmPass]   = useState('')
  const [passwordMsg, setPasswordMsg]   = useState<string | null>(null)
  const [localError, setLocalError]     = useState<string | null>(null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para escolher uma foto.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })
    if (!result.canceled) {
      setPhoto(result.assets[0].uri)
    }
  }

  const handleUpdateProfile = async () => {
    clearError()
    setLocalError(null)
    setProfileMsg(null)
    if (!name.trim()) { setLocalError('Nome é obrigatório.'); return }
    const ok = await updateProfile(name, photo)
    if (ok) setProfileMsg('Perfil atualizado com sucesso!')
  }

  const handleUpdatePassword = async () => {
    clearError()
    setLocalError(null)
    setPasswordMsg(null)
    if (!currentPass)          { setLocalError('Informe a senha atual.'); return }
    if (newPass.length < 6)    { setLocalError('A nova senha deve ter no mínimo 6 caracteres.'); return }
    if (newPass !== confirmPass){ setLocalError('As senhas não coincidem.'); return }
    const ok = await updatePassword(currentPass, newPass, confirmPass)
    if (ok) {
      setPasswordMsg('Senha alterada com sucesso!')
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
    }
  }

  const displayError = localError || error

  return (
    <ScreenShell>
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações"
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Foto de perfil */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={pickImage} style={styles.photoWrapper} accessible accessibilityLabel="Alterar foto de perfil">
            {photo
              ? <Image source={{ uri: photo }} style={styles.photo} />
              : (
                <View style={[styles.photoPlaceholder, { backgroundColor: colors.primary }]}>
                  <Ionicons name="person" size={48} color={colors.textOnPrimary} />
                </View>
              )
            }
            <View style={[styles.photoEditBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={16} color={colors.textOnPrimary} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.photoHint, { color: colors.textMuted, fontSize: fontSize.caption, letterSpacing }]}>Toque para alterar a foto</Text>
        </View>

        {/* Erros e mensagens globais */}
        {displayError && (
          <View style={[styles.errorBox, { borderLeftColor: colors.error }]}>
            <Text style={[styles.errorText, { color: colors.error, fontSize: fontSize.caption }]}>
              <Ionicons name="alert-circle" size={fontSize.caption} color={colors.error} /> {displayError}
            </Text>
          </View>
        )}

        {/* Card — Dados pessoais */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSize.label + 2, letterSpacing }]}>Dados pessoais</Text>

          {profileMsg && (
            <View style={[styles.successBox, { borderLeftColor: '#4CAF50' }]}>
              <Text style={[styles.successText, { fontSize: fontSize.caption }]}>✓ {profileMsg}</Text>
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
            accessibilityLabel="Campo de nome"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>E-mail</Text>
          <View style={[styles.input, styles.inputDisabled, { borderColor: colors.border, backgroundColor: colors.background, minHeight: minTouch }]}>
            <Text style={[{ color: colors.textMuted, fontSize: fontSize.body, letterSpacing }]}>{user?.email}</Text>
          </View>
          <Text style={[styles.hint, { color: colors.textMuted, fontSize: fontSize.caption, letterSpacing }]}>O e-mail não pode ser alterado.</Text>

          <TouchableOpacity
            onPress={handleUpdateProfile}
            disabled={isLoading}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Salvar perfil"
            style={[styles.button, { backgroundColor: colors.primary, minHeight: minTouch }, isLoading && { backgroundColor: colors.border }]}
          >
            {isLoading
              ? <ActivityIndicator color={colors.textOnPrimary} />
              : <Text style={[styles.buttonText, { color: colors.textOnPrimary, fontSize: fontSize.body, letterSpacing }]}>Salvar alterações</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Card — Alterar senha */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: fontSize.label + 2, letterSpacing }]}>Alterar senha</Text>

          {passwordMsg && (
            <View style={[styles.successBox, { borderLeftColor: '#4CAF50' }]}>
              <Text style={[styles.successText, { fontSize: fontSize.caption }]}>✓ {passwordMsg}</Text>
            </View>
          )}

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>Senha atual</Text>
          <TextInput
            value={currentPass}
            onChangeText={setCurrentPass}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            accessible
            accessibilityLabel="Campo de senha atual"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>Nova senha</Text>
          <TextInput
            value={newPass}
            onChangeText={setNewPass}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            accessible
            accessibilityLabel="Campo de nova senha"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          <Text style={[styles.label, { color: colors.text, fontSize: fontSize.label, letterSpacing }]}>Confirmar nova senha</Text>
          <TextInput
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholder="Repita a nova senha"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            accessible
            accessibilityLabel="Campo de confirmação de nova senha"
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
          />

          <TouchableOpacity
            onPress={handleUpdatePassword}
            disabled={isLoading}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Alterar senha"
            style={[styles.button, { backgroundColor: colors.primary, minHeight: minTouch }, isLoading && { backgroundColor: colors.border }]}
          >
            {isLoading
              ? <ActivityIndicator color={colors.textOnPrimary} />
              : <Text style={[styles.buttonText, { color: colors.textOnPrimary, fontSize: fontSize.body, letterSpacing }]}>Alterar senha</Text>
            }
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenShell>
  )
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  photoSection: { alignItems: 'center', marginBottom: 24 },
  photoWrapper: { position: 'relative', marginBottom: 8 },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },
  photoEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  photoHint: { marginTop: 4 },
  errorBox: { backgroundColor: '#FFEBEE', borderRadius: 10, padding: 14, marginBottom: 16, borderLeftWidth: 4 },
  errorText: { fontWeight: '500' },
  successBox: { backgroundColor: '#E8F5E9', borderRadius: 10, padding: 14, marginBottom: 16, borderLeftWidth: 4 },
  successText: { color: '#2E7D32', fontWeight: '500' },
  card: {
    borderRadius: 20, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cardTitle: { fontWeight: '700', marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 2, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  inputDisabled: { justifyContent: 'center', opacity: 0.7 },
  hint: { marginTop: -10, marginBottom: 16 },
  button: {
    borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingVertical: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  buttonText: { fontWeight: '700' },
})