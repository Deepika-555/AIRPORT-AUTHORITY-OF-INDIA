import { LngLatBounds } from 'maplibre-gl';
import { Postition } from '../types';
export declare const createParallelsGeometry: (densityInDegrees: number, bounds: LngLatBounds) => Postition[][];
export declare const createMeridiansGeometry: (densityInDegrees: number, bounds: LngLatBounds) => Postition[][];
