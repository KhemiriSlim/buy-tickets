import type { EventItem } from "../api/types";

type Props = { event: EventItem };

export default function EventCard({ event }: Props) {
  return <div>{event.title}</div>;
}