import { eventsApi } from '@/services/eventsApi';
import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from '@/features/events/eventsSlice';
import notificationsReducer from '@/features/events/notificationSlice';
export const store = configureStore({
  reducer: {
    events: eventsReducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(eventsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
