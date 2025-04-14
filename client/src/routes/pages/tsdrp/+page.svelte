<script lang="ts">
    import { drawControl, surveyDataUp, pairsStore  } from "@/stores/common";
    import { toast } from "svelte-sonner";
  import { Toaster } from "$lib/components/ui/sonner";

    import * as turf from '@turf/turf';
    import client from "@/interceptors/client";
    import { json } from "@sveltejs/kit";
    import * as Dialog from "$lib/components/ui/dialog";
  import { onMount } from "svelte";


    let gpsTable1Id1:any=[],tsTable2Id1:any=[],dgpscsv:any=[],tscsv:any=[];

  onMount(() => {
  loadData();
      
	});
    
async function loadData(){


  const res1: any = await client.post('data_groupby', {withCredentials: true});
        if (res1.status === 200) {
          // console.log(res1.data);
          dgpscsv=res1.data.gps_file;
          tscsv=res1.data.ts_file;
        }
}

//async function load_data_input()
//{
  // const res: any = await client.post('data_processing_ts', {withCredentials: true});
  //       if (res.status === 200) {
  //         console.log(res.data);
  //         gpsTable1Id1=res.data.gpsItems;
  //         tsTable2Id1=res.data.ts_Items;
  //       }
//}

    // Store for pairs and a message to indicate status
    let message = '';

    let pairs:any = [];
    // $: pairsStore.subscribe(value => {
    //     pairs = value;
    // });
    $: pairs=$pairsStore;

    // Function to create a pair
    function createPair() {
        // Check if both filteredData and filteredData_ts have exactly one entry each
        if (filteredData.length === 1 && filteredData_ts.length === 1) {
            const newPair = {
                gpsData: filteredData[0],
                tsData: filteredData_ts[0]
            };

            // Check if the pair already exists
            const pairExists = pairs.some(pair =>
                pair.gpsData.point_id === newPair.gpsData.point_id &&
                pair.tsData.id === newPair.tsData.id
            );

            if (pairExists) {
                message = 'This pair has already been created!';
            } else if (pairs.length < 2) {
                pairsStore.update(currentPairs => [...currentPairs, newPair]);
                message = 'Pair created successfully!';
            } else {
                message = 'Maximum of 2 pairs can be stored.';
            }
        } else {
            message = 'You must select exactly one item from each table to create a pair.';
        }
        // console.log($pairsStore);
    }

    // Function to reset pairs
    function resetPairs() {
        pairsStore.set([]);
        pairs=[];
        message = 'Pairs have been reset.';
    }

let gpsTable1:any = null; // Holds the selected Point_ID
let filteredData:any = []; // To hold filtered results based on selected Point_ID

    // Reactive statement to filter data when selectedPointId changes
    $: if (gpsTable1) {
        filteredData = gpsTable1Id1.filter(item => item.id === gpsTable1);
    } else {
        filteredData = [];
    }

let tsTable2:any = null; // Holds the selected Point_ID
let filteredData_ts:any = []; // To hold filtered results based on selected Point_ID

    // Reactive statement to filter data when selectedPointId changes
    $: if (tsTable2) {
      filteredData_ts = tsTable2Id1.filter(item => item.id === tsTable2);
    } else {
      filteredData_ts = [];
    }    

async function process_ts()
{
  if (pairs.length == 2) {
   
    const res: any = await client.post('data_processts',{pairs,ts_csv},{withCredentials: true});
        if (res.status === 200) {
          // console.log(res.data);
          toast.success(res.data)
        }

    } 
  else {
      alert("Please Select Pair points First");
   }
}    

let dgps_csv:any =null;
let ts_csv:any=null;
let showMore=false;

async function start(){
 
  if(ts_csv !=null && dgps_csv!=null )
  {
    showMore=!showMore;
    const res: any = await client.post('data_groupby_field',{ts_csv,dgps_csv},{withCredentials: true});
        if (res.status === 200) {
          // console.log(res.data);
          gpsTable1Id1=res.data.gpsItems;
          tsTable2Id1=res.data.ts_Items;
        }
  }
  else{
    toast.error("Select Select Both Values");
    gpsTable1Id1=[];
    tsTable2Id1=[];
  }
}

</script>
<Toaster position="top-center" richColors  />
<Dialog.Header style="text-center sm:text-center; justify-content: center;">
  <Dialog.Title style="color:black; " >TS Data Refinement & Processing</Dialog.Title>
</Dialog.Header>
<div class='text-center' style='position: relative;top: 0px;padding: 20px;box-sizing: border-box; height: auto; overflow-y: auto;width:auto'>

  <!-- <div class='class="flex items-center"'>
    <p style="color: white;">TS Data Refinement & Processing  </p>
    </div>
  <br/> -->
  <div style="display: flex; justify-content: space-between; color:black;">
    <!-- DGPS File Dropdown -->
    <div class="form-group" style="flex: 1; margin-right: 10px;">
      <label for="dgps-file">Select DGPS File</label>
      <select id="dgps-file" style="text-align:center; width: 100%; background-color:white;color:black; border:1px solid gray; border-radius:3px;" bind:value={dgps_csv} class="form-control">
          <option value="" disabled>Select DGPS File</option>
          {#each dgpscsv as item}
              <option value={item.filename}>{item.filename}</option>
          {/each}
      </select>
  
      <!-- Display the selected DGPS file name -->
      {#if dgps_csv}
          <p class="mt-2">Selected DGPS File: {dgps_csv}</p>
      {/if}
    </div>
  
    <!-- TS File Dropdown -->
    <div class="form-group" style="flex: 1; margin-left: 10px;">
      <label for="ts-file">Select TS File</label>
      <select id="ts-file" style="text-align:center; width: 100%; background-color:white;color:black; border:1px solid gray; border-radius:3px;" bind:value={ts_csv} class="form-control">
          <option value="" disabled>Select TS File</option>
          {#each tscsv as item}
              <option value={item.filename}>{item.filename}</option>
          {/each}
      </select>
  
      <!-- Display the selected TS file name -->
      {#if ts_csv}
          <p class="mt-2">Selected TS File: {ts_csv}</p>
      {/if}
    </div>
  </div>
  
  <div style="display: flex; justify-content: center; margin-top:10px">
    <button class="btn" style="width:200px; padding: 7px 20px; border-radius: 3px; margin-bottom:10px" on:click={start}>Start</button>
  </div>
  
  <!-- <Sheet> -->
   {#if showMore}
    <div  style='text-align: -webkit-center;color:black'>
      <div style="display: flex; justify-content: space-between; color:black;">
        <!-- <label for="">DGPS</label> -->
         <div class="form-group" style="flex: 1; margin-right: 10px;" >
        <label for="">DGPS</label>
        <select style="text-align:center; width: 100%; background-color:white;color:black; border:1px solid gray; border-radius:3px;" bind:value={gpsTable1}>
            <option value="" disabled>Select point from DGPS</option>
            {#each gpsTable1Id1 as item}
                <option value={item.id}>{item.point_id}</option>
            {/each}
        </select>
      </div>
      <div class="form-group" style="flex: 1; margin-right: 10px;" >
        <label for="">TS</label>
        <select style="text-align:center; width: 93%; background-color:white;color:black; border:1px solid gray; border-radius:3px;" bind:value={tsTable2}>
            <option value="" disabled>Select DGPS from TS</option>
            {#each tsTable2Id1 as item}
                <option value={item.id}>{item.object}</option>
            {/each}
        </select>
  </div>
     
      </div>
      {#if filteredData.length > 0}
      <h3 class="table-title" style="color: black;">Details for DGPS Point Selected</h3>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Northing</th>
            <th>Easting</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredData as item}
            <tr>
              <td>{item.northing}</td>
              <td>{item.easting}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
    
    {#if filteredData_ts.length > 0}
      <h3 class="table-title" style="color: white;">Details for TS Point Selected</h3>
      <table class="styled-table">
        <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredData_ts as item}
            <tr>
              <td>{item.x}</td>
              <td>{item.y}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
    
    <div>
  <div style="display: flex; justify-content: center; gap:10px; margin-top:10px">
  <button class="btn" style="width:200px; padding: 7px 20px; border-radius: 3px; margin-bottom:10px" on:click={createPair}>Create Pair</button>
  <button class="btn" style="width:200px; padding: 7px 20px; border-radius: 3px; margin-bottom:10px" on:click={resetPairs}>Reset Pairs</button>
  </div>
  {#if pairs.length > 0}
    <h2 style="font-weight: 500;">Stored Pairs</h2>
    <ul>
      {#each pairs as pair}
        <li>
          DGPS: {pair.gpsData.point_id}, TS: {pair.tsData.object}
        </li>
      {/each}
    </ul>
  {/if}
  
  {#if message}
    <p>{message}</p>
  {/if}
  <button class="btn" style="width:200px; padding: 7px 20px; border-radius: 3px; margin-bottom:10px" on:click={process_ts}>Process</button>        
    </div>
  </div>
  {/if}
  <!-- </Sheet>     -->
  </div>
  <style>




    /* Styling for table title */
    .table-title {
    text-align: center;
    font-size: 1rem;
    color: #333;
    font-weight: bold;
    margin:5px
  }
  
  /* Styling for the table */
  .styled-table {
    width: 80%;
    margin: 5px auto;
    border-collapse: collapse;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .styled-table th, .styled-table td {
    padding: 6px 10px;
    text-align: center;
    border: 1px solid #ddd;
  }
  
  .styled-table th {
    background-color: rgb(246 246 247);
    color: #000000;
    font-weight: bold;
  }
  
  .styled-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .styled-table tr:hover {
    background-color: #f1f1f1;
  }
  
  .styled-table td {
    font-size: 1rem;
    color: #000000;
    background-color: rgb(249, 251, 252);
  }
  
  
  </style>