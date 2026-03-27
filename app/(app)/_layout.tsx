import { Tabs } from 'expo-router'

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard"   options={{ title: 'Início' }} />
      <Tabs.Screen name="activities"  options={{ title: 'Tarefas' }} />
      <Tabs.Screen name="profile"     options={{ title: 'Perfil' }} />
    </Tabs>
  )
}