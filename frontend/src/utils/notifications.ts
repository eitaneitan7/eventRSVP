import { store } from '@/app/store';
import { addNotification } from '@/features/events/notificationSlice';
import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export async function requestNotificationPermission() {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

export async function displayNotification(title: string, body: string) {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'default',
      pressAction: {
        id: 'default',
      },
    },
  });
  store.dispatch(
    addNotification({
      id: Date.now().toString(),
      title,
      body,
      timestamp: Date.now(),
    }),
  );
}

export async function createDefaultChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

export async function scheduleReminderNotification(
  eventTitle: string,
  eventDate: string,
) {
  const eventTime = new Date(eventDate).getTime();
  const notifyAt = eventTime - 60 * 60 * 1000;

  if (notifyAt < Date.now()) {
    console.log('Notification time is in the past, skipping scheduling');
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: notifyAt,
    alarmManager: true,
  };
  await notifee.createTriggerNotification(
    {
      id: `event-${eventTitle}`, // 👈 unique ID per event
      title: 'Upcoming Event',
      body: `You have to attend ${eventTitle} in 1 hour!`,
      android: {
        channelId: 'default',
        pressAction: { id: 'default' },
      },
    },
    trigger,
  );
  console.log(
    `Notification scheduled for ${new Date(notifyAt).toLocaleString()}`,
  );
}

export async function cancelReminderNotification(eventId: string) {
  await notifee.cancelNotification(`event-${eventId}`);
  console.log(`Cancelled reminder for event ${eventId}`);
}
