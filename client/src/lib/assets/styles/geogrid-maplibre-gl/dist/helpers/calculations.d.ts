import { Map } from 'maplibre-gl';
export declare const calculateTopMostNotOcludedLatitude: (map: Map, longitude: number) => number | undefined;
export declare const calculateLeftMostNotOcludedLongitude: (map: Map, latitude: number) => number | undefined;
export declare const calculateRightMostNotOccludedLongitude: (map: Map, latitude: number) => number | undefined;
export declare const calculateBottomMostNotOcludedLatitude: (map: Map, longitude: number) => number | undefined;
export declare const calculateLeftEdgeLongitude: (map: Map, latitude: number) => number | null;
export declare const calculateRightEdgeLongitude: (map: Map, latitude: number) => number | null;
