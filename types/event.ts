export interface Event {
  id: string;
  title: string;
  type: "exhibition" | "performance" | "opening" | "workshop";
  venue: string;
  address: string;
  date: string;
  time: string;
  description: string;
  image: string;
  area: string;
}
