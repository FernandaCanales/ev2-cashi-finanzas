import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#410455',
        tabBarInactiveTintColor: '#999',
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Transacciones',
          tabBarLabel: 'Transacciones',
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: 'Balance',
          tabBarLabel: 'Balance',
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorías',
          tabBarLabel: 'Categorías',
        }}
      />
    </Tabs>
  )
}