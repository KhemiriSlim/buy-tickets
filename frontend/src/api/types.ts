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


export type TicketItem  =  {
  id : number;
  userId : number;
  eventId : number;
  quantity : number;
  createdAt : string;
  event : EventItem;
}