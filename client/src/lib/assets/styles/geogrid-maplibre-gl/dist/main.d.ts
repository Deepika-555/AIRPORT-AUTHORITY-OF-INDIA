export interface GridStyle {
    color?: string;
    width?: number;
    /**
     * Specifies the lengths of the alternating dashes and gaps that form the dash pattern.
     */
    dasharray?: number[];
}
export interface LabelStyle {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    textShadow?: string;
}
export interface GeoGridOptions {
    /**
     * Instance of maplibre-gl-js map.
     */
    map: maplibregl.Map;
    /**
     * The ID of the layer before which the grid layers will be placed.
     * If undefined, the grid layers are added on top of all layers.
     * @default undefined
     */
    beforeLayerId?: string | undefined;
    /**
      @deprecated Use gridStyle
      */
    style?: GridStyle;
    /**
     * The style options for the grid lines.
     * @default { color: '#000000', width: 1 }
     * @example
     * {
     *   color: '#ff0000',
     *   width: 2,
     *   dasharray: [5, 10]
     * }
     */
    gridStyle?: GridStyle;
    /**
     * Style of the coordinate labels.
     * @example
     * {
     *   color: 'red',
     *   fontSize: '18px',
     *   fontFamily: 'Open Sans'
     * }
     */
    labelStyle?: LabelStyle;
    /**
     * The zoom level range within which the grid is visible.
     * Defined as an array [minZoom, maxZoom].
     * @default [0, 22]
     */
    zoomLevelRange?: [number, number];
    /**
      * A function that defines the density of the grid lines.
      * The density is the distance between grid lines, measured in degrees.
      * @param zoomLevel The current zoom level of the map.
      * In the globe projection, zoom can be negative. Negative zoom values are clamped to 0.
      * @returns The distance between grid lines in degrees.
      */
    gridDensity?: (zoomLevel: number) => number;
    /**
     * A function to format the grid labels.
     * By default, formats the labels as "[degrees]° [minutes]` [seconds]``".
     * @param degreesFloat A floating-point number representing degrees.
     * @returns A formatted label string.
     */
    formatLabels?: (degreesFloat: number) => string;
}
/**
 * Creates customizable geographic grid and adds it to the map.
 */
export declare class GeoGrid {
    private map;
    private config;
    private elements;
    constructor(options: GeoGridOptions);
    /**
    * Adds grid back to the map.
    * You only need to call this function if remove() was called.
    */
    add: () => void;
    /**
     * Removes grid from the map.
     */
    remove: () => void;
    private removeEventListeners;
    private onMove;
    private onProjectionTransition;
    private addLayersAndSources;
    private drawLabels;
    private updateGrid;
    private updateLabelsVisibility;
    private removeLabels;
    private drawBottomLabel;
    private drawTopLabel;
    private drawLeftLabel;
    private drawRightLabel;
}
