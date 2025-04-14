
<svelte:head>
	<title>Airport Authority of India</title>
    <meta name="description" content="Maplibre Globe" />
</svelte:head>
<script  lang="ts">
	import { onMount } from "svelte";
	import maplibregl, { Style } from "maplibre-gl";
	// import 'maplibre-gl/dist/maplibre-gl.css';
	import '@/assets/styles/maplibre-gl.css';
	import pkg from "maplibre-gl";
	const { Map } = pkg;

	// import { GeoGrid } from 'geogrid-maplibre-gl';
	import { GeoGrid } from '@/assets/styles/geogrid-maplibre-gl';
	import MinimapControl from "maplibregl-minimap";
	// import MaplibreCOGProtocol from '@/assets/js/cogprotocol'
	import {cogProtocol} from '@geomatico/maplibre-cog-protocol';

	import initGdalJs from 'gdal3.js';

	import { authenticated, logout, onRefresh } from '@/stores/auth';
    import * as Dialog from "$lib/components/ui/dialog";



	
	
	// import GlobeLoaderGif from '@/assets/images/loading.webp';
	import GlobeLoaderGif from '@/assets/images/globeloader.gif';
	import GraticlesSvg from '@/assets/images/graticules.svg';
	import lockSvg from '@/assets/images/lock.svg';
	import unlockSvg from '@/assets/images/unlock.svg';
	import compareSvg from '@/assets/images/compare.svg';
	import insetPng from '@/assets/images/inset.png';
    import arpPng from "@/assets/images/arp.png";
    import featinfoSvg from "@/assets/images/info.svg";



	import SideBar from '../pages/sidebar/+page.svelte';
	import MapFooter from '../pages/mapfooter/+page.svelte';

	import Compare from '../pages/compare/+page.svelte';
	import Navbar from '../pages/navbar/+page.svelte';
	import UtilPage from '../pages/utilities/+page.svelte';
	import Tool from '@/assets/images/tool.png';

	import ttrmIcon from "@/assets/images/ttrm.png";
	import osmIcon from "@/assets/images/osm.png";
	import sateIcon from "@/assets/images/imagery.png";
	import ksTextureIcon from "@/assets/images/kstexture.png";
	import rasterIcon from "@/assets/images/dsm.png";
	import whiteIcon from "@/assets/images/nobasemap.png";

	

	// import { MaplibreMeasureControl } from '@watergis/maplibre-gl-terradraw'

	import {
		initialState,
		defaultMapStyle,
		defaultMapStyle2,
		curMap,
		drawControl,
		terrainControl,
		navigateControl,
		ScaleBar,
		gridDegree,
		gridMillion,
		compass,
		servers,
		legendControl
	} from "$lib/stores/common";
	
	let map: any , map2:any,curZoom: any;
	const mapStyle = $defaultMapStyle;
	const mapStyle2 = $defaultMapStyle2;
	let curMouseLoc:any = [initialState.lng, initialState.lat];
	let clickedbtn=false;
	let isLoading=false;
	let geogrid:any;
	let gridOn=false;
	let MiniMapOn=false;
	let compareOn=false;
	let viewLock=true;
	let featInfoOn=false;

	const miniMap=new MinimapControl({
  id: "myCustomMiniMap",
  width: "200px",
  height: "200px",
  zoomLevelOffset: 6,
  interactions: { drag: true, zoom: false },
  initialMinimized: false,
  minimizableMinimap: true,
  collapsedWidth: "30px",
  collapsedHeight: "30px",
  borderRadius: "5px",
})
let filePath:any;
let Onclickfeatures:any =[];
let rasterCOG:any=[];



let baseLayers = [
		{ id: 0, title: "True Terrain Relief Map", icon: ttrmIcon },
		{ id: 1, title: "Satellite Imagery", icon: sateIcon },
		{ id: 2, title: "No Basemap",  icon: whiteIcon },


		// { id: 1, title: "KS map", icon: osmIcon},
		// { id: 3, title: "KS Texture",  icon: ksTextureIcon},
		// { id: 4, title: "RasterDSM",  icon: rasterIcon},
		// { id: 5, title: "No Basemap",  icon: whiteIcon },
		// { id: 6, title: "COG",  icon: whiteIcon },
	];
	
	onMount(async () => {
		if(!$authenticated)onRefresh();
		isLoading=true;
		map = new Map({
			container: "map",
			style: '',
			center: [curMouseLoc[0], curMouseLoc[1]],
			zoom: initialState.zoom,
			
			maxBounds: [
				new maplibregl.LngLat(50.0, -4.0),
				new maplibregl.LngLat(120.0, 45.0),
			],
		});
	
		maplibregl.addProtocol('cog', cogProtocol);
		fetchfile();
 
	
		if (mapStyle2) {
			map.setStyle(mapStyle2);
			
		}
	
		map.on("load", function () {
		$curMap=map;
		// map.getCanvas().style.cursor = "wait"; 

		map.setTerrain('');
		map.addControl($navigateControl);
		map.addControl($terrainControl);
		map.addControl($drawControl, 'top-right');
		map.addControl($ScaleBar,'bottom-right');
		// map.addControl($compass, 'bottom-right');
		map.addControl($legendControl, 'bottom-right');



		
		// map.addControl($gridDegree);
		// map.addControl($gridMillion);

		// geogrid=new GeoGrid({ map,
		// 	gridStyle: {
        // 	color: 'rgba(255, 255, 255, 0.5)',
       	// 	width: 2,
		// 	},
		// 	labelStyle: {
		// 		color: 'rgba(255, 255, 255, 1)',
		// 		textShadow: '0 0 10px rgba(0, 0, 0)',
		// 	}
		//  });

		isLoading=false;

		function mouseStopped(e: any): any {
      if (!map) return;
      curZoom = parseInt(map.getZoom());
	//   console.log(map.getZoom())
      // curZoom = map.getZoom();
      curMouseLoc = [e.lngLat.lng, e.lngLat.lat];
    
		}
		map.on("mousemove", async (e: any) => {
			const timer = setTimeout(mouseStopped(e), 500);
		});
	});

	let image = await map.loadImage(arpPng);
if (!map.getImage('arp')) map.addImage('arp', image.data);

map.addLayer({
  "id": "ARP",
  "type": "symbol",
  "source": "airport_location",
  "source-layer": "default",
  "minzoom": 0,
  "maxzoom": 0,
  "layout": {
    "icon-image": 'arp',
    "icon-size": 0.40,
    // "text-field": "{airport}",
    // "text-font": ["ksregular"],
    // "text-size": 8,
    // "text-offset": [0, 2],
    // "text-allow-overlap": true
  },
  "paint": {
    "text-color": "rgb(0,0,0)",
    "text-halo-color": "rgb(255,255,255)",
    "text-halo-width": 2
  }
});

const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on('mouseenter', 'ARP', (e) => {
  // Get the first feature from the event
  const feature = e.features[0];
  
  if (feature && feature.properties) {
    const airportName = feature.properties.airport;

    // Set the popup HTML
    popup
      .setHTML(`<strong>Airport Name:</strong>${airportName}`)
      .setLngLat(e.lngLat) // Position popup at the mouse location
      .addTo(map);

    // Change the cursor to a pointer
    map.getCanvas().style.cursor = 'pointer';
	// Add custom class or modify style directly
  }
popup.getElement().querySelector('.maplibregl-popup-content').style.padding = '5px';

});

map.on('mouseleave', 'ARP', () => {
  // Remove the popup
  popup.remove();

  // Reset the cursor
  map.getCanvas().style.cursor = '';
});

map.on('click', 'ARP', (e) => {
  // Get the first feature from the event
  const feature = e.features[0];

  if (feature && feature.geometry) {
    const coordinates = feature.geometry.coordinates;
    
    // Zoom to the clicked feature (marker)
    map.flyTo({
      center: coordinates, // Coordinates of the feature
      zoom: 12, // Set the zoom level you want (adjust as necessary)
    //   speed: 0.5, // Optional: controls the speed of the zoom animation
      curve: 1, // Optional: controls the curve of the zoom animation
    //   easing(t) {
    //     return t; // Optional: customize easing function for the zoom
    //   }
    });
  }
});




	})







	let showMore = false;
	let activeBaseLayer = 0;
	function chngBaseLayer(id: any) {
		activeBaseLayer = id;
		const style = map.getStyle();
		// console.log(style)
		if (id === 0) {
			map.setLayoutProperty("ttrm", "visibility", "visible");
			map.setLayoutProperty("SatelliteImagery", "visibility", "none");
			map.setLayoutProperty("background", "visibility", "none");


		} else if (id === 1) {
			map.setLayoutProperty("ttrm", "visibility", "none");
			map.setLayoutProperty("SatelliteImagery", "visibility", "visible");
			map.setLayoutProperty("background", "visibility", "none");

		} 
		else if (id === 2) {
			map.setLayoutProperty("ttrm", "visibility", "none");
			map.setLayoutProperty("SatelliteImagery", "visibility", "none");
			map.setLayoutProperty("background", "visibility", "visible");
		} 
	}


	function addGrid() {
    // Toggle the gridOn flag
    gridOn = !gridOn;

    // Check if the map is initialized and the grid is toggled on
    if (map) {
        if (gridOn) {
            // Create and add the grid if it's not already added
            if (!geogrid) {
                geogrid = new GeoGrid({
                    map: map,
                    gridStyle: {
                        color: 'rgba(0, 0, 0, 1)',
                        width: 1,
                    },
                    labelStyle: {
                        color: 'rgba(0, 0, 0, 1)',
						fontSize: '96'
                        // textShadow: '0 0 10px rgba(0, 0, 0)',
                    }
                });
            }
            geogrid.add(); // Add the grid to the map
        } else {
            // Remove the grid if it's currently visible
            if (geogrid) {
                geogrid.remove();
				geogrid='' // Remove the grid from the map
            }
        }
    }
}
function addMiniMap() {
    // Toggle the gridOn flag
    MiniMapOn = !MiniMapOn;

    // Check if the map is initialized and the grid is toggled on
    if (map) {
        if (MiniMapOn) {
			map.addControl(miniMap);
		} else{
			map.removeControl(miniMap);
		}
}}


	 function changestyle()	{
		clickedbtn=!clickedbtn;
		if(clickedbtn){
			map.setStyle(mapStyle2)		
		}else{
			map.setStyle(mapStyle) 
		}
	 }

	 function createFN(){
		let feats=$drawControl.getFeatures();
		console.log(feats)
	 }


	function setProj(){
		// map.setPitch(0);  // Reset pitch to 0 (flat view)
		map.setBearing(0);// Reset bearing to 0 (north-up orientation)
	}

	let bearingVal=0;
	function plusBearing(){
		bearingVal= bearingVal + 1;
		 map.setPitch(0); 
		map.setBearing(bearingVal);
	}
	function minusBearing(){
		bearingVal= bearingVal - 1;
		map.setPitch(0); 
		map.setBearing(bearingVal);

	}

	async function fetchfile(){
      let  filesResponse:any;
               filesResponse= await fetch(`${servers.server}/api/fetchCOG`, {
                      method: 'get'
                  });    
            if (filesResponse.ok) {
				rasterCOG= await filesResponse.json()
                console.log('Files fetched successfully',rasterCOG);

            } else {
                console.error('Error fetching files:',filesResponse.statusText);
            }
    }
	function loadCog() {
		rasterCOG.forEach((CogNameWithoutTif:any) => {
			const CogName = CogNameWithoutTif.replace('.tif', '');
        // Check if source already exists to prevent re-adding
        if (!map.getSource(CogName)) {
            // Add a source for each .tif file
            map.addSource(CogName, {
                type: 'raster',
                url: `cog://http://localhost:9000/getdata/cog/${CogName}.tif`,
                tileSize: 256,
                minzoom: 0
            });
            
            // Add a corresponding layer for each source
            map.addLayer({
                id: `cog_${CogName}`,
                source: CogName,
                type: 'raster',
                minzoom: 0,
                layout: {
                    visibility: 'visible' // Initially hide the layer
                }
            });
        }
    });
}

async function mapviewLock(){
	viewLock=!viewLock;
	if (!viewLock) {
				await map.setMaxBounds(null);
			} else {
				await map.setMaxBounds([new maplibregl.LngLat(50.0, -4.0),
				new maplibregl.LngLat(120.0, 45.0)]);
			}
}

async function featInfo(){
	featInfoOn=!featInfoOn;
	map.on('click', (e) => {
		if(!featInfoOn)return; 
		Onclickfeatures = map.queryRenderedFeatures(e.point, {  

		    });
		 if (Onclickfeatures.length > 0) {
			 console.log(Onclickfeatures)
	   } else {
		 Onclickfeatures = [];
	   }
		 
	 });
}

</script>
<!-- <div class="loader {isLoading ? 'show' : 'hide'}" style="background:rgb(231,225,215);	height:100%;width:100%">
<img class="loader {isLoading ? 'show' : 'hide'}" src={GlobeLoaderGif} alt="Loading..."  />
</div> -->
<div id="map"></div>
<Navbar />


{#if map}
<!-- <div  style="position:absolute;top:10px;right:100px;display:display">
<select class="form-control text-center"  id="converter-select" bind:value={selectedFile} on:change="{(e) => loadCog(e.target.value)}" >
	<option value="" disabled selected>Select a file</option>
	{#each tifFiles as tif}
	  <option value={tif}>{tif}</option>
	{/each}
  </select>
</div> -->
<!-- <div class="maplibregl-ctrl-top-right " style="right:40px;position:absolute;display: flex; flex-direction: row;"> -->
	<!-- <div class="maplibregl-ctrl maplibregl-ctrl-group" style="display: flex; flex-direction: row;" > -->



	<div style="position:absolute ;top:560px; right:10px;"  class="maplibregl-ctrl-group maplibregl-ctrl">
		<div style="width:{showMore === true ? `${baseLayers.length * 35}px` : '30px'};height:30px">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="d-flex justify-content-start" on:mouseover={() => { showMore = true; }} on:mouseout={() => { showMore = false; }} on:focus={() => { showMore = true;}} on:blur={() => {showMore = false;}}>
				{#each baseLayers as layer, i (i)}
					{#if i === activeBaseLayer}
						<button id="btnadd{layer.id}" style="display: inline-block;" title={layer.title} on:click={() => chngBaseLayer(i)} >
							<img style="padding: 3px;" width="35px" src={layer.icon} alt="" />
							</button>
						<!-- <Tooltip target='btnadd' placement='bottom'>{layer.title}</Tooltip> -->
					{:else}
						<button id="btnadd{layer.id}" title={layer.title} style="display: {showMore === true ? 'inline-block': 'none'};" on:click={() => chngBaseLayer(i)} >
							<div style="padding: 3px;">
						<img width="35px" src={layer.icon} alt="" />
						</div>
						</button>
						<!-- <Tooltip target='btnadd' placement='bottom'>{layer.title}</Tooltip> -->
					{/if}
				{/each}
			</div>
		</div>
	</div>
		<div class="button-container">
			<!-- Circle button wrapped with Dialog.Trigger -->
			<Dialog.Root closeOnOutsideClick={false}>
			  <Dialog.Trigger>
				<button class="circle-btn" title="Tools">
				  <span class="circle-btn-icon"><img src={Tool} alt="" style="width: 20px; height: 20px; filter:invert(1)" ></span> <!-- Icon for the button -->
				  <span class="button-name">Tool</span> <!-- Hidden text initially -->
				</button>
			  </Dialog.Trigger>
			  
			  <!-- Dialog content -->
			  <Dialog.Content class="fixed left-[62%] top-[50%] z-50 max-w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl p-0 mx-auto max-h-screen overflow-y-auto">
				<Dialog.Header>
				  <Dialog.Title style="color:black">Conversion Utilities</Dialog.Title>
				</Dialog.Header>
				<div>
				  <UtilPage />
				</div>
			  </Dialog.Content>
			</Dialog.Root>
		  </div>
		
	<div class="maplibregl-ctrl-bottom-right " style="position:absolute;top:240px">
	<div class="maplibregl-ctrl maplibregl-ctrl-group" >
	<button on:click={()=>{changestyle()}} class="maplibregl-ctrl-globe-enabled" type="button" title={!clickedbtn ? 'Disable Globe':'Enable Globe'} >
		<!-- <span class="maplibregl-ctrl-icon" aria-hidden="true"></span> -->
		 <img style="filter: invert(1); padding:5px" src={GraticlesSvg} alt="">

	</button>
	<button class="maplibregl-ctrl-globe-enabled" type="button" title={!gridOn? 'Show Grids' : 'Grids Off'} on:click={()=>{ addGrid()}}><span class="maplibregl-ctrl-icon" aria-hidden="true"></span></button>
	<!-- <button  on:click={()=>{ setProj()}}></button> -->
	<button on:click={() => {loadCog()}}><span style="font-size: 10px;">COG</span></button>
	<button  on:click={()=>{ addMiniMap()}} title='Inset Map'><img style="padding:5px" src={insetPng} alt=""></button>
	<button  on:click={()=>{ compareOn=!compareOn}} title='Compare Maps'><img style="padding:5px" src={compareSvg} alt=""></button>
	<button  on:click={()=>{featInfo() }} title={featInfoOn? 'Feature Info Off' : 'Feature Info On'}><img style="filter: invert(1);padding:5px" src={featinfoSvg} alt=""></button>
	<button  on:click={()=>{mapviewLock() }} title={viewLock? 'Unlock View' : 'Lock View'}><img style="padding:5px" src={viewLock? unlockSvg: lockSvg } alt=""></button>
	<button  on:click={()=>{plusBearing() }} title={viewLock? 'Unlock View' : 'Lock View'}>+</button>
	<button  on:click={()=>{minusBearing() }} title={viewLock? 'Unlock View' : 'Lock View'}>-</button>

	<!-- <button  on:click={()=>{ loadCog()}}>Copy</button> -->


	</div>
	
	
</div>
{#if Onclickfeatures.length != 0 && featInfoOn}
<div style="position: absolute;height:200px;width:200px;bottom:40px;background:rgba(17, 24, 39, 0.75);right:60px">
	<h1 class="center-heading" style="font-size: 16px;">Feature Name:  <span style="color:white;font-size:12px"> {Onclickfeatures[0].properties.feature_code} </span></h1>
	<h1 class="center-heading" style="font-size: 16px;">Within:  <span style="color:white;font-size:12px"> {Onclickfeatures[0].properties.within} </span></h1>

</div>
{/if}

{#if compareOn}
<Compare 
bind:map
bind:compareOn />
{/if}

<SideBar />
<MapFooter bind:curMouseLoc/>
<!-- <div style="width:40px" class="maplibregl-ctrl maplibregl-ctrl-group">
	<button  on:click={()=>{createFN()}}></button>
</div> -->
{/if}
<!-- <div class="loader {isLoading ? 'show' : 'hide'}"></div>  -->


<style>	

/* Apply padding to the content inside the popup */
/* .maplibregl-popup .maplibregl-popup-content {
  padding: 5px !important;
} */


	.loader {
    display: block;
    position: absolute;
    left: 50vw;
    top: 50vh;
    width: auto;
	height: auto;
    transform: translate(-50%, -50%);
	z-index: 999;
  }

      .loader.show {
          display: block; /* Show the loader when isLoading is true */
        }

        .loader.hide {
          display: none; /* Hide the loader when isLoading is false */
      }

	#map {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: #000;
	
	}
	.button-container {
    display: inline-block;
    margin: 10px;
	position: absolute;
    right: 0%;
    top: 21%;
  }

  /* Circle button styling */
  .circle-btn {
    width: 30px;
    height: 30px;
    background:rgb(32,38,47,1); 
	color:white;
    border-radius: 50%;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    overflow: hidden; /* Ensures the content fits when transitioning */
    transition: all 0.4s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* The icon inside the circle (could be a letter or icon) */
  .circle-btn-icon {
    font-size: 18px;
    font-weight: bold;
    z-index: 1; /* Make sure the icon stays above the text */
  }

  /* The button name that will be revealed on hover */
  .button-name {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0s 0.3s;
    color: white;
    font-size: 14px;
    padding: 0 10px;
    text-align: center;
    z-index: 0; /* Make sure the text appears below the icon initially */
  }

  /* Hover effect to transform the circle to a rectangle and show the name */
  .circle-btn:hover {
    width: 100px;
    height: 30px;
    border-radius: 20px; /* Slight rounded corners */
  }

  .circle-btn:hover .circle-btn-icon {
    opacity: 0; /* Hide the icon when transitioning */
  }

  .circle-btn:hover .button-name {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease, visibility 0s;
  }
	
	
</style>
