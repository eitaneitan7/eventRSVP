import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  appendEvents,
  setEvents,
  setHasMore,
  setPage,
} from '@/features/events/eventsSlice';
import type { RootStackParamList } from '@/navigation/types';
import { useGetEventsQuery } from '@/services/eventsApi';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import EventCard from '../components/EventCard';
import notifee from '@notifee/react-native';
import {
  createDefaultChannel,
  displayNotification,
  requestNotificationPermission,
} from '@/utils/notifications.ts';

const PAGE_SIZE = 10;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(state => state.events.page);
  const events = useAppSelector(state => state.events.allEvents);
  const hasMore = useAppSelector(state => state.events.hasMore);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data: paginatedData,
    isLoading,
    isFetching,
    isUninitialized,
    isError,
    refetch,
  } = useGetEventsQuery({ page, limit: PAGE_SIZE });

  useEffect(() => {
    if (paginatedData?.data) {
      if (page === 1) {
        dispatch(setEvents(paginatedData.data));
      } else {
        dispatch(appendEvents(paginatedData.data));
      }

      if (paginatedData.page >= paginatedData.totalPages) {
        dispatch(setHasMore(false));
      }
    }
  }, [paginatedData]);

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      dispatch(setPage(page + 1));
    }
  };

  const handleRefresh = () => {
    dispatch(setPage(1));
    dispatch(setHasMore(true));
    refetch();
  };

  useEffect(() => {
    createDefaultChannel();
    requestNotificationPermission();
  }, []);

  if (isLoading && page === 1) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <View style={styles.iconWrapper}>
          <MaterialIcons name="error" size={65} color="#FF3B30" />
        </View>
        <Text style={styles.errorText}>Failed to load events</Text>
        <CustomButton
          onPress={handleRefresh}
          text="Try Again"
          containerStyle={styles.retryButton}
        />
      </View>
    );
  }

  if (!isUninitialized && !isLoading && !paginatedData?.data.length) {
    return (
      <View style={styles.centered}>
        <View style={styles.iconWrapper}>
          <MaterialIcons name="event-busy" size={42} color="#8E8E93" />
        </View>
        <Text style={styles.emptyText}>No events available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => {
          return (
            <EventCard
              event={item}
              index={index}
              animate={page === 1}
              isRsvped={item.hasUserRsvped}
              onPress={() =>
                navigation.navigate('EventDetails', { id: item.id })
              }
            />
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 1}
            onRefresh={handleRefresh}
          />
        }
        ListFooterComponent={
          isFetching && page > 1 ? (
            <ActivityIndicator
              size="small"
              color="#007AFF"
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconWrapper: {
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default HomeScreen;
