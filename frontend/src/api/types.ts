export type EventItem = {
  id: number;
  title: string;
  description: string | null;
  location: string;
  date: string;
  price: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
};

export type EventDetails = EventItem & {
  remaining: number;
};