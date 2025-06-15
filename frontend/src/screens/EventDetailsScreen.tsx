import type { RootStackParamList } from '@/navigation/types';
import {
  useGetEventByIdQuery,
  useRsvpEventMutation,
  useCancelRsvpMutation,
  useUpdateRsvpMutation,
  useGetEventsQuery,
} from '@/services/eventsApi';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { markRsvp } from '@/features/events/eventsSlice';
import {
  cancelReminderNotification,
  displayNotification,
  scheduleReminderNotification,
} from '@/utils/notifications.ts';

type Route = RouteProp<RootStackParamList, 'EventDetails'>;

const EventDetailsScreen = () => {
  const { params } = useRoute<Route>();
  const { data: event, isLoading } = useGetEventByIdQuery(params.id);
  const [rsvpEvent] = useRsvpEventMutation();
  const [cancelRsvp] = useCancelRsvpMutation();
  const [updateRsvp] = useUpdateRsvpMutation();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [guestCount, setGuestCount] = useState(1);
  const dispatch = useAppDispatch();

  if (isLoading || !event) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  const handleRsvp = () => {
    rsvpEvent({ id: event.id, guestCount })
      .unwrap()
      .then(() => {
        dispatch(markRsvp({ id: event.id, hasUserRsvped: true, guestCount }));
        displayNotification(
          'RSVP Confirmed',
          `You're going to ${event.title}!`,
        );
        scheduleReminderNotification(event.title, event.date);
      })
      .catch(() => {
        showErrorToast('Failed to RSVP.');
      });
  };

  const handleCancel = () => {
    cancelRsvp({ id: event.id })
      .unwrap()
      .then(() => {
        dispatch(
          markRsvp({ id: event.id, hasUserRsvped: false, guestCount: 0 }),
        );
        showSuccessToast('RSVP cancelled.');
        cancelReminderNotification(event.id);
        setGuestCount(1);
      })
      .catch(() => {
        showErrorToast('Failed to cancel RSVP.');
      });
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="clear" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>{event.title}</Text>
      <Text>{new Date(event.date).toLocaleString()}</Text>
      <Text>{event.location}</Text>
      <Text style={styles.subtitle}>Total RSVPs: {event.rsvpCount}</Text>
      <Text style={styles.subtitle}>Guests for you: {event.guestCount}</Text>

      <View style={styles.counterRow}>
        <TouchableOpacity
          onPress={() => setGuestCount(Math.max(1, guestCount - 1))}
          style={styles.counterButton}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>{guestCount}</Text>
        <TouchableOpacity
          onPress={() => setGuestCount(guestCount + 1)}
          style={styles.counterButton}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>

      {event.hasUserRsvped ? (
        <>
          <CustomButton
            text="Update RSVP"
            onPress={() =>
              updateRsvp({ id: event.id, guestCount })
                .unwrap()
                .then(() => {
                  dispatch(
                    markRsvp({ id: event.id, hasUserRsvped: true, guestCount }),
                  );

                  showSuccessToast('RSVP updated!');
                })
                .catch(error => {
                  console.log('error', error);
                  showErrorToast('Failed to update RSVP.');
                })
            }
            containerStyle={styles.button}
          />
          <CustomButton
            text="Cancel RSVP"
            onPress={handleCancel}
            containerStyle={styles.button}
          />
        </>
      ) : (
        <CustomButton
          text="RSVP"
          onPress={handleRsvp}
          containerStyle={styles.button}
        />
      )}
    </SafeAreaView>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  backButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  counterButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 10,
    borderRadius: 4,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
