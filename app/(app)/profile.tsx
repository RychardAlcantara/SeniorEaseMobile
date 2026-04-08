import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'

export default function ProfileScreen() {
  const { colors, fontSize, letterSpacing } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary, fontSize: fontSize.title, letterSpacing }]}>Perfil</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title:     { fontWeight: '700' },
})