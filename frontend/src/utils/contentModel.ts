export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  rsvpCount: number;
  hasUserRsvped: boolean;
  guestCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}
