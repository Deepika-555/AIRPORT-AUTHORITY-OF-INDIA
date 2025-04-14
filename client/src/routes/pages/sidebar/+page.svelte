<script lang="ts">
	  import { onMount } from "svelte";
    import client from "@/interceptors/client";

    import * as Dialog from "$lib/components/ui/dialog";
    import * as Select from "$lib/components/ui/select/index.js";


    import searchSvg from '@/assets/images/search.svg';
    import aailogo from '@/assets/images/aailogo.png';
    import logoutIcon from '@/assets/images/logout.svg'
    import upload from '@/assets/images/upload.png';

    import UtilPage from '../utilities/+page.svelte';
    import User_manager from '../User_manager/+page.svelte';
    import ExploreData from '../exploredata/+page.svelte';
    import UploadData from '../uploaddata/+page.svelte';
    import ProcessData from '../processdata/+page.svelte';
    import Dashboard from "../dashboard/+page.svelte";

    // import HimPage from '../himpage/+page.svelte';

    import { authenticated, logout, onRefresh } from '@/stores/auth';
    import { arp ,curMap } from "@/stores/common";

  let map:any;
  let airportData:any=[];
  let selectedArp = '';
  let data_aerodreome:any=[];


	
	onMount(() => {
    
    loaddata();
    loaddata2();

		})	
    async function loaddata2() {
            const res1: any = await client.post('aerodrome_fetch', {withCredentials: true});
            if (res1.status === 200) { 
                data_aerodreome=res1.data;
              //  console.log(data_aerodreome[0]);
              arp.set(data_aerodreome[0]);

            }
        }
    async function loaddata() {
            const res: any = await client.post('fetchAirportdata', {withCredentials: true});
            if (res.status === 200) { 
              airportData=res.data;
              // console.log(airportData);
            }
        }
async function bndval_arp(value:any){
  map=$curMap;
//  console.log($arp)
  map.flyTo({
            center: [`${value.long}`, `${value.lat}`],
            essential: true,
            zoom: 10 
        });

}
  let airportName='';
	let isOpen = false; // Track whether the content is open or closed

    // Function to toggle visibility and sliding of the side tab
    function showless() {
        isOpen = !isOpen;
    }

function searchAirport(){
console.log(airportName)
}

</script>
<div class="sidetab {isOpen ? 'open' : 'hidden'}">
    <!-- Button with Font Awesome icon for expanding/collapsing -->
    <div class="sidetabbtn" on:click={showless}>
        {#if isOpen}
            <i title="View Less" class="fa fa-angle-double-left" ></i>
        {:else}
            <i title="View More" class="fa fa-angle-double-right"></i>
        {/if}
    </div>
    <div class="logoutBtn" title="Logout" on:click={() => { logout() }}>
      <img class="logoutIcon" src={logoutIcon} alt="logout">
    </div>
   



    <!-- Content inside the side tab -->
	<div class="content {isOpen ? 'open' : 'hidden'}">
        <div >
          <div style="display: flex; border-radius: 3px; justify-content: center; align-items: center; flex-direction: column;background:white" class="mb-2">
            <img src={aailogo} alt="" height=75% width=45% >
            <div class="center-heading">
              <span style="--i:1">A</span>
              <span style="--i:2">I</span>
              <span style="--i:3">R</span>
              <span style="--i:4">P</span>
              <span style="--i:5">O</span>
              <span style="--i:6">R</span>
              <span style="--i:7">T</span>
              <span></span>
              <span style="--i:8">A</span>
              <span style="--i:9">U</span>
              <span style="--i:10">T</span>
              <span style="--i:11">H</span>
              <span style="--i:12">O</span>
              <span style="--i:13">R</span>
              <span style="--i:14">I</span>
              <span style="--i:15">T</span>
              <span style="--i:16">Y</span>
              <span></span>
              <span style="--i:17">O</span>
              <span style="--i:18">F</span>
              <span></span>
              <span style="--i:19">I</span>
              <span style="--i:20">N</span>
              <span style="--i:21">D</span>
              <span style="--i:22">I</span>
              <span style="--i:23">A</span>
              
              <!-- Airport Authority of India</h2> -->
            </div>
        </div>

        <!-- <div class="content-center mb-2 flex justify-center">
          <Select.Root onSelectedChange={bndval_arp}>
              <Select.Trigger class="w-[200px]">
                  <Select.Value placeholder="Select ARP" />
              </Select.Trigger>
              <Select.Content>
                  <Select.Group>
                      {#each data_aerodreome as arp}
                          <Select.Item value={arp} label={arp.airport_name}>{arp.airport_name}</Select.Item>
                      {/each}
                  </Select.Group>
              </Select.Content>
          </Select.Root>
      </div> -->

      <select class="w-[200px] text-left" style="padding: 8px 7px; font-size:15px; border-radius: 3px;" bind:value={selectedArp} on:change={() => bndval_arp(selectedArp)}>
        <option class="text-center" value="" disabled selected>Select Airport</option>
        {#each airportData as arp}
          <option style='font-size:15px;' value={arp}>{arp.airport}</option>
        {/each}
      </select>
        
    
    <div style="position: relative; display: none; align-items: center;margin-bottom:10px" >
        <img style="filter: invert(1); width: 20px; height: 20px; position: absolute; left: 10px;" src={searchSvg} alt="">
        <input id="search" type="text" name="search" placeholder="Search Airport" autocomplete="off" bind:value={airportName} style="padding-left: 100px;" on:input={()=>{searchAirport()}}>
    </div>
    
    <div class="button-row" style="border-top: 2px solid grey; margin-top:2px">   
 <Dialog.Root closeOnOutsideClick={false} >
        <Dialog.Trigger> <button class="btn mb-2" style="width:150px; padding: 8px 7px; font-size:15px; border-radius: 3px; display: flex; align-items: center; justify-content:center; p-0 ">
          <img src={upload} alt="" style="width: 20px; height: 20px; filter: invert(1);">
          <span>Upload Data</span>
        </button>
        </Dialog.Trigger>
        <Dialog.Content class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl p-0 mx-auto max-h-screen ">
          <Dialog.Header>
            <Dialog.Title style="color:black" >Upload Data</Dialog.Title>
          </Dialog.Header>
          <UploadData />
        </Dialog.Content>
        
</Dialog.Root> 

   
       <Dialog.Root closeOnOutsideClick={false} >
        <Dialog.Trigger><button class="btn mb-2"  style="width:150px; padding: 8px 7px; font-size:15px; border-radius: 3px;">⊕ Explore Data</button></Dialog.Trigger>
        <Dialog.Content class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl p-0 mx-auto max-h-screen overflow-y-auto">
          <Dialog.Header>
            <Dialog.Title style="color:black">Exlpore Data</Dialog.Title>
          </Dialog.Header>

            <ExploreData />   

        </Dialog.Content>
      </Dialog.Root>
      </div>

      <Dialog.Root closeOnOutsideClick={false} >
        <Dialog.Trigger> <button class="btn"  style="width:310px; padding: 8px 7px; font-size:15px; border-radius: 3px;">Process Data</button></Dialog.Trigger>
        <Dialog.Content class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl p-0 mx-auto max-h-screen">
          <Dialog.Header>
            <Dialog.Title style="color:black">Process Data</Dialog.Title>
          </Dialog.Header>
          <ProcessData />
        </Dialog.Content>
      </Dialog.Root>


      <Dialog.Root closeOnOutsideClick={false} >
        <Dialog.Trigger> <button class="btn"  style="width:310px; padding: 8px 7px; font-size:15px; border-radius: 3px; margin-top:8px;">Dashboard</button></Dialog.Trigger>
        <Dialog.Content class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl p-0 mx-auto max-h-screen">
          <Dialog.Header>
            <Dialog.Title style="color:black">Dashboard</Dialog.Title>
          </Dialog.Header>
          <Dashboard />
        </Dialog.Content>
      </Dialog.Root>

      

      <Dialog.Root closeOnOutsideClick={false}>
        <Dialog.Trigger><button class="btn" id="toolsbtn">User Manage</button></Dialog.Trigger>
        <Dialog.Content class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-5xl p-0 mx-auto max-h-screen">
          <Dialog.Header>
            <Dialog.Title style="color:black">User Manager</Dialog.Title>
          </Dialog.Header>
          <div>
            <User_manager />
          </div>
        </Dialog.Content>
      </Dialog.Root>

     

      </div>

      <div style="margin-top:20%;display:none">
        <!-- Radio Buttons -->
        <div class="form-section">
            <h3>Choose an option</h3>
            <label>
                <input type="radio" name="option" value="option1">
                Option 1
            </label>
            <label>
                <input type="radio" name="option" value="option2">
                Option 2
            </label>
            <label>
                <input type="radio" name="option" value="option3">
                Option 3
            </label>
        </div>

        <!-- Select Dropdown -->
        <div class="form-section">
            <h3>Choose a color</h3>
            <select>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="yellow">Yellow</option>
            </select>
        </div>

        <!-- Checkbox -->
        <div class="form-section">
            <h3>Choose your preferences</h3>
            <label>
                <input type="checkbox" name="preference" value="email">
                Receive email updates
            </label>
            <br>
            <label>
                <input type="checkbox" name="preference" value="sms">
                Receive SMS updates
            </label>
        </div>

        <!-- Textarea -->
        <div class="form-section">
            <h3>Your message</h3>
            <textarea rows="4" cols="50" placeholder="Write something..."></textarea>
        </div>

        <!-- Button -->
        <div class="form-section">
            <button class="btn">Submit</button>
        </div>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur pariatur odit, ex alias exercitationem esse ipsa eaque sed quod repellendus culpa impedit iste ipsum, aut provident repellat neque maiores, adipisci harum molestias minus. Eaque incidunt aperiam quibusdam impedit aliquid placeat beatae autem ducimus similique accusamus laborum vel libero molestiae laboriosam quis, cumque id, error suscipit, ut mollitia? Odit accusantium quia dolorem harum molestiae, inventore repudiandae, architecto at ex rem provident recusandae ipsam doloremque expedita quam fugiat blanditiis vero magni ipsa atque. Placeat iusto natus nemo ipsam repellat praesentium vitae consectetur, similique ut aut dolorum illo magnam reprehenderit nisi deserunt nobis earum officiis alias amet. Adipisci architecto nulla eaque voluptas maiores dolor natus accusamus molestiae fugiat! Libero veniam repellendus soluta consectetur minus autem architecto, tempora voluptatem fugiat. Odio, quia. Quod, dolores. Laudantium at saepe ipsa excepturi esse error ipsum totam et fugit consequuntur consectetur sint temporibus repellendus iste obcaecati qui incidunt, sequi officiis animi. Accusantium minus, illo excepturi, deleniti perferendis quisquam voluptate quos cupiditate quidem, corrupti perspiciatis suscipit voluptatibus! Inventore minus aut ex iure accusamus unde fuga dolore corporis reprehenderit. Ut reprehenderit et nemo numquam architecto expedita ullam blanditiis sunt libero nihil velit minus quam voluptates dolor voluptatum delectus, nulla doloremque quo dolorum eveniet temporibus laudantium harum? Nostrum temporibus aspernatur commodi vel magni ullam, quo porro reprehenderit, blanditiis nihil, sunt esse eius cumque enim voluptate deleniti minima. Inventore fugit sapiente asperiores adipisci quo praesentium eligendi quod neque nobis, aut ipsa cumque dolorem maiores doloribus. Consequuntur harum perferendis quae consequatur repudiandae dolore!
        </p>
    </div>
</div>

</div>

<style>	

.button-row {
  /* padding: 5px 0px 10px 0px; */
  display: flex;
 justify-content: space-between;
  align-items: center; /* Align buttons vertically centered */
  
  
}


.center-heading{
  background-color: #283031;
  width: 100%;
  position: relative;
  letter-spacing: 0px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}

.center-heading span {
  position: relative;
  letter-spacing: -3px;
  display: inline-block;
  font-size: 15px;
  color: #fff;
  text-transform: uppercase;
  animation: flip 5s infinite;
  animation-delay: calc(.2s * var(--i))
}
@keyframes flip {
  0%,80% {
    transform: rotateY(360deg) 
  }
}


#search{
    box-sizing: border-box;
    margin-top: 0px;
    margin-bottom: 0px;
    border: none;
    border-radius: 4px;
    height: 40px;
    width: 100%;
    display: block;
    padding: 0.5rem 40px;
    vertical-align: middle;
    appearance: none;
    color:black
}
.sidetab {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 21px;
    top: 21px;
    max-height: calc(100% - 42px);
    min-height: calc(100% - 42px);
    z-index: 100;
    background: rgba(17, 24, 39, 0.5);
    backdrop-filter: blur(8px);
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    width: 350px;
    flex-basis: 350px;
    max-width: 350px;
    box-sizing: border-box;
    border-radius: 12px;
    transition: all 0.7s ease; /* Transition for smooth sliding effect */
    visibility: visible;
    opacity: 1;
    margin-left: 0;
    padding: 10px;
    color: white;
}
.logoutBtn:hover {
    background-color: #2c8a97;
    transform: scale(1.1);
}
.logoutBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
    cursor: pointer;
    height: 40px;
    width: 40px;
    position: absolute;
    bottom: 10px;
    right: -20px;
    background-color: #35a7c4;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    border: none;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease; 
}

.logoutIcon {
  width: 20px; /* Adjust the image size as needed */
}
#toolsbtn{
  bottom:10px;
  position:absolute;
  border-radius: 3px;
  width:310px; 
  padding: 8px 7px; 
  font-size:15px;

}

.sidetabbtn {
    pointer-events: auto;
    cursor: pointer;
    height: 40px;
    width: 40px;
    position: absolute;
    top: 10px;
    right: -20px;
    background-color: #35a7c4;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    border: none;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.sidetabbtn:hover {
    background-color: #2c8a97;
    transform: scale(1.1);
}

.sidetab .content {
    flex-grow: 1;
    padding: 10px;
    color: white;
    font-size: 16px;
    overflow-y: auto;
    transition: transform 0.3s ease; /* Ensure smooth content transition */
}

.sidetab.hidden {
    transform: translateX(-100%); /* Slide the tab to the left when hidden */
}

.sidetab.open {
    transform: translateX(0); /* Slide back to the right when open */
}

.sidetab .content.hidden {
    display: none;
}

.sidetab .content {
    display: block;
}

/* Styling for Buttons */


/* Styling for form elements */
select, textarea, input[type="radio"], input[type="checkbox"] {
    background-color: #2c8a97;
    color: white;
    border: 1px solid #35a7c4;
    border-radius: 8px;
    padding: 8px;
    margin: 5px 0;
    font-size: 16px;
    width: 100%;
}

/* Centering the headings */


/* Styling for form sections */
.form-section {
    margin-bottom: 20px;
}

h3 {
    color: #35a7c4;
}

/* Styling for labels */
label {
    color: white;
    font-size: 14px;
    margin-bottom: 5px;
    display: inline-block;
}

</style>
