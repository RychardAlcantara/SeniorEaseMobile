import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Modal, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../theme/ThemeProvider'
import { useAuthStore } from '../../store/authStore'
import { Ionicons } from '@expo/vector-icons'

interface Props {
  title?: string
  subtitle?: string
  rightAction?: React.ReactNode
  children?: React.ReactNode
  onEditUser?: () => void
  onLogout?: () => void
}

export function PageHeader({ title, subtitle, rightAction, children, onEditUser, onLogout }: Props) {
  const { colors, fontSize, letterSpacing, isHighContrast } = useTheme()
  const [menuVisible, setMenuVisible] = useState(false)
  const user = useAuthStore((s) => s.user)

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

          {/* Botão de menu do usuário */}
          <TouchableOpacity
            style={[styles.userMenuButton, { backgroundColor: isHighContrast ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}
            onPress={() => setMenuVisible(true)}
            accessibilityLabel="Menu do usuário"
          >
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.userAvatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={36} color={colors.textOnPrimary} />
            )}
          </TouchableOpacity>
        </View>

        {title && <Text style={[styles.headerTitle, { color: colors.textOnPrimary, fontSize: fontSize.title + 2, letterSpacing }]}>{title}</Text>}
        {subtitle && <Text style={[styles.headerSub, { color: colors.textOnPrimary, fontSize: fontSize.body, letterSpacing, opacity: 0.8 }]}>{subtitle}</Text>}
        {children}
      </View>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuContainer, { backgroundColor: colors.surface ?? '#fff' }]}>

            {/* Info do usuário */}
            {(user?.name || user?.email) && (
              <>
                <View style={styles.userInfo}>
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.menuAvatar} />
                  ) : (
                    <View style={[styles.menuAvatarPlaceholder, { backgroundColor: colors.primary }]}>
                      <Text style={{ color: colors.textOnPrimary, fontWeight: '700', fontSize: 16 }}>
                        {user.name?.charAt(0).toUpperCase() ?? '?'}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    {user?.name && (
                      <Text style={[styles.userName, { color: colors.text ?? '#222', fontSize: fontSize.body }]} numberOfLines={1}>
                        {user.name}
                      </Text>
                    )}
                    {user?.email && (
                      <Text style={[styles.userEmail, { color: colors.textMuted ?? '#888', fontSize: fontSize.caption }]} numberOfLines={1}>
                        {user.email}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={[styles.menuDivider, { backgroundColor: colors.border ?? '#eee' }]} />
              </>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false)
                onEditUser?.()
              }}
            >
              <Ionicons name="person-outline" size={20} color={colors.text ?? '#222'} />
              <Text style={[styles.menuItemText, { color: colors.text ?? '#222', fontSize: fontSize.body }]}>
                Editar usuário
              </Text>
            </TouchableOpacity>

            <View style={[styles.menuDivider, { backgroundColor: colors.border ?? '#eee' }]} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false)
                onLogout?.()
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#e53935" />
              <Text style={[styles.menuItemText, { color: '#e53935', fontSize: fontSize.body }]}>
                Sair
              </Text>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>
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
  headerSub: {},

  // Avatar no botão
  userMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    overflow: 'hidden',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userMenuIcon: {
    fontSize: 18,
  },

  // Modal / Dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 90,
    paddingRight: 16,
  },
  menuContainer: {
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 220,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  // Info do usuário no topo do menu
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontWeight: '700',
  },
  userEmail: {},

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemIcon: {
    fontSize: 18,
  },
  menuItemText: {
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 12,
  },
})