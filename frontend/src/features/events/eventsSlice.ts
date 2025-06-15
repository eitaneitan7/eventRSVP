import { Event } from "@/utils/contentModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
  allEvents: Event[];
  page: number;
  hasMore: boolean;
}

const initialState: EventsState = {
  allEvents: [],
  page: 1,
  hasMore: true,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.allEvents = action.payload;
    },
    appendEvents: (state, action: PayloadAction<Event[]>) => {
      state.allEvents = [...state.allEvents, ...action.payload];
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    incrementPage: state => {
      state.page += 1;
    },
    resetPagination: state => {
      state.page = 1;
      state.hasMore = true;
      state.allEvents = [];
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    markRsvp: (
      state,
      action: PayloadAction<{
        id: string;
        hasUserRsvped: boolean;
        guestCount: number;
      }>,
    ) => {
      const { id, hasUserRsvped, guestCount } = action.payload;
      const event = state.allEvents.find(e => e.id === id);
      if (event) {
        const previousGuestCount = event.guestCount || 0;
        const diff = guestCount - previousGuestCount;
        event.hasUserRsvped = hasUserRsvped;
        event.guestCount = guestCount;
        event.rsvpCount = Math.max(0, event.rsvpCount + diff);
      }
    },
  },
});

export const {
  setEvents,
  appendEvents,
  setPage,
  incrementPage,
  resetPagination,
  setHasMore,
  markRsvp,
} = eventsSlice.actions;

export default eventsSlice.reducer;
