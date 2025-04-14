<script lang="ts">
	import { onMount } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Toaster } from "$lib/components/ui/sonner";


  import { drawControl, surveyDataUp, dgpsDataProcess, tsDataRP, ipsd_tool  } from "@/stores/common";

  import SDU from '../sdu/+page.svelte';
  import DDP from '../ddp/+page.svelte';
  import TSDPR from '../tsdrp/+page.svelte';

  import CAS from '../cas/+page.svelte';
  import ODA from '../obstacle_data_analysis/+page.svelte';
 

	
	onMount(() => {


		})
    function onClickOpen(id:any){
  if (id==='surveyDataup' && $surveyDataUp) {
    surveyDataUp.set(true);
    dgpsDataProcess.set(false);
    tsDataRP.set(false);

  }else if (id==='dgpsDataProcess' && $dgpsDataProcess){
    surveyDataUp.set(false);
    dgpsDataProcess.set(true);
    tsDataRP.set(false);

  }else if (id==='tsDataRP' && $tsDataRP){
    surveyDataUp.set(false);
    dgpsDataProcess.set(false);
    tsDataRP.set(true);

  } 
}

  let isDropdownOpen = false;
  let isAeronauticalDropdownOpen = false;
  let isImageryDropdownOpen = false;
  let isElevationDropdownOpen = false;
  let selectedLink = null;
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

  function ImageryDropdown() {
    isImageryDropdownOpen = !isImageryDropdownOpen;
  }

  function ElevationDropdown() {
    isElevationDropdownOpen = !isElevationDropdownOpen;
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



<div class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl p-0 mx-auto max-h-screen overflow-y-auto" style="height: 75vh;">
  <header class="Explore_Header">
    <!-- <button class="explore-button" on:click={() => selectCatalog('vector')}>Vector Data Catalog</button>
    <button class="explore-button" on:click={() => selectCatalog('raster')}>Raster Data Catalog</button>
    <button class="explore-button">Data Catalog</button>
    <button class="explore-button" on:click={() => toggleSidebar()}>My Data</button>
    <button class="explore-button" on:click={() => selectCatalog('sdu')}>Survey Data Upload</button> -->
  <Dialog.Root>
    <Dialog.Trigger>
      <button class="explore-button" title='Area of Interest' on:click={()=>{$dgpsDataProcess=!$dgpsDataProcess; onClickOpen('dgpsDataProcess');}} > <span class="text">DGPS Data Processing</span></button>
</Dialog.Trigger>
<Dialog.Content class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0 m-2 fixed left-[50%] top-[50%]" style="background:rgba(255,255,255,1);">
     <DDP />
    </Dialog.Content>

  </Dialog.Root>
  <Dialog.Root>
    <Dialog.Trigger>
      <button class="explore-button" title='Area of Interest' on:click={()=>{$tsDataRP=!$tsDataRP; onClickOpen('tsDataRP');}} > <span class="text">TS Data Refinement & Processing</span></button>
</Dialog.Trigger>
<Dialog.Content class="p-0 m-2 fixed left-[50%] top-[50%] max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl" style="background:rgba(255,255,255,1);">
     <TSDPR />
    </Dialog.Content>
  </Dialog.Root>

  <Dialog.Root>
    <Dialog.Trigger>
      <button class="explore-button" title='Area of Interest'  > <span class="text">Creation of AGA </span></button>
</Dialog.Trigger>
<Dialog.Content class="p-0 m-2 fixed left-[50%] top-[50%] max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl" style="background:rgba(255,255,255,1);">
      <CAS />
    </Dialog.Content>
  </Dialog.Root>


  <Dialog.Root>
    <Dialog.Trigger>
      <button class="explore-button" title='Area of Interest' > <span class="text">Obstacle data Analysis</span></button>
</Dialog.Trigger>
<Dialog.Content class="p-0 m-2 fixed left-[50%] top-[50%] max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl" style="background:rgba(255,255,255,1);">
      <ODA />
    </Dialog.Content>
  </Dialog.Root>

 

  </header>


</div>








<style>	
*{
  font-family: "Inter", sans-serif;
} 

   .Explore_Header {
  display: flex;
  gap: 10px;
  justify-content: start; /* This will space out the items */
  align-items: center; /* This ensures that the items are aligned vertically in the center */
  padding: 0px 12px 10px 12px; /* Add some padding to the header */
  border-bottom: 2px solid gray;
}


.Explore_Header .explore-button {
  padding: 10px 12px; /* Adds some padding to the button */
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
