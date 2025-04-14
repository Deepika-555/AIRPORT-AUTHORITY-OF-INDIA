<script lang="ts">
	import { onMount } from "svelte";
  import { Toaster } from "$lib/components/ui/sonner";


  import SDU from '../sdu/+page.svelte';
  import Aerodrome from '../aerodrome/+page.svelte';
  import closefolder from '@/assets/images/closefolder.png';
  import openfolder from '@/assets/images/openfolder.png';
  import Search from '@/assets/images/search.png';
	
	onMount(() => {


		})	
  let isDropdownOpen = false;
  let isAeronauticalDropdownOpen = false;
  let isImageryDropdownOpen = false;
  let isElevationDropdownOpen = false;
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



<div>
  <header class="Explore_Header" style="display: flex; flex-direction:row; justify-content:space-between">
    <div class="Explore_Header_button">
    <button class="explore-button" on:click={() => selectCatalog('vector')}>Vector Data Catalog</button>
    <button class="explore-button" on:click={() => toggleSidebar()}>My Data</button>
    <button class="explore-button" on:click={() => selectCatalog('sdu')}>Survey Data Upload</button>
  </div>
  <div class="Explore_Header_search"style="position: relative; display: flex; align-items: center;">
    <img style=" width: 20px; height: 20px; position: absolute; left: 10px;" src={Search} alt="">
    <input type="text" id="search" class="w-full  p-1 bg-[rgba(255,255,255)] text-black rounded-md border-2 border-gray; pl-8" placeholder="Search Airport"/>
  </div>
  </header>

  <div class="flex h-[70vh]">
    <!-- Sidebar -->
    {#if isSidebarVisible && activeCatalog != 'sdu' }
    <aside class = "sidebar">
      <!-- Search Bar -->
      <!-- Search Bar -->
      <div class="mb-2" style="position: relative; display: flex; align-items: center;">
        <img style="position: absolute; left: 10px; width: 20px; height: 20px;" src="{Search}" alt="Search Icon">
        <input type="text" id="search" class="w-full p-2 bg-[rgba(255,255,255)] text-black rounded-md  pl-8" placeholder="Search the Catalog"/>
    </div>
      {#if activeCatalog === 'vector'}
      <!-- Other Sidebar Content -->
      <ul>
        <li class="mb-4">
          <!-- Dropdown trigger -->
          <li>
          <a href="#" on:click={() => { toggleMillionDropdown(); selectLink('million'); }}
             class={`million flex justify-between items-center ${selectedLink === 'million' ? 'selected' : ''}`}>
             <span style="display: flex; align-items:center; gap:5px">
              <img 
              src={isMillionDropdownOpen ? openfolder : closefolder} 
              class="icon-img" 
              alt="" 
              style="width: 20px; height: 20px;"
            > 
               Survey Data - Raw</span>
            <span class="icon">{isMillionDropdownOpen ? "▲" : "▼"}</span>
          </a>
  
          <!-- Dropdown list for '1 Million' -->
          <ul id="millionoptions" class={isMillionDropdownOpen ? 'submenu open' : 'submenu'}>
            <li><a class={`option`}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption1('Option1')}>DGPS Data</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
          </a></li>
            <li><a class={`option `}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption2('Option2')}>TS Data</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
            </a></li>
            <li><a class={`option`}>
              <span style="cursor: pointer;" class="optiontext" on:click={(event) => millionoption3('Option3')}>Runway Profile Data</span>
              <span class="icon" style="cursor: pointer;" on:click={(event) => iconClickHandler()}>＋</span>
            </a></li>
          

          
        </li>


      
        
      </ul>


        {/if}
    </aside>
    {/if}

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <!-- <h1 class="text-2xl font-bold mb-6">Main Content</h1> -->
      <!-- Conditionally Render Content Based on Active Catalog -->
      {#if !isSidebarVisible}
      <!-- Show upload options when sidebar is hidden (My Data clicked) -->
      <!-- <div class="upload-links">
        <h1>Drag and drop a file here to view it locally on the map
          (it won’t be saved or uploaded to the internet)</h1>
        <p class="upload-linkr">
          <a class="uploadfiledata" href="#">Upload File Data</a>
          <a class="uploadwebdata" href="#">Upload Web Data</a>
        </p>
      
      </div> -->
      <Aerodrome />
    {:else if activeCatalog === 'vector'}
      <p>This is the Vector Data Catalog content.</p>
    {:else if activeCatalog === 'raster'}
    <p>This is the Raster Data Catalog content.</p>
      {:else if activeCatalog === 'sdu'}
      <div class="sm:max-w-auto p-2 m-2" style="background:rgb(255,255,255);">
      <SDU />
    </div>
    {/if}
    </main>
  </div>
</div>








<style>	
p{
  color:white
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

/* Style for the selected button */
.explore-button.selected {
  color: rgb(1, 1, 1);              
  background: rgb(255, 255, 255);
  border: 2px solid rgb(53, 167, 196);  /* Darker blue border */
  border-radius: 3px;         /* Optional: rounded corners */
}

/* Optional: Hover effect for selected button */
.explore-button.selected:hover {
  border: 3px solid rgb(53, 167, 196);
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
  text-align: center;
  color:rgb(53, 167, 196) /* Center text inside the container */
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
