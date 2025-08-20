declare module 'react-simple-maps' {
  import React from 'react';

  export interface GeographyProps {
    geography: any;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    [key: string]: any;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: Array<any> }) => React.ReactNode;
    [key: string]: any;
  }

  export interface ComposableMapProps {
    projectionConfig?: object;
    projection?: string;
    width?: number;
    height?: number;
    [key: string]: any;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    onMoveStart?: (position: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
    [key: string]: any;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;
}