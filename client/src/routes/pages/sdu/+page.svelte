<script lang="ts">
  import { Sheet, SheetTrigger } from "@/components/ui/sheet";
  import SheetContent from "@/components/ui/sheet/sheet-content.svelte";
  import { drawControl, surveyDataUp  } from "@/stores/common";
  import { currentUser  } from "@/stores/auth";
  import { Switch } from "@/components/ui/switch";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import * as turf from '@turf/turf';
  import client from "@/interceptors/client";
  import { json } from "@sveltejs/kit";
  import * as Dialog from "$lib/components/ui/dialog";
  // import Draggable from "../../draggable/draggable.svelte";
import { Style } from "maplibre-gl";
import { onMount } from "svelte";

import Edit from '@/assets/images/edit.png';
import Save from '@/assets/images/save.png';

onMount(() => {
  console.log($currentUser);
});

function onClickOpen(id:any){
if (id==='surveyDataup' && $surveyDataUp) {
  surveyDataUp.set(true);
}
}

let file:any; // File variable scoped to the component or function
let fileType:any = ''; // Variable to store the selected file type (DGPS or Total Station)

// This function is triggered when a file is selected
const handleFileSelect = (event) => {
file = event.target.files[0];
if (event.target.files.length > 0) {
    // alert('File is selected');
    uploadFile();
  }
};

// This function uploads the selected CSV file to the backend
const uploadFile = async () => {
if (!file) {
  alert('Please select a CSV file first.');
  return;
}
const user=$currentUser.userid;
const formData = new FormData();
formData.append('file', file);
formData.append('user', JSON.stringify(user));

let uploadUrl = 'csv_file_upload'; // Default endpoint for DGPS

if (fileType === 'totalStation') {
  uploadUrl = 'csv_ts_upload'; // Endpoint for Total Station
}
else if(fileType ==='rwy_profile'){
  uploadUrl = 'rwy_profile_upload';
}

try {
  // Assuming `client` is axios or another HTTP client
  const res = await client.post(uploadUrl, formData );
  
  if (res.status === 200) {
    toast.success(res.data);
  } else {
    console.error('Upload failed:', res.data.message);
    toast.error("Data Uploaded Failed");

  }
} catch (error) {
  console.error('Error uploading file:', error);
  alert('An error occurred during the file upload.');
}
};

// Trigger the file input element programmatically
const triggerFileInput = () => {
document.getElementById('fileInput').click();
};

// Set file type as 'dgps' when DGPS button is clicked
const handleDgpsButtonClick = () => {
fileType = 'dgps'; // Set file type to DGPS
triggerFileInput();
};

// Set file type as 'totalStation' when Total Station button is clicked
const handleTsButtonClick = () => {
fileType = 'totalStation'; // Set file type to Total Station
triggerFileInput();
};

const handlerwy_pf_ButtonClick = () => {
fileType = 'rwy_profile'; 
triggerFileInput();
};

let gpsTable1Id:any=[], tsTable2Id:any=[],rwyTable3Id:any=[];let currentTable = "";
// async function loadData(){
// const res: any = await client.post('data_processing_ts', {withCredentials: true});
//     if (res.status === 200) {
//       // console.log(res.data);
//       gpsTable1Id=res.data.gpsItems;
//       tsTable2Id=res.data.ts_Items;   
//       rwyTable3Id=res.data.rwy_profile_Items;  
//       console.log(gpsTable1Id,tsTable2Id)    

//     }

// }

async function loadData(table) {
    const res = await client.post('data_processing_ts', { withCredentials: true });
    if (res.status === 200) {
      gpsTable1Id = res.data.gpsItems;
      tsTable2Id = res.data.ts_Items;
      rwyTable3Id = res.data.rwy_profile_Items;
      console.log(gpsTable1Id, tsTable2Id, rwyTable3Id);
      currentTable = table;  // Set the current table based on the button clicked
    }
  }

let uploadDataOn=false,viewDataOn=false;

let gpsTable1Id_update:any=[]
let tsTable2Id_update:any=[]

function updatedgpsRow(e) {
        const rowToUpdate = gpsTable1Id.find(gps => gps.id === e);
        console.log(rowToUpdate);
        gpsTable1Id_update=rowToUpdate;
      };

      function updatedgpsField(id, field, value) {
    const rowIndex = gpsTable1Id.findIndex(gps => gps.id === id);
    if (rowIndex !== -1) {
      gpsTable1Id[rowIndex][field] = value;
    }
    console.log(gpsTable1Id); // For debugging
  };   
  
  
  async function savedgpsRow() {
    alert(`Row with ID ${gpsTable1Id_update.id} has been updated!`);
    const rowToUpdate = gpsTable1Id.find(row => row.id === gpsTable1Id_update.id);
    console.log("Updated data:", rowToUpdate);
    const res1: any = await client.post('dgpsTable_data_update',{rowToUpdate}, {withCredentials: true});
    
            if (res1.status === 200) {
              
               console.log(res1.data);
               //rowData={};
               loaddata();
            }
  };
  

function updatetsRow(e) {
        const rowToUpdate = tsTable2Id.find(ts => ts.id === e);
        console.log(rowToUpdate);
        tsTable2Id_update=rowToUpdate;
      };

      function updatetsField(id, field, value) {
    const rowIndex = tsTable2Id.findIndex(ts => ts.id === id);
    if (rowIndex !== -1) {
      tsTable2Id[rowIndex][field] = value;
    }
    console.log(tsTable2Id); // For debugging
  };   
  
  
  async function savetsRow() {
    alert(`Row with ID ${tsTable2Id_update.id} has been updated!`);
    const rowToUpdate = tsTable2Id.find(row => row.id === tsTable2Id_update.id);
    console.log("Updated data:", rowToUpdate);
    const res1: any = await client.post('tsTable_data_update',{rowToUpdate}, {withCredentials: true});
    
            if (res1.status === 200) {
              
               console.log(res1.data);
               //rowData={};
               loaddata();
            }
  };
  



</script>
<Toaster position="top-center" richColors  />
<div class='text-center' style='position: relative;top: 10px;padding-bottom: 20px;box-sizing: border-box; height: auto; overflow-y: auto;width:auto'>

  <div class='class="flex items-center"'>
  <h1 class="center-heading" style="color: Black; font-size: 1.125rem; line-height: 1; font-weight: 600;">Survey Data Upload</h1>
  </div>
<br/>

<Sheet>
  <div style="display: flex; justify-content: center; width: 100%; gap: 90px;">
    <label style="display: flex; align-items: center; gap:0px; width:30%; padding: 5px 53px; transition: all 0.3s;">
      <input type="radio" style="margin:0px; width:fit-content;" name="dataOption" on:change={() => { uploadDataOn = true; viewDataOn = false }}>
      <span style="width:100%;">
      Upload Data
    </span>
    </label>
    <label style="display: flex; align-items: center; width:30%;  padding: 5px 60px; transition: all 0.3s;">
      <input type="radio" style="margin:0px; width:fit-content;" name="dataOption" on:change={() => { viewDataOn = true; uploadDataOn = false }} >
      <span style="width:100%;">
        View Data
      </span>
    </label>
  </div>

{#if uploadDataOn}
<div style="display: flex;
  justify-content: center; 
  align-items: center; ">
<Dialog.Root>
<Dialog.Trigger>
  <button class="btn m-2" style="width:120px; padding: 7px 7px; font-size:15px; border-radius: 3px;" id="gpsbtn" on:click={handleDgpsButtonClick}>DGPS</button>
</Dialog.Trigger>
</Dialog.Root>

<Dialog.Root>
<Dialog.Trigger>
  <button class="btn m-2" style="width:120px; padding: 7px 7px; font-size:15px; border-radius: 3px;" id="tsbtn" on:click={handleTsButtonClick}>Total Station</button>
</Dialog.Trigger>
</Dialog.Root>

<Dialog.Root>
<Dialog.Trigger>
  <button class="btn m-2" style="width:120px; padding: 7px 7px; font-size:15px; border-radius: 3px;" id="rwy_profile" on:click={handlerwy_pf_ButtonClick}>Runway Profile</button>
</Dialog.Trigger>
</Dialog.Root>


  <Dialog.Root>
    <Dialog.Trigger>
      <button class="btn m-2" style="width:120px; padding: 7px 0px; font-size:15px; border-radius: 3px;" id="rwy_profile" on:click={handlerwy_pf_ButtonClick}>Ray/Intersection</button>
    </Dialog.Trigger>
    </Dialog.Root>

</div>

  <!-- <button id="gpsbtn" on:click={handleDgpsButtonClick}>DGPS Data</button>
  <button id="tsbtn" on:click={handleTsButtonClick}>Total Station</button> -->
  <input type="file" id="fileInput" accept=".csv" on:change={handleFileSelect} style="display: none;" />
{/if}
  <!-- <button on:click={uploadFile}>Upload</button> -->

{#if viewDataOn}
<div >
  <div>
    <div style="display: flex; justify-content: center; margin-bottom: 10px;">
    <div>
      <button class="btn m-2" style="width:120px; padding: 7px 7px; font-size:15px; border-radius: 3px; display:inline-block;" on:click={() => loadData("dgps")}>DGPS</button>
    </div>

    <div>
      <button class="btn m-2" style="width:120px; padding: 7px 7px; font-size:15px; border-radius: 3px; display:inline-block;" on:click={() => loadData("ts")}>Total Station</button>
    </div>

    <div>
      <button class="btn m-2" style="width:120px; padding: 7px 7px; font-size:15px; border-radius: 3px; display:inline-block;" on:click={() => loadData("rwy")}>Runway Profile</button>
    </div>

    <div>
      <button class="btn m-2" style="width:120px; padding: 7px 0px; font-size:15px; border-radius: 3px; display:inline-block;" id="rwy_profile" on:click={handlerwy_pf_ButtonClick}>Ray/Intersection</button>
    </div>
  </div>

    {#if currentTable === "dgps"}
    <div class="sm:max-w-[900px]" style="background:rgba(255,255,255,1);min-height: 35vh; left: 50%; overflow-y:auto ">
      <div style="text-center sm:text-center; justify-content: center;">
        <div style="color:black;" >DGPS Data</div>
      </div>
      <div id='gpsTbl' >
        <!-- <h1><b>DGPS Data</b></h1> -->
        <table style='border: 2px solid black; border-collapse: collapse; font-size:small;width: auto;'>
            <thead>
              <tr>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>S.No</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ID</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Point ID</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Feature Code</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Geoid Height</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Northing</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Easting</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Ellipsoid Height</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Latitude</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Longitude</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Elevation</th>
                <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Geometry</th> -->
              </tr>
            </thead>
            <tbody id='tbody'>
                {#each gpsTable1Id as gps, i}
                <tr style="height: 10px;">
                    <td style="border: 1px solid black; text-align: center;">{i+1}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.id}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.point_id}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.feature_code}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.geoid_height}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.northing}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.easting}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.ellipsoid_height}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.latitude}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.longitude}</td>
                    <td style="border: 1px solid black; text-align: center;">{gps.elevation}</td>
                    <Dialog.Root>
                      <Dialog.Trigger>
                    <td style="border: 1px solid black; text-align: center; padding:5px; cursor:pointer;" on:click={() => updatedgpsRow(gps.id)}><img src={Edit} alt="" style="width: 50px; height: 20px; "></td>
                  </Dialog.Trigger>
                  <Dialog.Content class="sm:max-w-[900px]	 top-[40%]" style="">
                    <Dialog.Header style="text-center sm:text-center; justify-content: center;">
                      <Dialog.Title style="color:black">Update DGPS Data</Dialog.Title>
                    </Dialog.Header>
                    <div style="position: relative; height:20vh; overflow: auto; left: 8%;">
                      <table style='border: 2px solid black; border-collapse: collapse; font-size:small;width: auto;'>
                        <thead>
                          <tr>
                            <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>S.No</th> -->
                            <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ID</th> -->
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Point ID</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Feature Code</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Geoid Height</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Northing</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Easting</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Ellipsoid Height</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Latitude</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Longitude</th>
                            <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Elevation</th>
                            <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Geometry</th> -->
                          </tr>
                        </thead>
                        <tbody id="tbody">
                          <tr>
                            <!-- <td style='border: 1.2px solid black; text-align: center;'><input style="width: 40px;" type="text" bind:value={gpsTable1Id_update.i} ></td> -->
                            <!-- <td style='border: 1.2px solid black; text-align: center;'><input style="width: 40px;" type="text" bind:value={gpsTable1Id_update.id} ></td> -->
                            <td style='border: 1.2px solid black; text-align: center;'><input  type="text" bind:value={gpsTable1Id_update.point_id} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'point_id', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;'><input  type="text" bind:value={gpsTable1Id_update.feature_code} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'feature_code', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;'><input  type="text" bind:value={gpsTable1Id_update.geoid_height} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'geoid_height', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;padding:0px 5px;'><input style="width: 70px;"  type="text" bind:value={gpsTable1Id_update.northing} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'northing', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;padding:0px 5px;'><input style="width: 80px;" type="text" bind:value={gpsTable1Id_update.easting} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'easting', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;'><input  type="text" bind:value={gpsTable1Id_update.ellipsoid_height} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'ellipsoid_height', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;'><input  type="text" bind:value={gpsTable1Id_update.latitude} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'latitude', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;'><input  type="text" bind:value={gpsTable1Id_update.longitude} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'longitude', e.target.value)}></td>
                            <td style='border: 1.2px solid black; text-align: center;'><input  type="text" bind:value={gpsTable1Id_update.elevation} on:change={(e) => updatedgpsField(gpsTable1Id_update.id, 'elevation', e.target.value)}></td>
                            <td style="border: 1px solid black; text-align: center; padding:5px; cursor:pointer;" on:click={(e) => savedgpsRow(gpsTable1Id_update.id,)}><img src={Save} alt="" style="width: 30px; height: 20px; "></td>
                            <!-- <td><input style="width: 40px;" type="text" bind:value={gpsTable1Id_update.point_id}></td> -->
                          </tr>
                        </tbody>
                      </table>  
                    </div>
                  </Dialog.Content>  

                    </Dialog.Root>
                    <!-- <td style="border: 1px solid black; text-align: center;">{gps.geom}</td> -->
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
  </div>
  {/if}
</div>

  <div>

    {#if currentTable === "ts"}

    <div class="sm:max-w-[900px]" style="background:rgba(255,255,255,1);min-height: 80vh; left: 50%; overflow-y:auto">
      <div style="text-center sm:text-center; justify-content: center;">
        <div style="color:black; " >TS Data</div>
      </div>
      <div id='gpsTbl' style="height:75vh; overflow: auto;padding:20px;text-align: -webkit-center;">
        <!-- <h1><b>TS Data</b></h1> -->
        <table style='border: 2px solid black; border-collapse: collapse; font-size:small;width: 95%;'>
            <thead>
            <tr>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>S.No</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ID</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>TPS</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>X</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Y</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Z</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>OBJECT</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ELEVATION</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Long</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Lat</th>
              </tr>
            </thead>
            <tbody id='tbody'>
                {#each tsTable2Id as ts, i}
                <tr style="height: 10px;">
                    <td style="border: 1px solid black; text-align: center;">{i+1}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.id}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.tps}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.x}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.y}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.z}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.object}</td>
                    <td style="border: 1px solid black; text-align: center;">{Math.round(ts.elevation)}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.longitude}</td>
                    <td style="border: 1px solid black; text-align: center;">{ts.latitude}</td>
                    <!-- <td style="border: 1px solid black; text-align: center;">{gps.geom}</td> -->
                    <Dialog.Root>
                      <Dialog.Trigger>
                    <td style="border: 1px solid black; text-align: center; padding:5px; cursor:pointer;" on:click={() => updatetsRow(ts.id)}><img src={Edit} alt="" style="width: 20px; height: 20px; "></td>
                      </Dialog.Trigger>
                      <Dialog.Content class="sm:max-w-[900px]	 top-[40%]" style="">
                        <Dialog.Header style="text-center sm:text-center; justify-content: center;">
                          <Dialog.Title style="color:black">Update TS Data</Dialog.Title>
                        </Dialog.Header>
                        <div style="position: relative; height:15vh; overflow: auto; left: 20%; width:70%;">
                          <table style='border: 2px solid black; border-collapse: collapse; font-size:small;width: 100%;'>
                            <thead>
                              <tr>
                                  <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>S.No</th> -->
                                  <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ID</th> -->
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>TPS</th>
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>X</th>
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Y</th>
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Z</th>
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>OBJECT</th>
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ELEVATION</th>
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Long</th>
                                  <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Lat</th>
                                </tr>
                              </thead>
                              <tbody id="tbody">
                                <tr style="height: 10px;">
                                  <!-- <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={gpsTable1Id_update.point_id}></td> -->
                                  <!-- <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={gpsTable1Id_update.point_id}></td> -->
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.tps} on:change={(e) => updatetsField(tsTable2Id_update.id, 'tps' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.x} on:change={(e) => updatetsField(tsTable2Id_update.id, 'x' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.y} on:change={(e) => updatetsField(tsTable2Id_update.id, 'y' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.z} on:change={(e) => updatetsField(tsTable2Id_update.id, 'z' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.object} on:change={(e) => updatetsField(tsTable2Id_update.id, 'object' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.elevation} on:change={(e) => updatetsField(tsTable2Id_update.id, 'elevation' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.longitude} on:change={(e) => updatetsField(tsTable2Id_update.id, 'longitude' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center;"><input  type="text" bind:value={tsTable2Id_update.latitude} on:change={(e) => updatetsField(tsTable2Id_update.id, 'latitude' , e.target.value)}></td>
                                  <td style="border: 1px solid black; text-align: center; padding:5px; cursor:pointer;" on:click={(e) => savetssRow(tsTable2Id_update.id,)}><img src={Save} alt="" style="width: 30px; height: 20px; "></td>
                                </tr>              
                              </tbody>
                          </table>    
                      </Dialog.Content>  
                    </Dialog.Root>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
  </div>
  {/if}
</div>

  <div>

    {#if currentTable === "rwy"}

    <div class="sm:max-w-[900px]" style="background:rgba(255,255,255,1);min-height: 80vh; left: 50%; overflow-y:auto">
      <div style="text-center sm:text-center; justify-content: center;">
        <div style="color:black; " >Runway Profile Data</div>
        </div>
      <div id='rwyTbl' style="height:75vh; overflow: auto;padding:20px;text-align: -webkit-center;">
        <!-- <h1><b>RWY Profile Data</b></h1> -->
        <table style='border: 2px solid black; border-collapse: collapse; font-size:small;width:60%; ;'>
            <thead>
            <tr>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>S.No</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ID</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Chainage</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Runway Elevation(m)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Remarks</th>    
              </tr>
            </thead>
            <tbody id='tbody'>
                {#each rwyTable3Id as rwy, i}
                <tr style="height: 10px;">
                    <td style="border: 1px solid black; text-align: center;">{i+1}</td>
                    <td style="border: 1px solid black; text-align: center;">{rwy.id}</td>
                    <td style="border: 1px solid black; text-align: center;">{rwy.chainage}</td>
                    <td style="border: 1px solid black; text-align: center;">{rwy.rwy_elev_m}</td>
                    <td style="border: 1px solid black; text-align: center;">{rwy.remarks}</td>
                    <td style="border: 1px solid black; text-align: center; padding:5px; cursor:pointer;"><img src={Edit} alt="" style="width: 20px; height: 20px; "></td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
  </div>
  {/if}
</div>
    


</div>
{/if}


  <!-- <Draggable>  -->
 

<!-- </Draggable> -->
</Sheet>    
</div>
<style>

#gpsTbl{
  height:40vh;
  overflow: auto;
  padding:20px
}

 input{
    background: white;
   width: 66px;
    height: 43px;
    color: black;
  }

</style>