<script lang="ts">
	import { onMount } from "svelte";
  import {
		curMap,
	} from "$lib/stores/common";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import closefolder from '@/assets/images/closefolder.png';
  import openfolder from '@/assets/images/openfolder.png';
  import Search from '@/assets/images/search.png';

	let map:any, mapstyles:any; 
  let aaifeatsLayers:any = [];



  
	onMount(async() => {
    map=$curMap;
    mapstyles = map.getStyle();
    await loadAaiFeats();
		})
    
async function loadAaiFeats(){
  mapstyles.layers.forEach(layer => {
    // Check if the layer's source is "aaifeats"
    if (layer.source === "aaifeats") {
        aaifeatsLayers.push(layer);
    }
});
// console.log(aaifeatsLayers)
}



let isDropdownOpen = false;
  let isAeronauticalDropdownOpen = false;
  let isRAC_AAIDropdownOpen = false;
  let isVAC_AAIDropdownOpen = false;
  let isASD_PDropdownOpen = false;
  let isElevationDropdownOpen = false;
  let isHRImageryDropdownOpen = false;
  let isSD_RAWDropdownOpen = false;
  let isSD_ProcessedDropdownOpen = false;
  let isFinalMDDropdownOpen = false;
  let isAeronauticalChartsDropdownOpen = false;
  let selectedLink:any = null;
  let isMillionDropdownOpen = false;
  let is250KDropdownOpen = false;
  let activeCatalog = 'vector';
  let selectedLink1 = '';
  let isSidebarVisible = true; 

  // Toggle function to open/close the dropdown
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function AeronauticalDropdown() {
    isAeronauticalDropdownOpen = !isAeronauticalDropdownOpen;
  }

  function RAC_AAIDropdown() {
    isRAC_AAIDropdownOpen = !isRAC_AAIDropdownOpen;
  }

  function VAC_AAIDropdown() {
    isVAC_AAIDropdownOpen = !isVAC_AAIDropdownOpen;
  }

  function ASD_PDropdown() {
    isASD_PDropdownOpen = !isASD_PDropdownOpen;
  }

  function ElevationDropdown() {
    isElevationDropdownOpen = !isElevationDropdownOpen;
  }

  function HRImageryDropdown() {
    isHRImageryDropdownOpen = !isHRImageryDropdownOpen;
  }

  function SD_RAWDropdown() {
    isSD_RAWDropdownOpen = !isSD_RAWDropdownOpen;
  }

  function SD_ProcessedDropdown() {
    isSD_ProcessedDropdownOpen = !isSD_ProcessedDropdownOpen;
  }

  function FinalMDDropdown() {
    isFinalMDDropdownOpen = !isFinalMDDropdownOpen;
  }

  function AeronauticalChartsDropdown() {
    isAeronauticalChartsDropdownOpen = !isAeronauticalChartsDropdownOpen;
  }

  function toggleMillionDropdown() {
    isMillionDropdownOpen = !isMillionDropdownOpen;
  }

  function toggle250KDropdown() {
    is250KDropdownOpen = !is250KDropdownOpen;
  }

  function selectLink(link) {
    selectedLink = link;
  }



function millionoption1(linkName) {
  selectedLink1 = linkName;
  
}

function millionoption2(linkName) {
  selectedLink1 = linkName;
 
}

function millionoption3(linkName) {
  selectedLink1 = linkName;
  
}

function millionoption4(linkName) {
  selectedLink1 = linkName;
  
}

function iconClickHandler() {
 
}

function option1_250K(linkName) {
  selectedLink1 = linkName;
  
}

// Function to set the active catalog when a button is clicked
  function selectCatalog(catalogType) {
    activeCatalog = catalogType;
    isSidebarVisible = true;
  }

  function toggleSidebar() {
    isSidebarVisible = !isSidebarVisible; // Hide the sidebar when My Data is clicked
  }



</script>



<div>
  <header class="Explore_Header" style="display: flex; flex-direction:row; justify-content:space-between">
    <div class="Explore_Header_button">
    <button class="explore-button" class:selected={activeCatalog === 'vector'}  on:click={() => selectCatalog('vector')}>Data Catalog</button>
    <button class="explore-button" class:selected={activeCatalog === 'raster'} on:click={() => selectCatalog('raster')}>My Data</button> 
  </div>

  <div class="Explore_Header_search" style="position: relative; display: flex; align-items: center;">
    <img style="position: absolute; left: 10px; width: 20px; height: 20px;" src="{Search}" alt="Search Icon">
    <input type="text" id="search" class="w-full p-1 bg-[rgba(255,255,255)] text-black rounded-md border-2 border-gray pl-8" placeholder="Search Airport"/>
</div>
  <!-- <div style="position: relative; display: flex; align-items: center;margin-bottom:10px" >
    <img style=" width: 20px; height: 20px; position: absolute; left: 10px;" src={Search} alt="">
    <input id="search" type="text" name="search" placeholder="Search Airport" autocomplete="off" bind:value={airportName} style=" background-color:white;" on:input={()=>{searchAirport()}}>
</div> -->
  </header>

  <div class="flex h-[70vh]">
    <!-- Sidebar -->
    {#if isSidebarVisible}
    <aside class = "sidebar" style="overflow-y: auto;">
      <!-- Search Bar -->
      <div class="mb-2" style="position: relative; display: flex; align-items: center;">
        <img style="position: absolute; left: 10px; width: 20px; height: 20px;" src="{Search}" alt="Search Icon">
        <input type="text" id="search" class="w-full p-2 bg-[rgba(255,255,255)] text-black rounded-md  pl-8" placeholder="Search the Catalog"/>
    </div>
      {#if activeCatalog === 'vector'}
      <!-- Dropdown list -->
      <ul >
        <li>
          <a href="#" on:click={() => { toggleMillionDropdown(); selectLink('million'); }}
             class={`million flex justify-between items-center ${selectedLink === 'million' ? 'selected' : ''}`}>
             <span style="display: flex; align-items:center; gap:5px">
              <img src={isMillionDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Raster Topographic Map-SOI</span>
            <span class="icon">{isMillionDropdownOpen ? "▲" : "▼"}</span>
          </a>
  
          <!-- Dropdown list for '1 Million' -->
          <ul id="millionoptions" class={isMillionDropdownOpen ? 'submenu open' : 'submenu'}>
            <li><a class={`option`}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>1:250,000 Scale</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
          </a></li>
            <li><a class={`option `}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
            </a></li>
            
          </ul>

          <li>
            <a href="#" on:click={() => { toggle250KDropdown(); selectLink('250K'); }}
              class={`million flex justify-between items-center ${selectedLink === '250K' ? 'selected' : ''}`}>
              <span style="display: flex; align-items:center; gap:5px">
                <img 
              src={is250KDropdownOpen ? openfolder : closefolder} 
              class="icon-img" 
              alt="" 
              style="width: 20px; height: 20px;"
            > 
            Vector Topographic Map-SOI</span>
             <span class="icon">{is250KDropdownOpen ? "▲" : "▼"}</span>
           </a>
           <ul id="millionoptions" class={is250KDropdownOpen ? 'submenu open' : 'submenu'}>
              <li><a class="option">
                <span style="cursor: pointer;" class="optiontext" on:click={(event) => option1_250K('Option1')}>1:250,000 Scale</span>
                <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
              </a>
              </li>
              <li><a class={`option`}>
                <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
                <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
              </a></li>
           </ul>
          </li>
      

        <li>
          <a href="#" on:click={()=> {AeronauticalDropdown(); selectLink('AeronauticalChart') }}
             class={`million flex justify-between items-center  ${selectedLink === 'AeronauticalChart' ? 'selected' : ''}`}>
             <span style="display: flex; align-items:center; gap:5px">
              <img src={isAeronauticalDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Raster Aeronautical Chart - SOI</span>
            <span class="icon">{isAeronauticalDropdownOpen ? "▲" : "▼"}</span>
          </a>
  
          <!-- Dropdown list for '1 Million' -->
          <ul id="millionoptions" class={isAeronauticalDropdownOpen ? 'submenu open' : 'submenu'}>
            <li><a class={`option`}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>1:250,000 Scale</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
          </a></li>
            <li><a class={`option `}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
            </a></li>
            
          </ul>


          <li>
            <a href="#" on:click={()=> {RAC_AAIDropdown(); selectLink('RAC_AAI') }}
               class={`million flex justify-between items-center  ${selectedLink === 'RAC_AAI' ? 'selected' : ''}`}>
               <span style="display: flex; align-items:center; gap:5px">
                <img src={isRAC_AAIDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Raster Aeronautical Chart - AAI</span>
              <span class="icon">{isRAC_AAIDropdownOpen ? "▲" : "▼"}</span>
            </a>
    
            <!-- Dropdown list for '1 Million' -->
            <ul id="millionoptions" class={isRAC_AAIDropdownOpen ? 'submenu open' : 'submenu'}>
              <li><a class={`option`}>
                <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>1:250,000 Scale</span>
                <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
            </a></li>
              <li><a class={`option `}>
                <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
                <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
              </a></li>
              
            </ul>

            <li>
              <a href="#" on:click={()=> {VAC_AAIDropdown(); selectLink('VAC_AAI') }}
                 class={`million flex justify-between items-center  ${selectedLink === 'VAC_AAI' ? 'selected' : ''}`}>
                 <span style="display: flex; align-items:center; gap:5px">
                  <img src={isVAC_AAIDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Vector Aeronautical Chart - AAI</span>
                <span class="icon">{isVAC_AAIDropdownOpen ? "▲" : "▼"}</span>
              </a>
      
              <!-- Dropdown list for '1 Million' -->
              <ul id="millionoptions" class={isVAC_AAIDropdownOpen ? 'submenu open' : 'submenu'}>
                <li><a class={`option`}>
                  <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>1:250,000 Scale</span>
                  <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
              </a></li>
                <li><a class={`option `}>
                  <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
                  <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
                </a></li>
                
              </ul>

              <li>
                <a href="#" on:click={()=> {ASD_PDropdown(); selectLink('ASD_P') }}
                   class={`million flex justify-between items-center  ${selectedLink === 'ASD_P' ? 'selected' : ''}`}>
                   <span style="display: flex; align-items:center; gap:5px">
                    <img src={isASD_PDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Airports Survey Data - Processed</span>
                  <span class="icon">{isASD_PDropdownOpen ? "▲" : "▼"}</span>
                </a>
        
                <!-- Dropdown list for '1 Million' -->
                <ul id="millionoptions" class={isASD_PDropdownOpen ? 'submenu open' : 'submenu'}>
                  <li><a class={`option`}>
                    <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>1:250,000 Scale</span>
                    <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
                </a></li>
                  <li><a class={`option `}>
                    <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
                    <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
                  </a></li>
                  
                </ul>

                <li>
                  <a href="#" on:click={()=> {ElevationDropdown(); selectLink('ElevationData') }}
                     class={`million flex justify-between items-center  ${selectedLink === 'ElevationData' ? 'selected' : ''}`}>
                     <span style="display: flex; align-items:center; gap:5px">
                      <img src={isElevationDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Elevation Data</span>
                    <span class="icon">{isElevationDropdownOpen ? "▲" : "▼"}</span>
                  </a>
          
                  <!-- Dropdown list for '1 Million' -->
                  <ul id="millionoptions" class={isElevationDropdownOpen ? 'submenu open' : 'submenu'}>
                    <li><a class={`option`}>
                      <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>1:250,000 Scale</span>
                      <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
                  </a></li>
                    <li><a class={`option `}>
                      <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
                      <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
                    </a></li>
                    
                  </ul>

                  <li>
                    <a href="#" on:click={()=> {HRImageryDropdown(); selectLink('HRImagery') }}
                       class={`million flex justify-between items-center  ${selectedLink === 'HRImagery' ? 'selected' : ''}`}>
                       <span style="display: flex; align-items:center; gap:5px">
                        <img src={isHRImageryDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">High Resolution Imagery</span>
                      <span class="icon">{isHRImageryDropdownOpen ? "▲" : "▼"}</span>
                    </a>
            
                    <!-- Dropdown list for '1 Million' -->
                    <ul id="millionoptions" class={isHRImageryDropdownOpen ? 'submenu open' : 'submenu'}>
                      <li><a class={`option`}>
                        <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>1:250,000 Scale</span>
                        <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
                    </a></li>
                      <li><a class={`option `}>
                        <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>1:50,000 Scale</span>
                        <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
                      </a></li>
                      
                    </ul>


                    

      </ul>
        {:else if activeCatalog === 'raster'}
        
        
            
<!-- Other Sidebar Content -->
<ul>
  <!-- Dropdown list -->
  <li>
    <a href="#" on:click={()=> {SD_RAWDropdown(); selectLink('SD_RAW') }}
       class={`million flex justify-between items-center  ${selectedLink === 'SD_RAW' ? 'selected' : ''}`}>
       <span style="display: flex; align-items:center; gap:5px">
        <img src={isSD_RAWDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Survey Data - RAW</span>
      <span class="icon">{isSD_RAWDropdownOpen ? "▲" : "▼"}</span>
    </a>

    <!-- Dropdown list for '1 Million' -->
    <ul id="millionoptions" class={isSD_RAWDropdownOpen ? 'submenu open' : 'submenu'}>
      <li><a class={`option`}>
        <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>DGPS Data</span>
        <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
    </a></li>
      <li><a class={`option `}>
        <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>TS Data</span>
        <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
      </a></li>
      
    </ul>

    <li>
      <a href="#" on:click={()=> {SD_ProcessedDropdown(); selectLink('SD_Processed') }}
         class={`million flex justify-between items-center  ${selectedLink === 'SD_Processed' ? 'selected' : ''}`}>
         <span style="display: flex; align-items:center; gap:5px">
          <img src={isSD_ProcessedDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Survey Data - Processed</span>
        <span class="icon">{isSD_ProcessedDropdownOpen ? "▲" : "▼"}</span>
      </a>

      <!-- Dropdown list for '1 Million' -->
      <ul id="millionoptions" class={isSD_ProcessedDropdownOpen ? 'submenu open' : 'submenu'}>
        <li><a class={`option`}>
          <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>DGPS Data</span>
          <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
      </a></li>
        <li><a class={`option `}>
          <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>TS Data</span>
          <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
        </a></li>
        
      </ul>

      <li>
        <a href="#" on:click={()=> {FinalMDDropdown(); selectLink('FinalMD') }}
           class={`million flex justify-between items-center  ${selectedLink === 'FinalMD' ? 'selected' : ''}`}>
           <span style="display: flex; align-items:center; gap:5px">
            <img src={isFinalMDDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Final Master Data</span>
          <span class="icon">{isFinalMDDropdownOpen ? "▲" : "▼"}</span>
        </a>
  
        <!-- Dropdown list for '1 Million' -->
        <ul id="millionoptions" class={isFinalMDDropdownOpen ? 'submenu open' : 'submenu'}>
          <li><a class={`option`}>
            <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>Final Master Table</span>
            <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
        </a></li>            
        </ul>
  
        <li>
          <a href="#" on:click={()=> {AeronauticalChartsDropdown(); selectLink('AeronauticalCharts') }}
             class={`million flex justify-between items-center  ${selectedLink === 'AeronauticalCharts' ? 'selected' : ''}`}>
             <span style="display: flex; align-items:center; gap:5px">
              <img src={isAeronauticalChartsDropdownOpen ? openfolder : closefolder} class="icon-img" alt="" style="width: 20px; height: 20px;">Aeronautical Charts</span>
            <span class="icon">{isAeronauticalChartsDropdownOpen ? "▲" : "▼"}</span>
          </a>
    
          <!-- Dropdown list for '1 Million' -->
          <ul id="millionoptions" class={isAeronauticalChartsDropdownOpen ? 'submenu open' : 'submenu'}>
            <li><a class={`option`}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>Airport Map(Base Map)</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
          </a></li>  
          <li><a class={`option `}>
            <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>Approach Chart for both Runway ends</span>
            <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
          </a></li> 
          <li><a class={`option `}>
            <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption3('Option3')}>Contour map (up to 900 m form threshold)</span>
            <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
          </a></li>  
          <li><a class={`option `}>
            <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption4('Option4')}> Objects of vertical significance around airport (20KM
              all around the ARP)</span>
            <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
          </a></li>        
          </ul>
    
   
    
    
  </ul>
          
      {/if}
  </aside>
  {/if}

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <!-- <h1 class="text-2xl font-bold mb-6">Main Content</h1> -->
      <!-- Conditionally Render Content Based on Active Catalog -->
      {#if  !isSidebarVisible}
      <!-- Show upload options when sidebar is hidden (My Data clicked) -->
      <!-- <div class="upload-links">
        <h1>Drag and drop a file here to view it locally on the map
          (it won’t be saved or uploaded to the internet)</h1>
        <p class="upload-linkr">
          <a class="uploadfiledata" href="#">Upload File Data</a>
          <a class="uploadwebdata" href="#">Upload Web Data</a>
        </p>
      
      </div> -->
      <div style="background-color: white;width:auto;text-align:center">
        <h1 class="text-2xl font-bold mb-6">Airport Layers</h1>
        {#each aaifeatsLayers as lyr, i (lyr.id)} 
        <Checkbox id="lyr{i}" bind:checked={lyr.checked} 
        onCheckedChange={(e) => {
                map.setLayoutProperty(`${lyr.id}`, "visibility", e ? 'none' : 'visible');
            }} 
        />
        <Label for="lyr{i}" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" 
            style="text-transform: capitalize">
            {lyr.id}
        </Label>
    {/each}
    
      </div>
    {:else if activeCatalog === 'vector'}
      <p style="color:black">This is the Data Catalog content.</p>
    {:else if activeCatalog === 'raster'}
      <p style="color:black">This is the My Data Catalog content.</p>
    {/if}
    </main>
  </div>
</div>







<style>	




  .Explore_Header {
    display: flex;
    gap: 10px;
    justify-content: start; /* This will space out the items */
    align-items: center; /* This ensures that the items are aligned vertically in the center */
    padding: 0px 12px 10px 12px; /* Add some padding to the header */
    border-bottom: 2px solid gray;
  }
  
  
  .Explore_Header .explore-button {
    padding: 8px 12px; /* Adds some padding to the button */
    cursor: pointer; /* Changes the cursor to a pointer when hovered */
    font-size: 14px; /* Sets a font size for the button */
    color: rgb(17, 24, 39);
      background: rgb(255, 255, 255);
      border: 2px solid rgb(209, 213, 219);
      outline: none;
      border-radius: 3px;
  }
  
  .Explore_Header .explore-button:focus,
  .Explore_Header .explore-button:active {
    border: 2px solid rgb(53, 167, 196); /* Change the border color when clicked */
   
  }
  
  /* Style for the selected button */
  .explore-button.selected {
    color: rgb(1, 1, 1);              
    background: rgb(255, 255, 255);
    border: 2px solid rgb(53, 167, 196);  /* Darker blue border */
    border-radius: 3px;         /* Optional: rounded corners */
  }
  
  /* Optional: Hover effect for selected button */
  .explore-button.selected:hover {
    border: 2px solid rgb(53, 167, 196);
  }
  
  
  .sidebar {
    width: 40%; /* This is equivalent to w-64 */
    background-color: rgb(246, 246, 247); /* Set the background color using RGB */
    padding: 10px; /* Equivalent to p-4 */
    color: white; /* Set the text color to white */
    border: 1px solid rgba(0, 0, 0, 0.1); /* Add a light border around the box */
    box-sizing: border-box; /* Ensures padding and border are included in the width/height calculation */
  }
  
  .upload-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh; /* Full viewport height to center content vertically */
    text-align: center; /* Center text inside the container */
  }
  
  .upload-links h1 {
    font-size: 1rem; /* Adjust the font size as needed */
    margin-bottom: 20px; /* Space between the heading and links */
  }
  
  .upload-links p {
    margin: 10px 0; /* Margin for each paragraph to give space between them */
  }
  
  .upload-linkr, .upload-link {
    margin-right: 20px;
    display: flex; /* Use flex to align text and icon */
      justify-content: space-between; /* Spread out the content */
      align-items: center; 
  }
  
  .upload-links .upload-link a, .upload-links .upload-linkr a {
    text-decoration: none;
    font-size: 16px;
    color: rgb(53, 167, 196);
    cursor: pointer;
    margin-right: 20px; /* Space between the links */
  }
  
  .upload-links .upload-link a:hover, .upload-links .upload-linkr a:hover {
    text-decoration: underline;
  }
  
  
   /* Style for the main link */
   .submenu {
      display: none;
      list-style-type: none;
      padding-left: 20px;
    }
  
    /* When submenu is open, display it */
    .submenu.open {
      display: block;
    }
  
    li {
      margin-bottom: 8px;
    }
  
    .topographic {
      position: relative;
      padding: 15px 40px;
      padding-left: 10px;
      padding-right: 0;
      min-height: 35px;
      cursor: pointer;
      font-size: .9rem;
      font-weight: 600;
      font-family: "Inter", sans-serif;
      color: rgb(0, 0, 0);
      background-color: rgba(0, 0, 0, 0);
      border-bottom: 1px solid #d1d5db;
      display: flex; /* Use flex to align text and icon */
      justify-content: space-between; /* Spread out the content */
      align-items: center; /* Align text and icon vertically */
    }
  
    
    .topographic:hover{
      color: rgb(255, 255, 255);
      background-color: rgb(53, 167, 196);
    }
    .selected {
      color: rgb(255, 255, 255);
      background-color: rgb(53, 167, 196);
      border-bottom: 3px solid rgb(195, 144, 249);
      border-right:  3px solid rgb(195, 144, 249);
      
    }
  
    .million{
      position: relative;
      padding: 13px 40px;
      padding-left: 10px;
      padding-right: 0;
      min-height: 35px;
      cursor: pointer;
      font-size: .9rem;
      font-weight: 600;
      font-family: "Inter", sans-serif;
      color: rgb(0, 0, 0);
      background-color: rgba(0, 0, 0, 0);
      border-bottom: 1px solid #d1d5db;
      display: flex; /* Use flex to align text and icon */
      justify-content: space-between; /* Spread out the content */
      align-items: center; /* Align text and icon vertically */
     
    }
  
    .million.selected{
      color: rgb(255, 255, 255);
      background-color: rgb(53, 167, 196);
      border-bottom: 3px solid rgb(195, 144, 249);
      border-right:  3px solid rgb(195, 144, 249);
    }
  
    .million:hover{
      color: rgb(255, 255, 255);
      background-color: rgb(53, 167, 196);
      
    }
  
    .million:hover .icon-img,
  .million.selected .icon-img {
    filter: invert(1); /* Inverts the color of the image to white */
  }
  
    a {
      text-decoration: none;
      color: #333;
      font-size: 14px;
      padding: 15px 20px;
      display: block;
      margin-top: 2px;
    }
   
    .optiontext:hover {
      color: rgb(53, 167, 196);
    
    }
  
    .icon {
      font-size: 12px; /* Adjust the icon size */
      padding-right: 15px;
    }
  
    .option{
      display: flex; /* Use flex to align text and icon */
      justify-content: space-between; /* Spread out the content */
      align-items: center; /* Align text and icon vertically */
    }
  
   #millionoptions{
    margin-left: 20px;
    border-left: 1px solid #d1d5db;
   }
  
  
  </style>
