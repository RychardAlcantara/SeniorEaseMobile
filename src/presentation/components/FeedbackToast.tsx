import React, { useEffect } from 'react'
import { Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay,
} from 'react-native-reanimated'

interface Props {
  message: string
  visible: boolean
  onHide: () => void
}

export function FeedbackToast({ message, visible, onHide }: Props) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 })
      opacity.value = withDelay(2500, withTiming(0, { duration: 300 }))
      setTimeout(onHide, 3000)
    }
  }, [visible])

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  if (!visible) return null

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.text}>✓ {message}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
  },
  text: { color: '#FFF', fontSize: 18, fontWeight: '600' },
})