<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import maplibregl, { Map, NavigationControl, Marker } from 'maplibre-gl';
    import syncMaps from '@mapbox/mapbox-gl-sync-move';
    import '@/assets/styles/maplibre-gl-compare.css';
    export let map, compareOn;
    let container;
    let verticalSlider = true;
    let pos = 642;
    let left = 300;
    let top = 50;
    let height = 0;
      let moving = false;
    let availableLeftlayers = [{id:0, title: 'Vector map', layer:'AllVectors', style: 'default_new'}, {id:1, title: 'TTRM', layer:'TTRM', style: 'ttrm'}, {id:2, title: 'Raster map', layer: 'Mapsheets', style: 'mapsheets'}, {id:3, title: 'OSM', layer:'OSM', style: 'osm'}, {id:4, title: 'Satellite', layer:'SatelliteImagery', style: 'gsat'}, {id:5, title: 'FCM_2021', layer:'FCM_2021', style: 'fcm2021'}, {id:6, title: 'FCM_2019', layer:'FCM_2019', style: 'fcm2019'}, {id:7, title: 'FCM_2017', layer:'FCM_2017', style: 'fcm2017'}];
    let availableRtlayers = availableLeftlayers;
    let selectedLeftlayer = availableLeftlayers[0];
    let selectedRtlayer = availableLeftlayers[2];
    let initialize = false, leftMap:any, rightMap:any, itr = 0;
  $:
    if (initialize && leftMap) {
      leftMap.setStyle(`/assets/configs/${availableLeftlayers[selectedLeftlayer.id].style}.json`);
      rightMap.setStyle(`/assets/configs/${availableLeftlayers[selectedRtlayer.id].style}.json`);
      // availableRtlayers = [];
      // availableLeftlayers.forEach(item=> {
      //   if (item.title!==selectedLeftlayer.title) {
      //     availableRtlayers.push(item);
      //   }
      // })
      if (rightMap.getLayer(selectedRtlayer.layer)) {
        availableRtlayers.forEach(item=> {
          if (item.title!==selectedRtlayer.title) {
            if (item.layer!=='AllVectors') rightMap.setLayoutProperty(item.layer, 'visibility', 'none');
            // availableRtlayers.push(item);
          } else {
            // rightMap.setStyle(selectedRtlayer.style);
            rightMap.setLayoutProperty(item.layer, 'visibility', 'visible');
          }
        })
      }
    }
      function onMouseDown() {
          moving = true;
      }
      
      function onMouseMove(e) {
          if (moving) {
              // left += e.movementX;
              // top += e.movementY;
        if (verticalSlider) {
          pos = e.clientX;
        } else {
          left = e.clientY
        }
          }
      }
      
      function onMouseUp() {
          moving = false;
      }
  
    onMount(() => {
        leftMap = new Map({
          container: "left",
          style: 'https://demotiles.maplibre.org/style.json',
          center: [72.25, 24.50],
          zoom: 12,
        });
  
        rightMap = new Map({
          container: "right",
          style: 'https://maputnik.github.io/osm-liberty/style.json ',
          center: [72.25, 24.50],
          zoom: 12,
        });
        syncMaps(leftMap, rightMap);
        height = screen.height;
        // rightMap.addControl(new NavigationControl(), 'top-right');
        // leftMap.addControl(new maplibregl.ScaleControl({
        //   // maxWidth: 80,
        //   // unit: 'imperial'
        //   unit: 'metric'
        // }));
        initialize = true;
    });
  
  </script>
  {#if compareOn}
  <div style="position: absolute; z-index: 2; top: 0px; left: calc(50% - 110px); text-align: center; padding: 0px; background: rgba(127,127,127,0.9); color: white;">
    <!-- <h4 style='text-align: center;'>Comparison</h4> -->
    <div class='d-flex justify-content-between gx-2'>
      <div class='p-1'>
        <div class='m-2'><lebel>Left Layer</lebel></div>
        <select id="color" name="color" bind:value={selectedLeftlayer} style="background: transparent; color: white">
          {#each availableLeftlayers as item}
            <option class="opt" value={item}>{item.title}</option>
          {/each}
        </select>
      </div>
      <div class='p-1'>
        {#if availableRtlayers.length>0}
        <div class='m-2'><lebel>Right Layer</lebel></div>
        <select id="color" name="color" bind:value={selectedRtlayer} style="background: transparent; color: white">
          {#each availableRtlayers as item}
            <option class="opt" value={item}>{item.title}</option>
          {/each}
        </select>
        {/if}
      </div>
    </div>
  </div>
  {/if}
  <div class="map-wrap">
      <div id="comparison-container" bind:this={container}>
        <div id="left" class="map mapboxgl-map" style="clip: rect(0px, {pos}px, {height}px, 0px);">
          <div class="d-flex justify-content-start" style="position:relative; z-index: 2; margin-left: 10px">
            <!-- <h5>{selectedLeftlayer.title}</h5> -->
          </div>
        </div>
        <div id="right" class="map mapboxgl-map" style="clip: rect(0px, 999em, {height}px, {pos}px);">
          <div class="d-flex justify-content-end" style="position:relative; z-index: 2; margin-right: 50px;">
            <!-- <h5>{selectedRtlayer.title}</h5> -->
          </div>
        </div>
      </div>
      <div class="maplibregl-compare" on:mousedown={onMouseDown} style="left: {pos}px; top: {top}px;"><div class="{verticalSlider ? 'compare-swiper-vertical' : 'compare-swiper-horizontal'}"><slot></slot></div></div>
  </div>
  <svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />
  
  <style>
    .map-wrap {
      position: relative;
      width: 100%;
      height: 100vh; 
    }
    
    .map, #comparison-container{
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .maplibregl-compare {
      position: absolute;
      left: calc(50% - 0px);
      scale: 0.6;
    }
    .opt {
      background: gray; color: white
    }
  </style>
    