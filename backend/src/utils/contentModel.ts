export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  rsvpCount: number;
  hasUserRsvped?: boolean;
  guestCount?: number;
}

