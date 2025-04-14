import { LabelStyle } from '../main';
export declare const createLabelsContainerElement: () => HTMLDivElement;
export declare const createLabelElement: (value: number, x: number, y: number, align: "left" | "right" | "top" | "bottom", format: (degress: number) => string, labelStyle: LabelStyle) => HTMLDivElement;
