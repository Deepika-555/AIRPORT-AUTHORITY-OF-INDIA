<script setup lang="ts">
	import { onMount } from "svelte";

  import LatLon, { Dms } from '@/assets/js/latlon-ellipsoidal-vincenty.js';
  import UTMLatLng from '@/assets/js/lnglat2utm'



	
	onMount(() => {


		})	
  let selectedConverter = '';
  let distance=false,location=false,time=false,weight=false,quantity=false,speed=false,bearing=false,zonefinder=false;  

	let lat1:any = `26° 24' 29.7869" N`;
  let lon1:any = `075° 51' 50.4446" E`;
  let lat2:any = `26° 24' 25.6322" N`;
  let lon2:any = `075° 52' 29.5299" E`;

  function showConverter(value:any) {
  // Reset all flags to false
  const converters = {
    distance: false,
    location: false,
    time: false,
    speed: false,
    weight: false,
    quantity: false,
    bearing: false,
    zonefinder:false
  };

  // Set the selected converter flag to true
  if (converters.hasOwnProperty(value)) {
    converters[value] = true;
  }

  // Assign the flags back to respective variables
  distance = converters.distance;
  location = converters.location;
  time = converters.time;
  speed = converters.speed;
  weight = converters.weight;
  quantity = converters.quantity;
  bearing = converters.bearing;
  zonefinder=converters.zonefinder;
}

  let distanceMtrs = 0;
  let bearingInit = 0;
  let bearingFinal = 0;
  let bearingInitDMS:any;
  let bearingFinalDMS:any;
  let trueBearing1:any;
  let trueBearing2:any;

function convertVal(){
const p1 = new LatLon(lat1,lon1);
const p2 = new LatLon(lat2,lon2);
distanceMtrs=p1.distanceTo(p2)
bearingInit = p1.initialBearingTo(p2);
bearingFinal = p2.initialBearingTo(p1);
bearingInitDMS = Dms.toBrng(bearingInit, 'dms' , 2);
bearingFinalDMS = Dms.toBrng(bearingFinal, 'dms', 2);

// console.log(bearingInitDMS ,`${typeof bearingInitDMS}`);

let regex = /(\d{3})°\s*(\d{2})′\s*(\d+(\.\d+)?)″/;
let match1 = bearingInitDMS.match(regex);
let match2 = bearingFinalDMS.match(regex);

if (match1 && match2 ) {
  let degrees1 = parseInt(match1[1], 10);  // Degrees
  let minutes1 = parseInt(match1[2], 10);  // Minutes
  let seconds1 = parseFloat(match1[3]); 
  let degrees2 = parseInt(match2[1], 10);  // Degrees
  let minutes2 = parseInt(match2[2], 10);  // Minutes
  let seconds2 = parseFloat(match2[3]);   // Seconds (could be decimal)

  // Perform the adjustment (subtract 1 from minutes, add 60 to seconds)


  minutes2 -= 1;
  seconds2 += 60;

  // Check if minutes becomes negative, adjust degrees
  if ( minutes2 < 0) {
	minutes2 += 60;
    degrees2 -= 1;
  }

  // Rebuild the DMS string
//   let result1 = `${String(degrees1).padStart(3, '0')}° ${String(minutes1).padStart(2, '0')}′ ${seconds1.toFixed(2)}″`;
//   let result2 = `${String(degrees2).padStart(3, '0')}° ${String(minutes2).padStart(2, '0')}′ ${seconds2.toFixed(2)}″`;

  let secondPlus = (seconds2 + seconds1);
  let secondFinal=secondPlus/2;

  trueBearing1=`${String(degrees1).padStart(3, '0')}° ${String(minutes1).padStart(2, '0')}′ ${secondFinal}″`;
   trueBearing2=`${String(degrees2).padStart(3, '0')}° ${String(minutes2).padStart(2, '0')}′ ${secondFinal}″`;


//   console.log(result1,result2);  // Output the modified DMS
} else {
  console.log("Invalid DMS format");
}

}
	

function convertQuantity(convertFrom, value) {
    switch (convertFrom) {
        case "liters":
            litersToOther(parseFloat(value));
            break;
        case "milliliters":
            millilitersToOther(parseFloat(value));
            break;
        case "meters":
            metersToOther(parseFloat(value));
            break;
        case "millimeters":
            millimetersToOther(parseFloat(value));
            break;
        case "centimeters":
            centimetersToOther(parseFloat(value));
            break;
        case "kilograms":
            kilogramsToOther(parseFloat(value));
            break;
        case "grams":
            gramsToOther(parseFloat(value));
            break;
        case "barrel":
            barrelToOther(parseFloat(value));
            break;
        case "bushel":
            bushelToOther(parseFloat(value));
            break;
        case "bytes":
            bytesToOther(parseFloat(value));
            break;
        case "kilobytes":
            kilobytesToOther(parseFloat(value));
            break;
        case "megabytes":
            megabytesToOther(parseFloat(value));
            break;
        case "gigabytes":
            gigabytesToOther(parseFloat(value));
            break;
    }
}
// Quantity 
let liters = 0;
let milliliters = 0;
let meters = 0;
let millimeters = 0;
let centimeters = 0;
let kilograms = 0;
let grams = 0;
let barrel = 0;
let bushel = 0;
let bytes = 0;
let kilobytes = 0;
let megabytes = 0;
let gigabytes = 0;

function litersToOther(val) {
    milliliters = val * 1000;
    barrel = val / 159;
    bushel = val / 27.216;
    kilograms = val*0.970874;
    grams = val*0.970874*1000;
}

function millilitersToOther(val) {
    liters = val / 1000;
    barrel = (val / 1000) / 159;
    bushel = (val / 1000) / 27.216;
    kilograms = val*0.000970874;
    grams = val*0.000970874*1000;
}

function metersToOther(val) {
    millimeters = val * 1000;
    centimeters = val * 100;
}

function millimetersToOther(val) {
    meters = val / 1000;
    centimeters = val / 10;
}

function centimetersToOther(val) {
    meters = val / 100;
    millimeters = val * 10;
}

function kilogramsToOther(val) {
    grams = val * 1000;
    liters = val/0.970874;
    milliliters = val/0.000970874;
    barrel = val*0.00984;
    bushel = val*0.02838;
}

function gramsToOther(val) {
    kilograms = val / 1000;
    liters = val * 0.001;
    milliliters = val * 1
}

function barrelToOther(val){
    liters = val * 158.987;
    milliliters = val * 158.987 * 1000;
    bushel = val * 0.5;
    // kilograms.value = val / 0.00984;
    // grams.value = val * 0.159 * 1000;
}

function bushelToOther(val){
    liters = val * 35.239;
    milliliters = val * 35.239 * 1000;
    barrel = val / 0.5;
}

function bytesToOther(val) {
    kilobytes = val / 1024;
    megabytes = val / (1024 * 1024);
    gigabytes = val / (1024 * 1024 * 1024);
}

function kilobytesToOther(val) {
    bytes = val * 1024;
    megabytes = val / 1024;
    gigabytes = val / (1024 * 1024);
}

function megabytesToOther(val) {
    bytes = val * 1024 * 1024;
    kilobytes = val * 1024;
    gigabytes = val / 1024;
}

function gigabytesToOther(val) {
    bytes = val * 1024 * 1024 * 1024;
    kilobytes = val * 1024 * 1024;
    megabytes = val * 1024;
}
let newton = 0;
let kgf = 0;
let kilogram = 0;
let gram = 0;
let pound = 0;
let ounce = 0;
let stone = 0;

function convertWeight(convertFrom, value) {
    switch (convertFrom) {
        case "newton":
            newtonToOther(parseFloat(value));
            break;
        case "kgf":
            kgfToOther(parseFloat(value));
            break;
        case "gram":
            gramToOther(parseFloat(value));
            break;
        case "kilogram":
            kilogramToOther(parseFloat(value));
            break;
        case "ounce":
            ounceToOther(parseFloat(value));
            break;
        case "pound":
            poundToOther(parseFloat(value));
            break;
        case "stone":
            stoneToOther(parseFloat(value));
            break;
    }
}
function newtonToOther(val) {
    kgf = val * 0.10197;
    kilogram = val / 9.80665;
    gram = (val / 9.80665) * 1000;
    pound = (val / 9.80665) * 2.20462;
    ounce = (val / 9.80665) * 35.274;
    stone = (val / 9.80665) * 0.15747;
}

function kgfToOther(val) {
    newton = val * 9.80665;
    kilogram = val / 1.0;
    gram = val * 1000;
    pound = val * 2.20462;
    ounce = val * 35.274;
    stone = val * 0.15747;
}

function gramToOther(val) {
    kilogram = val / 1000;
    pound = val * 0.00220462;
    ounce = val * 0.035274;
    stone = val * 0.00015747;
    newton = (val / 1000) * 9.80665;
    kgf = (val / 1000) * 1.0;
}

function kilogramToOther(val) {
    gram = val * 1000;
    pound = val * 2.20462;
    ounce = val * 35.274;
    stone = val * 0.15747;
    newton = val * 9.80665;
    kgf = val * 1.0;
}

function ounceToOther(val) {
    gram = val * 28.3495;
    kilogram = val * 0.0283495;
    pound = val * 0.0625;
    stone = val * 0.00446429;
    newton = (val * 0.0283495) * 9.80665;
    kgf = (val * 0.0283495) * 1.0;
}

function poundToOther(val) {
    gram = val * 453.592;
    kilogram = val * 0.453592;
    ounce = val * 16;
    stone = val * 0.0714286;
    newton = (val * 0.453592) * 9.80665;
    kgf = (val * 0.453592) * 1.0;
}

function stoneToOther(val) {
    gram = val * 6350.29;
    kilogram = val * 6.35029;
    ounce = val * 224;
    pound = val * 14;
    newton = (val * 6.35029) * 9.80665;
    kgf = (val * 6.35029) * 1.0;
}

// Speed
let kmh=0;
let mph=0;
let fts=0;
let kn=0;
let mps=0;

function mpsToOther(val){
    kmh = (val * 3.6).toFixed(2); 
    mph = (val * 2.23694).toFixed(2);   
    fts = (val * 3.28084).toFixed(2); 
    kn = (val * 1.94384).toFixed(2);  
}

function kmhToOther(val){
    mps = (val * 0.27778).toFixed(2); 
    mph = (val * 0.621371).toFixed(2);   
    fts = (val * 0.911344).toFixed(2); 
    kn = (val * 0.539957).toFixed(2);  
}

function mphToOther(val){
    mps = (val * 0.44704).toFixed(2); 
    kmh = (val * 1.60934).toFixed(2);   
    fts = (val * 1.46667).toFixed(2); 
    kn = (val * 0.868976).toFixed(2);  
}

function ftsToOther(val){
    mps = (val * 0.3048).toFixed(2); 
    kmh = (val * 1.09728).toFixed(2);   
    mph = (val * 0.681818).toFixed(2); 
    kn = (val * 0.592484).toFixed(2);  
}

function knToOther(val){
    mps = (val * 0.514444).toFixed(2); 
    kmh = (val * 1.852).toFixed(2);   
    mph = (val * 1.15078).toFixed(2); 
    fts = (val * 1.68781).toFixed(2);  
}

function convertSpeed(convertFrom, value){    
    switch(convertFrom){
        case "mps" : mpsToOther(parseFloat(value)); break;
        case "kmh" : kmhToOther(parseFloat(value)); break;
        case "mph" : mphToOther(parseFloat(value)); break;
        case "fts" : ftsToOther(parseFloat(value)); break;
        case "kn"  : knToOther(parseFloat(value)); break;
    }
}
let mtr_bool=false;
  let ft_bool=false;
  let decimal_lat=false,degree_lat=false;
  //Distance code 
  let feet = 0;
  let inches = 0;
  let cm = 0;
  let yards = 0;
  let km = 0;
  let miles = 0;
  let mm = 0;
  let nm = 0;
  let fathoms = 0;

let second = 0;
let minute = 0;
let hour = 0;
let day = 0;
let week = 0;
let month = 0;
let year = 0;
let millisecond = 0;
let microsecond = 0;
let nanosecond = 0;
let picosecond = 0;
let femtosecond = 0;
let attosecond = 0;

function secondToOther(val) {
    minute      = val / 60;
    hour       = val / 3600;
    day         = val / 86400;
    week       = val / 604800;
   month      = val / 2629746; // average month in seconds
    year       = val / 31556952; // average year in seconds
    millisecond= val * 1000;
    microsecond= val * 1e6;
    nanosecond = val * 1e9;
    picosecond = val * 1e12;
    femtosecond= val * 1e15;
    attosecond = val * 1e18;
}

function minuteToOther(val) {
    second     = val * 60;
    hour       = val / 60;
    day         = val / 1440;
    week       = val / 10080;
   month      = val / 43829.1; // average month in minutes
    year       = val / 525949.2; // average year in minutes
    millisecond= val * 60000;
    microsecond= val * 6e7;
    nanosecond = val * 6e10;
    picosecond = val * 6e13;
    femtosecond= val * 6e16;
    attosecond = val * 6e19;
}

function hourToOther(val) {
    second     = val * 3600;
    minute     = val * 60;
    day         = val / 24;
    week       = val / 168;
   month      = val / 730.484; // average month in hours
    year       = val / 8765.81; // average year in hours
    millisecond= val * 3.6e6;
    microsecond= val * 3.6e9;
    nanosecond = val * 3.6e12;
    picosecond = val * 3.6e15;
    femtosecond= val * 3.6e18;
    attosecond = val * 3.6e21;
}

function dayToOther(val) {
    second     = val * 86400;
    minute     = val * 1440;
    hour       = val * 24;
    week       = val / 7;
   month      = val / 30.44; // average month in days
    year       = val / 365; // standard year in days
    millisecond= val * 8.64e7;
    microsecond= val * 8.64e10;
    nanosecond = val * 8.64e13;
    picosecond = val * 8.64e16;
    femtosecond= val * 8.64e19;
    attosecond = val * 8.64e22;
}

function weekToOther(val) {
    second     = val * 604800;
    minute     = val * 10080;
    hour       = val * 168;
    day         = val * 7;
   month      = val / 4.34524; // average month in weeks
    year       = val / 52.1429; // average year in weeks
    millisecond= val * 6.048e8;
    microsecond= val * 6.048e11;
    nanosecond = val * 6.048e14;
    picosecond = val * 6.048e17;
    femtosecond= val * 6.048e20;
    attosecond = val * 6.048e23;
}

function monthToOther(val) {
    second     = val * 2629746; // average month in seconds
    minute     = val * 43829.1; // average month in minutes
    hour       = val * 730.484; // average month in hours
    day         = val * 30.44; // average month in days
    week       = val * 4.34524; // average month in weeks
    year       = val / 12;
    millisecond= val * 2.629746e9;
    microsecond= val * 2.629746e12;
    nanosecond = val * 2.629746e15;
    picosecond = val * 2.629746e18;
    femtosecond= val * 2.629746e21;
    attosecond = val * 2.629746e24;
}

function yearToOther(val) {
    second     = val * 31556952; // average year in seconds
    minute     = val * 525949.2; // average year in minutes
    hour       = val * 8765.81; // average year in hours
    day         = val * 365; // standard year in days
    week       = val * 52.1429; // average year in weeks
   month      = val * 12;
    millisecond= val * 3.1556952e10;
    microsecond= val * 3.1556952e13;
    nanosecond = val * 3.1556952e16;
    picosecond = val * 3.1556952e19;
    femtosecond= val * 3.1556952e22;
    attosecond = val * 3.1556952e25;
}

function millisecondToOther(val) {
    second     = val / 1000;
    minute     = val / 60000;
    hour       = val / 3.6e6;
    day         = val / 8.64e7;
    week       = val / 6.048e8;
   month      = val / 2.629746e9; // average month in milliseconds
    year       = val / 3.1556952e10; // average year in milliseconds
    microsecond= val * 1000;
    nanosecond = val * 1e6;
    picosecond = val * 1e9;
    femtosecond= val * 1e12;
    attosecond = val * 1e15;
}

function microsecondToOther(val) {
    second     = val / 1e6;
    minute     = val / 6e7;
    hour       = val / 3.6e9;
    day         = val / 8.64e10;
    week       = val / 6.048e11;
   month      = val / 2.629746e12; // average month in microseconds
    year       = val / 3.1556952e13; // average year in microseconds
    millisecond= val / 1000;
    nanosecond = val * 1000;
    picosecond = val * 1e6;
    femtosecond= val * 1e9;
    attosecond = val * 1e12;
}

function nanosecondToOther(val) {
    second     = val / 1e9;
    minute     = val / 6e10;
    hour       = val / 3.6e12;
    day         = val / 8.64e13;
    week       = val / 6.048e14;
   month      = val / 2.629746e15; // average month in nanoseconds
    year       = val / 3.1556952e16; // average year in nanoseconds
    millisecond= val / 1e6;
    microsecond= val / 1000;
    picosecond = val * 1000;
    femtosecond= val * 1e6;
    attosecond = val * 1e9;
}

function picosecondToOther(val) {
    second     = val / 1e12;
    minute     = val / 6e13;
    hour       = val / 3.6e15;
    day         = val / 8.64e16;
    week       = val / 6.048e17;
   month      = val / 2.629746e18; // average month in picoseconds
    year       = val / 3.1556952e19; // average year in picoseconds
    millisecond= val / 1e9;
    microsecond= val / 1e6;
    nanosecond = val / 1000;
    femtosecond= val * 1000;
    attosecond = val * 1e6;
}

function femtosecondToOther(val) {
    second     = val / 1e15;
    minute     = val / 6e16;
    hour       = val / 3.6e18;
    day         = val / 8.64e19;
    week       = val / 6.048e20;
   month      = val / 2.629746e21; // average month in femtoseconds
    year       = val / 3.1556952e22; // average year in femtoseconds
    millisecond= val / 1e12;
    microsecond= val / 1e9;
    nanosecond = val / 1e6;
    picosecond = val / 1000;
    attosecond = val * 1000;
}

function attosecondToOther(val) {
    second     = val / 1e18;
    minute     = val / 6e19;
    hour       = val / 3.6e21;
    day         = val / 8.64e22;
    week       = val / 6.048e23;
   month      = val / 2.629746e24; // average month in attoseconds
    year       = val / 3.1556952e25; // average year in attoseconds
    millisecond= val / 1e15;
    microsecond= val / 1e12;
    nanosecond = val / 1e9;
    picosecond = val / 1e6;
    femtosecond= val / 1000;
}

function convertTime(convertFrom, value) {    
    switch(convertFrom) {
        case "second":      secondToOther(parseFloat(value)); break;
        case "minute":      minuteToOther(parseFloat(value)); break;
        case "hour":        hourToOther(parseFloat(value)); break;
        case "day":         dayToOther(parseFloat(value)); break;
        case "week":        weekToOther(parseFloat(value)); break;
        case "month":       monthToOther(parseFloat(value)); break;
        case "year":        yearToOther(parseFloat(value)); break;
        case "millisecond": millisecondToOther(parseFloat(value)); break;
        case "microsecond": microsecondToOther(parseFloat(value)); break;
        case "nanosecond":  nanosecondToOther(parseFloat(value)); break;
        case "picosecond":  picosecondToOther(parseFloat(value)); break;
        case "femtosecond": femtosecondToOther(parseFloat(value)); break;
        case "attosecond":  attosecondToOther(parseFloat(value)); break;
    }
}
function feetToOther(val) {
    meters = val / 3.2808;
    inches = val * 12;
    cm = val / 0.032808;
    yards = val * 0.33333;
    km = val / 3280.8;
    miles = val * 0.00018939;
    mm = val * 304.8;
    nm = val * 0.00018939;
    fathoms = val / 6;
  }

  function meterToOther(val) {
    feet = val * 3.2808;
    inches = val * 39.370;
    cm = val / 0.01;
    yards = val * 1.0936;
    km = val / 1000;
    miles = val * 0.00062137;
    mm = val * 1000;
    nm = val * 0.00053996;
    fathoms = val / 1.829;
  }

  function inchesToOther(val) {
    feet = val * 0.083333;
    meters = val / 39.370;
    cm = val / 0.39370;
    yards = val * 0.027778;
    km = val / 39370;
    miles = val * 0.000015783;
    mm = val * 25.4;
    nm = val * 0.000015783;
    fathoms = val / 72;
  }

  function cmToOther(val) {
    feet = val * 0.032808;
    meters = val / 100;
    inches = val * 0.39370;
    yards = val * 0.010936;
    km = val / 100000;
    miles = val * 0.0000062137;
    mm = val * 10;
    nm = val * 0.0000053962;
    fathoms = val / 182.9;
  }

  function yardsToOther(val) {
    feet = val * 3;
    inches = val * 36;
    cm = val / 0.010936;
    meters = val / 1.0936;
    km = val / 1093.6;
    miles = val * 0.00056818;
    mm = val * 914.4;
    nm = val * 0.00056818;
    fathoms = val / 2;
  }

  function kmToOther(val) {
    feet = val * 3280.8;
    inches = val * 39370;
    cm = val * 100000;
    yards = val * 1093.6;
    meters = val * 1000;
    miles = val * 0.62137;
    mm = val * 1000000;
    nm = val * 0.62137;
    fathoms = val * 546.8;
  }

  function milesToOther(val) {
    feet = val * 5280;
    inches = val * 63360;
    cm = val / 0.0000062137;
    yards = val * 1760;
    km = val / 0.62137;
    meters = val / 0.00062137;
    mm = val / 0.00000062137;
    nm = val / 0.00000062137;
    fathoms = val * 880;
  }

  function mmToOthers(val) {
    feet = val * 0.0032808;
    inches = val * 0.0393701;
    cm = val * 0.1;
    yards = val * 0.0010936;
    km = val * 0.000001;
    miles = val * 0.00000062137;
    meters = val / 1000;
    nm = val * 0.000001;
    fathoms = val / 1829;
  }

  function nmToOthers(val) {
    feet = val * 6076.12;
    inches = val * 72913.4;
    cm = val * 185200;
    yards = val * 2025.37;
    km = val * 1.852;
    miles = val * 1.15078;
    meters = val * 1852;
    mm = val * 1.852e+6;
    fathoms = val * 1012.69;
  }

  function fathomToOther(val) {
    feet = val * 6;
    inches = val * 72;
    cm = val * 182.9;
    yards = val * 2;
    km = val / 546.8;
    miles = val / 880;
    meters = val * 1.8288;
    mm = val * 1829;
    nm = val / 1012.69;
  }

async function convertToOthers(convertFrom:any, value:any) {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    switch (convertFrom) {
      case 'feet': feetToOther(val); break;
      case 'meter': meterToOther(val); break;
      case 'inch': inchesToOther(val); break;
      case 'cm': cmToOther(val); break;
      case 'yard': yardsToOther(val); break;
      case 'km': kmToOther(val); break;
      case 'mile': milesToOther(val); break;
      case 'mm': mmToOthers(val); break;
      case 'nm': nmToOthers(val); break;
      case 'fathom': fathomToOther(val); break;
      case 'degree_lat': decimalLat= await dmsToDecimal(degreesLat, minutesLat, secondsLat, directionLat); break;
      case 'decimal_lat':const dmsLat = await decimalToDms(decimalLat, 'lat');
        degreesLat = dmsLat.degrees;
         minutesLat = dmsLat.minutes;
         secondsLat = dmsLat.seconds;
         directionLat=dmsLat.direction;break;
      case 'degree_lon': decimalLon= await dmsToDecimal(degreesLon, minutesLon, secondsLon, directionLon); break;
      case 'decimal_lon':const dmslon = await decimalToDms(decimalLon, 'lon');
        degreesLon = dmslon.degrees;
         minutesLon = dmslon.minutes;
         secondsLon = dmslon.seconds;
         directionLon=dmslon.direction;break;
  }
  }

  let degreesLat = 0;
    let minutesLat = 0;
    let secondsLat = 0;
    let decimalLat = 0;
    let directionLat = 'N';

    let degreesLon = 0;
    let minutesLon = 0;
    let secondsLon = 0;
    let decimalLon = 0;
    let directionLon = 'E';

    function dmsToDecimal(degrees, minutes, seconds, direction) {
        let decimal = degrees + minutes / 60 + seconds / 3600;
        if (direction === 'S' || direction === 'W') {
            decimal = -decimal;
        }
        return decimal;
    }

    function decimalToDms(decimal, directionType) {
        const isNegative = decimal < 0;
        decimal = Math.abs(decimal);
        const degrees = Math.floor(decimal);
        const minutes = Math.floor((decimal - degrees) * 60);
        const seconds = ((decimal - degrees - minutes / 60) * 3600);

        let direction;
        if (directionType === 'lat') {
            direction = isNegative ? 'S' : 'N';
        } else {
            direction = isNegative ? 'W' : 'E';
        }

        return { degrees, minutes, seconds, direction };
    }

    function metersToFeet(meters) {
        return meters * 3.28084;
    }

    function feetToMeters(feet) {
        return feet / 3.28084;
    }

    $: if (meters || feet) {
      if(mtr_bool){
        feet = metersToFeet(meters);
      }
       if(ft_bool){
        meters = feetToMeters(feet);
       }
    }

    let utmZone:any = '';

// Function to calculate UTM zone
function calculateUTMZone() {
  const utm = new UTMLatLng();
  utmZone= utm.convertLatLngToUtm(lat1,lon1,2);
  console.log(utmZone)
}


</script>

<div class="container mt-1 w-50 ">
  <div class="text-center form-group">
    <!-- <label for="converter-select">
      <h6>Select Converter</h6>
    </label> -->
    <select class="form-control text-center"  id="converter-select" bind:value={selectedConverter} on:change="{(e) => showConverter(e.target.value)}" >
      <option value="" disabled hidden>Select Type</option>
      <option value="time">Time</option>
      <option value="speed">Speed</option>
      <option value="weight">Weight</option>
      <option value="quantity">Quantity</option>
      <option value="location">Location</option>
      <option value="distance">Distance</option>
      <option value="bearing">Bearing</option>
      <option value="zonefinder">UTM Zone Finder</option>
    </select>
  </div>
</div>
{#if selectedConverter!=''}
<div style=" background: #d1d5db;padding:10px;margin:10px;overflow: scroll;height:75vh display: flex; justify-content: center; align-items: center;">

  {#if zonefinder}
  <div class="container-fluid w-100" style="padding-left: 120px;" >
    <h6 class="text-center" style="color: #2c8a97; padding-right:170px">UTM Zone Finder</h6>
    <div class="row" style="width: 100%; max-width: 800px;">
      <div class="col-md-6">
        <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
            <div style="flex: 1;">
                <label for="lat">Latitude</label>
                <input type="text" class="form-control" style="background: white;" bind:value={lat1} title="Latitude 1" required />
            </div>
            <div style="flex: 1;">
                <label for="lng">Longitude</label>
                <input type="text" class="form-control" style="background: white;" bind:value={lon1} title="Longitude 1" required />
            </div>
        </div>
        
        <div class="btn-convert" style="display: flex; justify-content:center; padding-right:100px">
            <button title="Convert Lat Long to UTM" style="width:200px; padding: 7px 20px; border-radius: 3px; margin-bottom:2px; margin-top:10px" class="btn m-2" on:click={()=>{calculateUTMZone()}}>Convert</button>
        </div>
  
            <!-- <form id="latlongform">
                <div class="row">
                    <div class="col-4 m2">
                        <label for="lat">Latitude</label>
                        <input type="number" step="0.000000001" name="lat" id="lat" placeholder="lat" bind:value={lat1}
                            required />
                    </div>
                    <div class="col-4 m2">
                        <label for="lng">Longitude</label>
                        <input type="number" step="0.000000001" name="lng" id="lng" placeholder="long"  bind:value={lon1}
                            required />
                    </div>
                    <div class="col-4">
                      <button title="Convert Lat Long to UTM" on:click={()=>{calculateUTMZone()}}>Convert</button></div>
                </div>
            </form> -->
            <div style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <div class="form-group">
                        <label for="utm-easting">UTM Easting</label>
                        <input type="text" id="utm-easting" name="utm-easting" placeholder="UTM Easting" class="form-control" style="background: white;" bind:value={utmZone.Easting} readonly />
                    </div>         
                </div>
                
                <div style="flex: 1;">
                    <div class="form-group">
                        <label for="utm-northing">UTM Northing</label>
                        <input type="text" id="utm-northing" name="utm-northing" placeholder="UTM Northing" class="form-control" style="background: white;" bind:value={utmZone.Northing} readonly />
                    </div>
                </div>
                
                <div style="flex: 1;">
                    <div class="form-group">
                        <label for="utm-zone">UTM Zone</label>
                        <input type="text" id="utm-zone" name="utm-zone" class="form-control" style="background: white;" placeholder="UTM Zone" bind:value={utmZone.ZoneNumber} readonly />
                    </div>
                </div>
            </div>
            
              </div>
              </div>
              </div>

      
  {/if}
 {#if bearing}
 <div class="container-fluid w-100">
  <h6 class="text-center" style="color: #2c8a97; padding-right:100px">Distance Units Converter</h6>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="form-group">
        <div>
        <!-- Point A Inputs -->
        <label for="Point1" style="color: black;">Point A:</label>
        <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 5px; margin-bottom: 10px;">
            <div style="flex: 1;">
                <label for="lat">Latitude</label>
                <input type="text" class="form-control" style="background: white;" bind:value={lat1} title="Latitude 1" required />
            </div>
            <div style="flex: 1;">
                <label for="lng">Longitude</label>
                <input type="text" class="form-control" style="background: white;" bind:value={lon1} title="Longitude 1" required />
            </div>
        </div>

        <!-- Point B Inputs -->
        <label for="Point2" style="color: black;">Point B:</label>
        <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 5px; margin-bottom: 10px;">
            <div style="flex: 1;">
                <label for="lat">Latitude</label>
                <input type="text" class="form-control" style="background: white;" bind:value={lat2} title="Latitude 2" required />
            </div>
            <div style="flex: 1;">
                <label for="lng">Longitude</label>
                <input type="text" class="form-control" style="background: white;" bind:value={lon2} title="Longitude 2" required />
            </div>
        </div>
    </div>

        
        <!-- Convert Button -->
        <div class="btn-convert" style="display: flex; justify-content:center; padding-right:100px">
            <button class="btn mt-2" style="width:200px; padding: 7px 20px; border-radius: 3px; margin-bottom:2px; margin-top:10px" on:click={() => { convertVal() }}>Convert</button>
        </div>

        <!-- Distance Output Table -->
        <table class="outputs table table-bordered mt-3" style="display: flex; justify-content:center ">
          <tbody style="text-align: center;">
            <tr>
              <td>Distance:</td>
              <td><output name="distance" title="Distance (in meters)">{distanceMtrs}</output> m</td>
            </tr>
            <tr>
              <td>Forward Bearing:</td>
              <td><output name="bearing-init" title="Initial bearing (azimuth)">{bearingInitDMS}</output></td>
            </tr>
            <tr>
              <td>Backward Bearing:</td>
              <td><output name="bearing-init" title="Initial bearing (azimuth)">{bearingFinalDMS}</output></td>
            </tr>
            <tr>
              <td>True Bearing 1:</td>
              <td><output name="bearing-init" title="Initial bearing (azimuth)">{trueBearing1}</output></td>
            </tr>
            <tr>
              <td>True Bearing 2:</td>
              <td><output name="bearing-init" title="Initial bearing (azimuth)">{trueBearing2}</output></td>
            </tr>
          </tbody>
        </table>

       
      </div>
    </div>
  </div>
</div>



{/if}
{#if quantity}
<div class="container-fluid w-100 ">
  <h6 class="text-center" style=" padding-right:100px">Quantity Units Converter</h6>
  <div class="row ">
    <div class="col-md-6">
    <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
            <div style="flex: 1;">
              <label for="liters">Liters (L):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={liters} data-unit="liters"  on:input={(e)=>{convertQuantity('liters',  e.target.value)}}>
            </div>
            <div style="flex: 1;">
              <label for="milliliters">Milliliters (mL):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={milliliters} data-unit="milliliters"  on:input={(e)=>{convertQuantity('milliliters',  e.target.value)}}>
          </div>
      </div>
      <!-- <div class="col-md-6 w-50">
          <div class="form-group">
              <label for="meters">Meters (m):</label>
              <input type="number" class="form-control"  bind:value={meters} data-unit="meters"  on:input={(e)=>{convertQuantity('meters',  e.target.value)}}>
          </div>
      </div>
      <div class="col-md-6 w-50">
          <div class="form-group">
              <label for="millimeters">Millimeters (mm):</label>
              <input type="number" class="form-control"  bind:value={millimeters} data-unit="millimeters"  on:input={(e)=>{convertQuantity('millimeters',  e.target.value)}}>
          </div>
      </div>
      <div class="col-md-6 w-50">
          <div class="form-group">
              <label for="centimeters">Centimeters (cm):</label>
              <input type="number" class="form-control"  bind:value={centimeters} data-unit="centimeters"  on:input={(e)=>{convertQuantity('centimeters',  e.target.value)}}>
          </div>
      </div> -->
      <!-- <div class="col-md-6 w-50">
          <div class="form-group">
              <label for="kilograms">Kilograms (kg):</label>
              <input type="number" class="form-control"  bind:value={kilograms} data-unit="kilograms"  on:input={(e)=>{convertQuantity('kilograms',  e.target.value)}}>
          </div>
      </div>
      <div class="col-md-6 w-50">
          <div class="form-group">
              <label for="grams">Grams (g):</label>
              <input type="number" class="form-control"  bind:value={grams} data-unit="grams"  on:input={(e)=>{convertQuantity('grams',  e.target.value)}}>
          </div>
      </div> -->
     
      <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
              <label for="barrel">Barrel (bbl):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={barrel} data-unit="barrel"  on:input={(e)=>{convertQuantity('barrel',  e.target.value)}}>
          </div>
    
  
          <div style="flex: 1;">
              <label for="bushel">Bushel (bu):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={bushel} data-unit="bushel"  on:input={(e)=>{convertQuantity('bushel',  e.target.value)}}>
          </div>
      </div>
     
      <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
              <label for="bytes">Bytes (B):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={bytes} data-unit="bytes"  on:input={(e)=>{convertQuantity('bytes',  e.target.value)}}>
          </div>
      
          <div style="flex: 1;">
              <label for="kilobytes">Kilobytes (KB):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={kilobytes} data-unit="kilobytes"  on:input={(e)=>{convertQuantity('kilobytes',  e.target.value)}}>
          </div>
      </div>
      <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
              <label for="megabytes">Megabytes (MB):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={megabytes} data-unit="megabytes"  on:input={(e)=>{convertQuantity('megabytes',  e.target.value)}}>
          </div>
      
          <div style="flex: 1;">
              <label for="gigabytes">Gigabytes (GB):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={gigabytes} data-unit="gigabytes"  on:input={(e)=>{convertQuantity('gigabytes',  e.target.value)}}>
          </div>
      </div>
  </div>
</div>
</div>
{/if}

{#if weight}
<div class="container-fluid w-100 ">
  <div id="weight-converter" class="converter ">
  <h6 class="text-center"  style=" padding-right:100px">Weight Units Converter</h6>
  <div class="row">
    <div class="col-md-6">
        <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
            <div style="flex: 1;">
              <label for="newton">Newton (N):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={newton} data-unit="newton"  on:input={(e)=>{convertWeight('newton',  e.target.value)}}>
          </div>
      
          <div style="flex: 1;">
              <label for="kgf">Kilogram-force (kgf):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={kgf} data-unit="kgf"  on:input={(e)=>{convertWeight('kgf',  e.target.value)}}>
          </div>
      </div>

      <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
            <div style="flex: 1;">
              <label for="gram">Gram (g):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={gram} data-unit="gram"  on:input={(e)=>{convertWeight('gram',  e.target.value)}}>
          </div>
        <div style="flex: 1;">
              <label for="kilogram">Kilogram (kg):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={kilogram} data-unit="kilogram"  on:input={(e)=>{convertWeight('kilogram',  e.target.value)}}>
          </div>
      </div>

      <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
            <div style="flex: 1;">
              <label for="ounce">Ounce (oz):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={ounce} data-unit="ounce"  on:input={(e)=>{convertWeight('ounce',  e.target.value)}}>
          </div>
          <div style="flex: 1;">
              <label for="pound">Pound (lb):</label>
              <input type="number" class="form-control" style="background: white;" bind:value={pound} data-unit="pound"  on:input={(e)=>{convertWeight('pound',  e.target.value)}}>
          </div>
      </div>
      <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
              <label for="stone" style="padding-left: 100px;">Stone (st):</label>
              <div style="padding-left:100px">
              <input type="number" class="form-control" style="background: white;" bind:value={stone} data-unit="stone"  on:input={(e)=>{convertWeight('stone',  e.target.value)}}>
              </div>
          </div>
      </div>
  </div>
  </div>
</div>
</div>
{/if}

{#if speed}
<div class="container-fluid w-100 " style="padding-left: 100px;">
  <div id="speed-converter" class="converter ">
  <h6 class="text-center  mb-4" style=" padding-right:100px">Speed Units Converter</h6>
  <div class="row justify-content-center">
    <div class="col-md-6">
        <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
            <div style="flex: 1;">
              <label for="meters-per-second">Meters per second (m/s):</label>
              <input type="number" class="form-control" style="background: white;"  bind:value={mps} data-unit="m/s"  on:input={(e)=>{convertSpeed('mps', e.target.value)}}>
          </div>
          <div style="flex: 1;">
              <label for="kilometers-per-hour">Kilometers per hour (km/h):</label>
              <input type="number" class="form-control" style="background: white;"  bind:value={kmh} data-unit="km/h" on:input={(e)=>{convertSpeed('kmh', e.target.value)}}>
          </div>
      </div>
      <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
              <label for="miles-per-hour">Miles per hour (mph):</label>
              <input type="number" class="form-control" style="background: white;"  bind:value={mph} data-unit="mph" on:input={(e)=>{convertSpeed('mph', e.target.value)}}>
          </div>
          <div style="flex: 1;">
              <label for="feet-per-second">Feet per second (ft/s):</label>
              <input type="number" class="form-control" style="background: white;"  bind:value={fts} data-unit="ft/s" on:input={(e)=>{convertSpeed('fts', e.target.value)}}>
          </div>
      </div>
      <div class="form-group" style="display: flex; justify-content: center; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
        <div style="flex: 1;">
              <label for="knot" style="padding-left: 100px;">Knot (kn):</label>
              <div style="padding-left:100px">
              <input type="number" class="form-control" style="background: white;"  bind:value={kn} data-unit="kn" on:input={(e)=>{convertSpeed('kn', e.target.value)}}>
            </div>
          </div>
      </div>
  </div>
  </div>
</div>
</div>
{/if}

{#if time}
<div class="container-fluid w-100">
        
  <!-- Time Converter -->
  <div id="time-converter" class="converter">
      <h6 class="text-center" style=" padding-right:100px">Time Units Converter</h6>
      <div class="row">
        <div class="col-md-6">
            <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
                <div style="flex: 1;">
                  <label for="milliseconds">Milliseconds (ms):</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={millisecond} data-unit="milliseconds" on:input={(e)=>{convertTime('millisecond', e.target.value)}}>
                </div>
          
                <div style="flex: 1;">
                  <label for="seconds">Seconds:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={second} data-unit="seconds" on:input={(e)=>{convertTime('second', e.target.value)}}>
              </div>
          </div>
          <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                  <label for="minutes">Minutes:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={minute} data-unit="minutes" on:input={(e)=>{convertTime('minute', e.target.value)}}>
              </div>
              <div style="flex: 1;">
                  <label for="hours">Hours:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={hour} data-unit="hours" on:input={(e)=>{convertTime('hour', e.target.value)}}>
              </div>
          </div>
          <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                  <label for="days">Days:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={day} data-unit="days" on:input={(e)=>{convertTime('day', e.target.value)}}>
              </div>
              <div style="flex: 1;">
                  <label for="weeks">Weeks:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={week} data-unit="weeks" on:input={(e)=>{convertTime('week', e.target.value)}}>
              </div>
          </div>
          <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                  <label for="months">Months:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={month} data-unit="months" on:input={(e)=>{convertTime('month', e.target.value)}}>
              </div>
              <div style="flex: 1;">
                  <label for="years">Years:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={year} data-unit="years" on:input={(e)=>{convertTime('year', e.target.value)}}>
              </div>
          </div>
          <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                  <label for="microseconds">Microseconds:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={microsecond} data-unit="microseconds" on:input={(e)=>{convertTime('microsecond', e.target.value)}}>
              </div>
              <div style="flex: 1;">
                  <label for="nanoseconds">Nanoseconds:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={nanosecond} data-unit="nanoseconds" on:input={(e)=>{convertTime('nanosecond', e.target.value)}}>
              </div>
          </div>
          <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
                  <label for="picoseconds">Picoseconds:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={picosecond} data-unit="picoseconds" on:input={(e)=>{convertTime('picosecond', e.target.value)}}>
              </div>
              <div style="flex: 1;">
                  <label for="femtoseconds">Femtoseconds:</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={femtosecond} data-unit="femtoseconds" on:input={(e)=>{convertTime('femtosecond', e.target.value)}}>
              </div>
          </div>
          <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px;">
            <div style="flex: 1;">
                  <label for="attoseconds" style="padding-left: 100px;">Attoseconds:</label>
                  <div style="padding-left:100px">
                  <input type="number" class="form-control" style="background: white;" bind:value={attosecond} data-unit="attoseconds" on:input={(e)=>{convertTime('attosecond', e.target.value)}}>
                </div>
              </div>
          </div>
      </div>
  </div>
</div>
</div>
{/if}

{#if location}
<div class="container-fluid w-100 mt-1">
  <div id="location-converter" class="converter">
      <h6 class="text-center" style=" padding-right:100px">Location Units Converter</h6>
      <div class="row">
        <div class="col-md-6">
          <!-- Latitude (DMS) Fields -->
          <h1 style="text-align: center;font-weight:bold ; padding-right:100px">Latitude</h1>
            <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
                <div style="flex: 1;">
                    <label for="degreesLat">Degrees :</label>
                    <input type="number" class="form-control" style="background: white;" bind:value={degreesLat} step="any" on:input="{(e) => convertToOthers('degree_lat', e.target.value)}" />
                    <!-- <input type="number" class="form-control w-50" bind:value={degreesLat}  step="any" on:input={()=>{decimal_lat=true;degree_lat=false}}/> -->
                </div>
                <div style="flex: 1;">
                  <label for="minutesLat">(Minutes):</label>
                  <input type="number" class="form-control w-50" style="background: white;" bind:value={minutesLat}  step="any" on:input="{(e) => convertToOthers('degree_lat', e.target.value)}" />
              </div>
              <div style="flex: 1;">
                  <label for="secondsLat">(Seconds):</label>
                  <input type="number" class="form-control w-50" style="background: white;" bind:value={secondsLat}  step="any" on:input="{(e) => convertToOthers('degree_lat', e.target.value)}" />
              </div>
              <div style="flex: 1;">
                  <label for="decimalLat">(Decimal Degrees):</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={decimalLat} step="any"  on:input="{(e) => convertToOthers('decimal_lat', e.target.value)}"/>
              </div>
          </div>

          <h1 style="  padding-right:100px; text-align: center;font-weight:bold ">Longitude</h1>
          <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 30px;">
            <div style="flex: 1;">
                  <label for="degreesLon">(Degrees):</label>
                  <input type="number" class="form-control w-50" style="background: white;" bind:value={degreesLon} step="any" on:input="{(e) => convertToOthers('degree_lon', e.target.value)}" />
              </div>
              <div style="flex: 1;">
                  <label for="minutesLon">(Minutes):</label>
                  <input type="number" class="form-control w-50" style="background: white;" bind:value={minutesLon}  step="any" on:input="{(e) => convertToOthers('degree_lon', e.target.value)}" />
              </div>
              <div style="flex: 1;">
                  <label for="secondsLon">(Seconds):</label>
                  <input type="number" class="form-control w-50" style="background: white;" bind:value={secondsLon} step="any" on:input="{(e) => convertToOthers('degree_lon', e.target.value)}" />
              </div>
              <div style="flex: 1;">
                  <label for="decimalLon">(Decimal Degrees):</label>
                  <input type="number" class="form-control" style="background: white;" bind:value={decimalLon} step="any" on:input="{(e) => convertToOthers('decimal_lon', e.target.value)}" />
              </div>
          </div>

          <!-- <div class="col-md-6 w-50">
              <div class="form-group">
                  <label for="directionLat">Latitude Direction:</label>
                  <select class="form-control" bind:value={directionLat}>
                      <option value="N">N</option>
                      <option value="S">S</option>
                  </select>
              </div>
          </div>
          <div class="col-md-6 w-50">
              <div class="form-group">
                  <label for="directionLon">Longitude Direction:</label>
                  <select class="form-control" bind:value={directionLon}>
                      <option value="E">E</option>
                      <option value="W">W</option>
                  </select>
              </div>
          </div> -->

          <!-- Meters and Feet Fields -->
          <!-- <div class="col-md-6 w-50">
              <div class="form-group">
                  <label for="meters">Meters:</label>
                  <input type="number" class="form-control" bind:value={meters} step="any" on:input="{(e) =>{mtr_bool=true;ft_bool=false}}" />
              </div>
          </div>
          <div class="col-md-6 w-50">
              <div class="form-group">
                  <label for="feet">Feet:</label>
                  <input type="number" class="form-control" bind:value={feet} step="any" on:input="{(e) =>{ft_bool=true;mtr_bool=false;}}"/>
              </div>
          </div> -->
      </div>
  </div>
</div>
</div>

{/if}
{#if distance}
<div class="container-fluid w-100">
  <h6 class="text-center" style="color: #2c8a97;  padding-right:100px">Distance Units Converter</h6>
  <div class="row">
    <!-- Metric Units -->
    <div class="col-md-6">
        <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px; margin-bottom: 10px;">
        <div style="flex: 1;">
        <label for="millimeters" style="color: #2c8a97;">Millimeters (mm):</label>
        <input type="number" class="form-control" id="millimeters" style="background: white;" bind:value={mm} on:input="{(e) => convertToOthers('mm', e.target.value)}">
      </div>
   
      <div style="flex: 1;">
        <label for="centimeters" style="color: #2c8a97;">Centimeters (cm):</label>
        <input type="number" class="form-control" id="centimeters" style="background: white;" bind:value={cm} on:input="{(e) => convertToOthers('cm', e.target.value)}">
      </div>
    </div>
    <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
        <div style="flex: 1;">
        <label for="meters" style="color: #2c8a97;">Meters (m):</label>
        <input type="number" class="form-control" id="meters" style="background: white;" bind:value={meters} on:input="{(e) => convertToOthers('meter', e.target.value)}">
      </div>
      <div style="flex: 1;">
        <label for="kilometers" style="color: #2c8a97;">Kilometers (km):</label>
        <input type="number" class="form-control" id="kilometers" style="background: white;" bind:value={km} on:input="{(e) => convertToOthers('km', e.target.value)}">
      </div>
    </div>
    <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
        <div style="flex: 1;">
        <label for="nautical-miles" style="color: #2c8a97;">Nautical Miles (nmi):</label>
        <input type="number" class="form-control" id="nautical-miles" style="background: white;" bind:value={nm} on:input="{(e) => convertToOthers('nm', e.target.value)}">
      </div>
      <div style="flex: 1;">
        <label for="inches" style="color: #2c8a97;">Inches (in):</label>
        <input type="number" class="form-control" id="inches" style="background: white;" bind:value={inches} on:input="{(e) => convertToOthers('inch', e.target.value)}">
      </div>
    </div>
    <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 10px;">
        <div style="flex: 1;">
        <label for="feet" style="color: #2c8a97;">Feet (ft):</label>
        <input type="number" class="form-control" id="feet" style="background: white;" bind:value={feet} on:input="{(e) => convertToOthers('feet', e.target.value)}">
      </div>
      <div style="flex: 1;">
        <label for="yards" style="color: #2c8a97;">Yards (yd):</label>
        <input type="number" class="form-control" id="yards" style="background: white;" bind:value={yards} on:input="{(e) => convertToOthers('yard', e.target.value)}">
      </div>
    </div>
    <div class="form-group" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 10px; margin-bottom: 30px;">
        <div style="flex: 1;">
        <label for="miles" style="color: #2c8a97;">Miles (mi):</label>
        <input type="number" class="form-control" id="miles" style="background: white;" bind:value={miles} on:input="{(e) => convertToOthers('mile', e.target.value)}">
      </div>
      <div style="flex: 1;">
        <label for="fathoms" style="color: #2c8a97;">Fathoms:</label>
        <input type="number" class="form-control" id="fathoms" style="background: white;" bind:value={fathoms} on:input="{(e) => convertToOthers('fathom', e.target.value)}">
      </div>
    </div>
  </div>
</div>
</div>
{/if}
</div>
{/if}
<style>	
 .container-fluid {
  display: flex; 
  flex-direction: column;  
  justify-content: center; 
  padding-left: 100px;
  
}

.form-group {
  margin-bottom: 5px;
}

.form-group label {
  font-weight: bold;
  font-size: 1rem;
  display: block;
  margin-bottom: 5px;
}

.form-control {
  border: 1px solid #2c8a97;
  border-radius: 5px;
  padding: 5px;
  font-size: 18px;
  box-shadow: none;
  width: 75%;
  font-family: Inter, sans-serif;
  
}

.form-control:focus {
  border-color: #2c8a97;
  box-shadow: 0 0 0 0.2rem rgba(44, 138, 151, 0.25);
}

.row {
  margin-top: 5px;
}

.col-md-6 {
  margin-bottom: 5px;
}

h6 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.container-fluid h6 {
  color: #2c8a97;
}
label {
    color: #2c8a97;
}
td{
  color: #2c8a97;
  font-weight: bold;
}
output{
  color: #000000;
  text-align: center;
  margin-left:10px;
}


</style>
