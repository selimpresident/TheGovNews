/**
 * Strict API Response Types
 * Replaces 'any' types with specific interfaces
 */

export interface GeoJsonProperties {
  name?: string;
  NAME?: string;
  NAME_LONG?: string;
  ISO_A2?: string;
  ISO_A3?: string;
}

export interface GeoJsonGeometry {
  type: string;
  coordinates: number[][][] | number[][][][];
}

export interface GeoJsonFeature {
  type: 'Feature';
  properties: GeoJsonProperties;
  geometry: GeoJsonGeometry;
  rsmKey: string;
}

export interface WorldAtlasData {
  type: 'Topology';
  objects: {
    countries: {
      type: 'GeometryCollection';
      geometries: Array<{
        type: string;
        properties: GeoJsonProperties;
        arcs?: number[][];
      }>;
    };
  };
  arcs: number[][][];
  transform: {
    scale: [number, number];
    translate: [number, number];
  };
}

export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

export interface SearchFilters {
  query?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  topics?: string[];
  countries?: string[];
}