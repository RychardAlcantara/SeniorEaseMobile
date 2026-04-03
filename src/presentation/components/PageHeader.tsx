import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../theme/ThemeProvider'

interface Props {
  title?: string
  subtitle?: string
  rightAction?: React.ReactNode
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, rightAction, children }: Props) {
  const { colors, fontSize, letterSpacing, isHighContrast } = useTheme()

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.logoRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={[styles.logoCircle, { backgroundColor: isHighContrast ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>
              <Text style={[styles.logoText, { color: colors.textOnPrimary, letterSpacing }]}>SE</Text>
            </View>
            <Text style={[styles.appName, { color: colors.textOnPrimary, fontSize: fontSize.title, letterSpacing }]}>SeniorEase</Text>
          </View>
          {rightAction}
        </View>
        {title && <Text style={[styles.headerTitle, { color: colors.textOnPrimary, fontSize: fontSize.title + 2, letterSpacing }]}>{title}</Text>}
        {subtitle && <Text style={[styles.headerSub, { color: colors.textOnPrimary, fontSize: fontSize.body, letterSpacing, opacity: 0.8 }]}>{subtitle}</Text>}
        {children}
      </View>
    </>
  )
}

export function ScreenShell({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }} edges={['top']}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
  },
  appName: {
    fontWeight: '800',
    fontStyle: 'italic',
  },
  headerTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSub: {
  },
})
