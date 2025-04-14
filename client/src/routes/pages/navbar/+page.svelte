<script>
    import { writable } from "svelte/store";
    import Mapsetting from '@/assets/images/mapsetting.png';
    import Help from '@/assets/images/help.png';
    import Share from '@/assets/images/share.png';
    import About from '@/assets/images/about.png';
    import Story from '@/assets/images/story.png';
    import Play from '@/assets/images/play.png';
    
  
    // Reactive state using writable store
    let sidebarContent = writable(null);
    let showShareDropdown = writable(false);
    let showAdvancedOptions = writable(false);
  
    // Handlers for button clicks
    function Helpside() {
      sidebarContent.set('help');
      showShareDropdown.set(false);
    }
  
    function Storyside() {
      sidebarContent.set('story');
      showShareDropdown.set(false);
    }
  
    function closeSidebar() {
      sidebarContent.set(null);
    }
  
    function sharetoggle() {
      showShareDropdown.update(val => !val);
      sidebarContent.set(null);
    }
  
    function closeShareDropdown() {
      showShareDropdown.set(false);
    }
  </script>
  
  <div class="nav-container">
    <ul>
      <li><button style="width:125px;  border-radius: 4px 0px 0px 4px; display: flex; flex-direction:row; justify-content:center; gap:5px; padding:6px 5px;margin:0 ">
        <img style=" width: 20px; height: 20px; filter: invert(70%);" src={Mapsetting} alt="">
        <span>Map Settings</span></button></li>
      <li>
        <button style="width:70px; border-radius: 0 4px 4px 0; display: flex; flex-direction:row; justify-content:center; gap:5px; align-items: center; padding:6px 5px;margin:0 " on:click={Helpside} class:share-active={$sidebarContent === 'help'}>
            <img style=" width: 15px; height: 15px; filter: invert(70%);" src={Help} alt="">
            <span>Help</span></button>
      </li>
      <li>
        <button style="width:70px; border-radius: 3px; display: flex; flex-direction:row; justify-content:center; gap:5px; align-items: center; padding:6px 5px;margin:0 " on:click={Storyside} class:share-active={$sidebarContent === 'story'}>
            <img style=" width: 15px; height: 15px; filter: invert(70%);" src={Story} alt="">
            Story</button>
      </li>
      <li>
        <button style="width:110px; border-radius: 3px; display: flex; flex-direction:row; justify-content:center; gap:5px; align-items: center; padding:6px 5px;margin:0 " on:click={sharetoggle} class:share-active={$showShareDropdown}>
            <img style=" width: 15px; height: 15px; filter: invert(70%);" src={Share} alt="">
            <span>Share/Print</span></button>
      </li>
      <li><button style="width:75px; border-radius: 3px; display: flex; flex-direction:row; justify-content:center; gap:5px; align-items: center; padding:5px 5px;margin:0 ">
        <img style=" width: 15px; height: 15px; filter: invert(70%);" src={About} alt="">
        About</button></li>
    </ul>
  </div>
  
  {#if $showShareDropdown}
    <div class="share-dropdown">
      <button class="close-dropdown-button" on:click={closeShareDropdown}>&times;</button>
      <div class="triangle-pointer"></div>
      <p style="font-size: 14px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif;">Share URL</p>
      <p style="font-size: 13px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif; opacity: 0.8;">Anyone with this URL will be able to access this map.</p>
      <div class="share-url-main">
        <input class="share-url" value="" placeholder="" readonly />
        <button class="share-button-copy">Copy</button>
      </div>
      <p style="margin-top: 5px; font-size: 14px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif;">Print Map</p>
      <p style="font-size: 13px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif; opacity: 0.8;">Open a printable version of this map.</p>
      <div class="share-main">
        <button class="share-button">Download map (png)</button>
        <button class="share-button">Show Print View</button>
      </div>
      <div class="advanced-options-container">
        <p style="font-size: 14px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif;">Advanced Options</p>
        <button class="toggle-button" on:click={() => showAdvancedOptions.update(val => !val)}>
          <span class="toggle-icon" class:open={$showAdvancedOptions}></span>
        </button>
        {#if $showAdvancedOptions}
          <div class="advanced-options">
            <div class="advance-checkbox" style="font-size: 14px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif;">
              <label>
                <input type="checkbox" class="checkbox" />
                Include Story in Share
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                Shorten the share URL using a web service
              </label>
            </div>
           
            <p style="font-size: 14px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif;">Embed Map</p>
            <p style="font-size: 13px; font-weight: 400; line-height: normal;font-family: Inter, sans-serif; opacity: 0.8;">To embed, copy this code to embed this map into an HTML page:</p>
            <div class="embed-map-container">
              <input class="embed-input" value='<iframe src="" width="600" height="400"></iframe>' readonly />
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
  
  {#if $sidebarContent}
    <div class="sidebar">
      <button class="close-button" style="color: gray;" on:click={closeSidebar}>&times;</button>
      {#if $sidebarContent === 'help'}
        <h2>We're here to help</h2>
        <div style="margin-bottom: 10px;"></div>
        <p>
          Find useful tips on how to use AAI by either checking the guides below or by contacting the team at
          <a href="mailto:support@terria.io"> support@AAI.io</a>.
        </p>
        <div style="margin-bottom: 15px;"></div>
        <button class="sidebar-button" style="border-radius: 32px">Tour</button>
        <div style="padding: 20px;"></div>
        <ul>
          <li><div  style="border-bottom: 1px solid grey; padding:10px"><button  style="display: flex; flex-direction:row; justify-content:center;align-items:center; gap:22px;"><span style="font-size: 15px; font-weight: 600; line-height: normal;font-family: Inter, sans-serif;color: rgb(187, 187, 187);">Getting started with the map</span><span class="toggle-icon-help"></span></button></div></li>
          <li><div style="border-bottom: 1px solid grey; padding:10px"><button style="display: flex; flex-direction:row; justify-content:center;align-items:center; gap:93px;"><span style="font-size: 15px; font-weight: 600; line-height: normal;font-family: Inter, sans-serif;color: rgb(187, 187, 187);">Step by step guide</span><span class="toggle-icon-help"></span></button></div></li>
          <li><div style="border-bottom: 1px solid grey; padding:10px"><button style="display: flex; flex-direction:row; justify-content:center;align-items:center; gap:57px;"><span style="font-size: 15px; font-weight: 600; line-height: normal;font-family: Inter, sans-serif;color: rgb(187, 187, 187);">Share & Story migration</span><span class="toggle-icon-help"></span></button></div></li>
        </ul>
      {/if}
      {#if $sidebarContent === 'story'}
        <h2>Story Editor</h2>
        <div style="margin-bottom: 10px;"></div>
        <p>Create and share interactive stories directly from your map</p>
        <div style="margin-bottom: 15px;"></div>
        <div style="display: flex; flex-direction:row; justify-content:space-between; gap:5px">
        <button class="sidebar-button" style="display: flex; flex-direction:row; justify-content:center; align-items:center; gap:5px;"><img style=" width: 25px; height: 25px; filter: invert(1);" src={Play} alt=""><span>Play</span></button>
  
        
        <button class="sidebar-button" style="display: flex; flex-direction:row; justify-content:center; align-items:center; gap:5px;"><img style=" width: 20px; height: 20px; filter: invert(1);" src={Share} alt=""><span>Share</span></button>
        </div>
      {/if}
    </div>
  {/if}
  
  <style>
  .nav-container {
    position: absolute;
    top: 0px; 
    right: 40px; 
    padding: 10px;
    font-family: Inter, sans-serifpx;
  }
  
  .nav-container ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row; 
    gap: 5px; 
  }
  
  .nav-container ul li {
    display: inline; 
  }
  
  .nav-container ul li button {
    background-color: rgb(17, 24, 39); 
    color: white; 
    border: 1px solid #444; 
    padding: 8px 12px;
    border-radius: 4px; 
    cursor: pointer; 
    font-size: .8125rem; 
     
  }
  
  .nav-container ul li button:hover {
    background-color: rgb(53, 167, 196); 
    
    border: 1px solid rgb(53, 167, 196); 
  }
  
  
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: rgb(17, 24, 39);
    color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
    padding: 20px;
    overflow-y: auto;
    z-index: 1000;
  }
  
  .sidebar h2 {
    font-family: Inter, sans-serif;
    font-weight: bold;
    color: rgb(255, 255, 255);
    line-height: normal;
    font-size: 18px;
  }
  
  .sidebar p {
    font-family: Inter, sans-serif;
    font-weight: 400;
    color: rgb(187, 187, 187);
    line-height: normal;
    font-size: 14px;
  }
  
  .sidebar-button {
    display: block;
    width: 100%;
    background-color:rgb(53, 167, 196);
    color: white;
    padding: 10px;
    margin-bottom: 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    font-size: 14px;
  }
  
  .sidebar-button:hover {
    background-color: rgba(53, 167, 196, 0.804);
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
    font-size: 14px;
  }
  
  .sidebar ul li {
    margin-bottom: 10px;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    font-size: 24px;
    color: black;
    cursor: pointer;
    font-weight: bold;
  }
  
  .share-dropdown-container {
    position: relative;
  }
  
  .share-dropdown {
    position: absolute;
    top: 53px; 
    right: 130px;
    background-color: rgb(17, 24, 39);
    color: white;
    
    padding: 10px;
    border-radius: 2px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    width: 450px;
  }
  
  .share-dropdown .triangle-pointer {
    position: absolute;
    top: -10px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid rgb(17 24 39);
  }
  
  .share-dropdown input {
    margin: 0px 0;
    width: 500px;
    background-color: rgba(255, 255, 255, 0.15);
    height: 40px;
    border: none;
  }
  
  .share-url-main{
    display: flex;
    flex-direction: row;
  
  }
  .share-url {
    font-size: 12px;
    color: #fff;
    word-break: break-all;
  }
  .nav-container ul li button.share-active {
    background-color: rgb(53, 167, 196); 
    border: 3px solid rgb(143, 70, 143); 
  }
  
  
  .share-button {
    background-color:rgb(53, 167, 196);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    width: 300px;
    height: 40px;
  }
  .share-button-copy{
    background-color:rgb(53, 167, 196);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 2px;
    cursor: pointer;
    margin-bottom: 10px;
    width: 70px;
    height: 40px;
  }
  .share-main{
    display: flex;
    flex-direction: row;
    gap: 5px; 
  }
   .share-button:hover {
    background-color:rgb(53, 167, 196);
  } 
  
  .close-dropdown-button {
    position: absolute;
    top: 11px;
    right: 19px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: white;
    cursor: pointer;
  }
  
  .advanced-options-container {
    position: relative;
    margin-top: 5px;
  }
  
  .advanced-options-container p {
    display: inline-block;
    font-size: 12px;
    margin: 0;
    
  }
  
  .toggle-button {
    position: absolute;
    right: 3px; /* Position the toggle button to the right side */
    top: 10px; /* Align it vertically with the heading */
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .toggle-icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(135deg);
    transition: transform 0.3s;
  }
  
  
  .toggle-icon.open {
    transform: rotate(-45deg);
  }
    
  .toggle-icon-help {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(220deg);
    filter: invert(50%);
  }
  
  .advanced-options {
    
    padding: 10px 0px 5px 0px;
    background-color: rgb(17, 24, 39); /* Match dropdown background */
    color: white;
    
  
  }
  .advance-checkbox {
    display: flex; 
    flex-direction: column; 
    gap: 8px; 
    margin-bottom: 5px; 
  }
  
  .advance-checkbox label {
    display: flex; 
    align-items: center; 
    font-size: 14px; 
    color: white; 
  }
  
  .advance-checkbox .checkbox {
    margin-right: 8px; 
    width: 16px; 
    height: 16px; 
    accent-color: rgb(53, 167, 196); 
    cursor: pointer; 
  }
  
  
  
  .embed-map-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .embed-input {
    flex-grow: 1;
    font-size: 12px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.15);
    height: 40px;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
  }
  
  .share-button-copy {
    background-color: rgb(53, 167, 196);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 2px;
    cursor: pointer;
  }
  
  .share-button-copy:hover {
    background-color: rgb(40, 140, 170);
  }
   
  
  @media (max-width: 768px) {
    .nav-container {
      top: 10px;
      right: 10px;
      padding: 5px;
    }
  
  
  
    .nav-container ul li button {
      width: 100%; 
      text-align: center;
    }
  }
  
  
  @media (max-width: 768px) {
    .nav-container ul {
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center; 
    }
  
    .nav-container ul li button {
      font-size: 13px;
      padding: 8px;
    }
  
    .sidebar {
      width: 80%; 
      max-width: 250px;
    }
  
    .share-dropdown {
      width: 85%;
      max-width: 350px;
    }
  }
  
  @media (max-width: 480px) {
    .nav-container ul {
      flex-direction: column;
      gap: 10px;
    }
  
    .nav-container ul li button {
      font-size: 12px;
      padding: 8px 10px;
    }
  
    .share-button {
      width: 100%; 
    }
  
    .share-dropdown {
      width: 100%;
      max-width: 300px;
    }
  
    .embed-input {
      width: 100%; 
    }
  }
  </style>