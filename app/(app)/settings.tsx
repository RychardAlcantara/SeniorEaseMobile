import React, { useCallback } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native'
import { useAuthStore } from '../../src/store/authStore'
import { usePreferencesStore } from '../../src/store/preferencesStore'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'
import { PageHeader, ScreenShell } from '../../src/presentation/components/PageHeader'
import { Preferences } from '../../src/domain/entities/Preferences'
import { useRouter } from 'expo-router'

type FontSize = Preferences['fontSize']
type Contrast = Preferences['contrastLevel']
type Spacing = Preferences['spacing']
type NavMode = Preferences['navMode']

export default function SettingsScreen() {
  const router = useRouter()
  const { signOut } = useAuthStore()
  const { user } = useAuthStore()
  const { preferences, update, preview } = usePreferencesStore()
  const { colors, fontSize, spacing, letterSpacing, isHighContrast } = useTheme()

  const apply = useCallback((prefs: Partial<Preferences>) => {
    preview(prefs)
    if (user) update(user.id, prefs)
  }, [user, preview, update])

  const setFontSize = useCallback((v: FontSize) => apply({ fontSize: v }), [apply])
  const setContrast = useCallback((v: Contrast) => apply({ contrastLevel: v }), [apply])
  const setSpacing = useCallback((v: Spacing) => apply({ spacing: v }), [apply])
  const setNavMode = useCallback((v: NavMode) => apply({ navMode: v }), [apply])

  const fontOptions: { label: string; value: FontSize; display: string; size: number }[] = [
    { label: 'A-', value: 'small', display: 'Menor', size: 14 },
    { label: 'A',  value: 'medium', display: 'Normal', size: 17 },
    { label: 'A+', value: 'large', display: 'Maior', size: 21 },
  ]

  const contrastOptions: { label: string; value: Contrast }[] = [
    { label: 'Normal', value: 'normal' },
    { label: 'Alto contraste', value: 'high' },
  ]

  const spacingOptions: { label: string; value: Spacing }[] = [
    { label: 'Normal', value: 'normal' },
    { label: 'Ampliado', value: 'relaxed' },
  ]

  const navOptions: { label: string; value: NavMode }[] = [
    { label: 'Simplificada', value: 'basic' },
    { label: 'Avançada', value: 'advanced' },
  ]

  return (
    <ScreenShell>
      <PageHeader title="Configurações" subtitle="Personalize sua experiência" 
      onEditUser={() => router.push('/(app)/profile')}
      onLogout={async () => { await signOut(); router.replace('/(auth)/login') }}/>

      <ScrollView
        style={[styles.body, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Tamanho da fonte */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
            Tamanho da fonte
          </Text>
          <View style={styles.fontRow}>
            {fontOptions.map((opt) => {
              const selected = preferences.fontSize === opt.value
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setFontSize(opt.value)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Tamanho ${opt.display}`}
                  accessibilityState={{ selected }}
                  style={[
                    styles.fontBtn,
                    {
                      backgroundColor: selected ? colors.primary : colors.background,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={{ fontSize: opt.size, fontWeight: '700', color: selected ? colors.textOnPrimary : colors.text, letterSpacing }}>
                    {opt.label}
                  </Text>
                  <Text style={{ fontSize: fontSize.caption - 2, color: selected ? colors.textOnPrimary : colors.textMuted, marginTop: 2, opacity: selected ? 0.7 : 1, letterSpacing }}>
                    {opt.display}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Contraste */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
            Contraste
          </Text>
          {contrastOptions.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              selected={preferences.contrastLevel === opt.value}
              onPress={() => setContrast(opt.value)}
              primaryColor={colors.primary}
              textColor={colors.text}
              borderColor={colors.border}
              bodySize={fontSize.body}
              letterSpacing={letterSpacing}
            />
          ))}
        </View>

        {/* Espaçamento */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
            Espaçamento entre letras
          </Text>
          {spacingOptions.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              selected={preferences.spacing === opt.value}
              onPress={() => setSpacing(opt.value)}
              primaryColor={colors.primary}
              textColor={colors.text}
              borderColor={colors.border}
              bodySize={fontSize.body}
              letterSpacing={letterSpacing}
            />
          ))}
        </View>

        {/* Modo de visualização */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.cardTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
            Modo de visualização
          </Text>
          {navOptions.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              selected={preferences.navMode === opt.value}
              onPress={() => setNavMode(opt.value)}
              primaryColor={colors.primary}
              textColor={colors.text}
              borderColor={colors.border}
              bodySize={fontSize.body}
              letterSpacing={letterSpacing}
            />
          ))}
        </View>

      </ScrollView>
    </ScreenShell>
  )
}

function RadioRow({ label, selected, onPress, primaryColor, textColor, borderColor, bodySize, letterSpacing }: {
  label: string; selected: boolean; onPress: () => void
  primaryColor: string; textColor: string; borderColor: string; bodySize: number; letterSpacing: number
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.radioRow}
      accessible
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={[styles.radioCircle, { borderColor: selected ? primaryColor : borderColor }]}>
        {selected && <View style={[styles.radioFill, { backgroundColor: primaryColor }]} />}
      </View>
      <Text style={{ fontSize: bodySize, color: textColor, marginLeft: 12, letterSpacing }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  fontRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fontBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 14,
    minHeight: 60,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  modeCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 10,
  },
})
