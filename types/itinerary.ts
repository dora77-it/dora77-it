export type Slot = {
  timeOfDay: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
};

export type Day = {
  dayIndex: number;
  date?: string;
  slots: Slot[];
};
