import { readable, writable } from "svelte/store";
import maplibregl from 'maplibre-gl';
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw';
import '@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css';
import * as MaplibreGrid from 'maplibre-grid';
import { MaplibreLegendControl } from "@watergis/maplibre-gl-legend";
import '@/assets/styles/maplibre-gl-legend.css';



// import 'maplibre-compass-pro/dist/style.css';
import '@/assets/styles/compassstyle.css';
import { Compass } from 'maplibre-compass-pro';


import * as mapStyle from '@/assets/configs/defaultmapstyle.json';
import * as mapStyle2 from '@/assets/configs/defaultmapstyle2.json';


// let GlobeControls=new maplibregl.GlobeControl();
const drawCtrl = new MaplibreTerradrawControl({
  modes: ['render','point','linestring','polygon','rectangle','circle','freehand','angled-rectangle','sensor','sector','select','delete-selection','delete','download'],
  open: false,
});
let trnCtrl = new maplibregl.TerrainControl({ source: 'terrainSource', exaggeration: 1.0 });
let navigateCtrl = new maplibregl.NavigationControl({
  visualizePitch: true,
  visualizeRoll: true,
  showZoom: true,
  showCompass: true
});
let scaleCtrl= new maplibregl.ScaleControl({
  maxWidth: 80,
  unit: 'metric' //imperial for miles
});
let gridDegrees= new MaplibreGrid.Grid({
  gridWidth: 1,
  gridHeight: 1,
  minZoom: 8,
  maxZoom: 11,
  units: 'degrees',
  paint: {
    'line-opacity': 1,
    'line-color':'rgb(255,255,255)',
    'line-width':3
  }
});
let gridMillions= new MaplibreGrid.Grid({
  gridWidth: 6,
  gridHeight: 4,
  minZoom: 0,
  maxZoom: 8,
  units: 'degrees',
  paint: {
    'line-opacity': 1,
    'line-color':'rgb(255,255,255)',
    'line-width':3
  }
});

let compassPro=new Compass({ size: 'sm' });



export const initialState = { lng: 77.5, lat: 22.5, zoom: 4 };
// export const GlobeControl = readable(GlobeControls); 

export const servers = {
  mapServer: 'http://localhost:6101',
  server: 'http://localhost:9000',
  djangoServer: 'http://localhost:8001',
};

export const defaultMapStyle = readable(mapStyle);
export const defaultMapStyle2 = readable(mapStyle2);
export let curMap = writable({});
export let arp = writable([]);
export let creation_arp_surface_tool = writable(false);

export let toolsOn = writable(false);
export let surveyDataUp = writable(false);
export let dgpsDataProcess = writable(false);
export let tsDataRP = writable(false);
export let ipsd_tool = writable(false);
export let pairsStore = writable([]);
export const visitorCount = writable(0);
export const latest_updated_time = writable('');


export let authOn = writable(true);
export let dataManageOn = writable(false);
export let obs_dataanalysis_tool = writable(false);
export let tools1On = writable(false);
export let tools3On = writable(false);
export let edittoolsOn = writable(false);
export let dms = writable(false);

let targets = {
  
};
export const lgndCtrl = new MaplibreLegendControl(targets, { 
  showDefault: false, 
      showCheckbox: true, 
      onlyRendered: true,
      reverseOrder: true
    });


export const drawControl = writable(drawCtrl);
export const terrainControl = readable(trnCtrl);
export const navigateControl = readable(navigateCtrl);
export const ScaleBar = readable(scaleCtrl);
export const gridDegree = readable(gridDegrees);
export const gridMillion = readable(gridMillions);
export const compass = readable(compassPro);
export const legendControl = readable(lgndCtrl);



export async function fetchVisitorCountincrement() {
  const res = await fetch(`${servers.server}/api/visitorcountupdate`,{
      method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  let parsed;
  // console.log(response,parsed)
  if (res) parsed = await res.json();
  console.log(parsed);
}
export async function fetchVisitorCount() {
  const res = await fetch(`${servers.server}/api/visitorcounts`,{
      method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  let parsed;
  // console.log(response,parsed)
  if (res) parsed = await res.json();
  console.log(parsed);
  visitorCount.set(parsed.count);


  const res1 = await fetch(`${servers.server}/api/siteupdate_on`,{
    method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
    let parsed_time;
// console.log(response,parsed)
    if (res1) parsed_time = await res1.json();
    console.log(parsed_time);
    //latest_updated_time.set(parsed_time.latest_time);
    let timestamp = parsed_time.latest_time;

    // Append a date part to make it a valid ISO 8601 string
    let validTimestamp = '2024-11-21T' + timestamp;
    
    // Convert to a Date object
    let date = new Date(validTimestamp);
   

    // Format the time (HH:mm:ss)
    let formattedTime = date.toLocaleTimeString('en-GB', {
        hour12: false, // 24-hour format
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    latest_updated_time.set(formattedTime);
}