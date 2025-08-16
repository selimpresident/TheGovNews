
export interface Conflict {
  id: string;
  name: string;
  coordinates: [number, number]; // [lon, lat]
}

export const conflicts: Conflict[] = [];
