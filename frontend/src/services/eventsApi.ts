import { Event } from '@/utils/contentModel';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@env';
import { Platform } from 'react-native';

type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    //make it work on Android emulator
    baseUrl: Platform.OS === 'android' ? 'http://10.0.2.2:4000' : BASE_URL,
  }),
  tagTypes: ['Events'],
  endpoints: builder => ({
    getEvents: builder.query<
      PaginatedResponse<Event>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) =>
        `/events?page=${page}&limit=${limit}`,
      transformResponse: (
        response: SuccessResponse<PaginatedResponse<Event>>,
      ) => response.data,
      providesTags: (result): Array<{ type: 'Events'; id: string }> =>
        result
          ? result.data.map(({ id }) => ({ type: 'Events' as const, id }))
          : [],
    }),
    getEventById: builder.query<Event, string>({
      query: id => `/events/${id}`,
      transformResponse: (response: SuccessResponse<Event>) => response.data,
    }),

    rsvpEvent: builder.mutation<Event, { id: string; guestCount: number }>({
      query: ({ id, guestCount }) => ({
        url: `/events/${id}/rsvp`,
        method: 'POST',
        body: { guestCount },
      }),
      transformResponse: (response: SuccessResponse<Event>) => response.data,
      async onQueryStarted({ id, guestCount }, { dispatch, queryFulfilled }) {
        const patchEvents = dispatch(
          eventsApi.util.updateQueryData(
            'getEvents',
            { page: 1, limit: 10 },
            draft => {
              const event = draft.data.find(e => e.id === id);
              if (event) {
                event.rsvpCount += guestCount;
                event.hasUserRsvped = true;
                event.guestCount = guestCount;
              }
            },
          ),
        );

        const patchEventById = dispatch(
          eventsApi.util.updateQueryData('getEventById', id, draft => {
            draft.rsvpCount += guestCount;
            draft.hasUserRsvped = true;
            draft.guestCount = guestCount;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchEvents.undo();
          patchEventById.undo();
        }
      },
      invalidatesTags: (result, error, arg) => [
        'Events',
        { type: 'Events', id: arg.id },
      ],
    }),

    cancelRsvp: builder.mutation<Event, { id: string }>({
      query: ({ id }) => ({
        url: `/events/${id}/rsvp`,
        method: 'DELETE',
      }),
      transformResponse: (response: SuccessResponse<Event>) => response.data,
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchEvents = dispatch(
          eventsApi.util.updateQueryData(
            'getEvents',
            { page: 1, limit: 10 },
            draft => {
              const event = draft.data.find(e => e.id === id);
              if (event) {
                const guestsToRemove = event.guestCount || 1;
                event.rsvpCount = Math.max(0, event.rsvpCount - guestsToRemove);
                event.hasUserRsvped = false;
                event.guestCount = 0;
              }
            },
          ),
        );

        const patchEventById = dispatch(
          eventsApi.util.updateQueryData('getEventById', id, draft => {
            const guestsToRemove = draft.guestCount || 1;
            draft.rsvpCount = Math.max(0, draft.rsvpCount - guestsToRemove);
            draft.hasUserRsvped = false;
            draft.guestCount = 0;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchEvents.undo();
          patchEventById.undo();
        }
      },
      invalidatesTags: (result, error, arg) => [
        'Events',
        { type: 'Events', id: arg.id },
      ],
    }),

    updateRsvp: builder.mutation<Event, { id: string; guestCount: number }>({
      query: ({ id, guestCount }) => ({
        url: `/events/${id}/rsvp`,
        method: 'PATCH',
        body: { guestCount },
      }),
      transformResponse: (response: SuccessResponse<Event>) => response.data,
      async onQueryStarted({ id, guestCount }, { dispatch, queryFulfilled }) {
        const patchEvents = dispatch(
          eventsApi.util.updateQueryData(
            'getEvents',
            { page: 1, limit: 10 },
            draft => {
              const event = draft.data.find(e => e.id === id);
              if (event) {
                const prev = event.guestCount || 1;
                const diff = guestCount - prev;
                event.rsvpCount = Math.max(0, event.rsvpCount + diff);
                event.guestCount = guestCount;
              }
            },
          ),
        );

        const patchEventById = dispatch(
          eventsApi.util.updateQueryData('getEventById', id, draft => {
            const prev = draft.guestCount || 1;
            const diff = guestCount - prev;
            draft.rsvpCount = Math.max(0, draft.rsvpCount + diff);
            draft.guestCount = guestCount;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchEvents.undo();
          patchEventById.undo();
        }
      },
      invalidatesTags: (result, error, arg) => [
        'Events',
        { type: 'Events', id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useRsvpEventMutation,
  useCancelRsvpMutation,
  useUpdateRsvpMutation,
} = eventsApi;
