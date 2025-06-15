import { useAppSelector } from '@/app/hooks';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationsScreen = () => {
  const notifications = useAppSelector(state => state.notifications);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;
