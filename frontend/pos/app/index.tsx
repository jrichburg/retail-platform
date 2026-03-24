import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Retail Platform POS</Text>
      <Text style={{ marginTop: 8, color: '#666' }}>Phase 1 — Foundation</Text>
    </View>
  );
}
