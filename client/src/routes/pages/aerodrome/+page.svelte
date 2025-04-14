<script lang="ts">
    import { Sheet, SheetTrigger } from "@/components/ui/sheet";
    import SheetContent from "@/components/ui/sheet/sheet-content.svelte";
    import { drawControl, surveyDataUp  } from "@/stores/common";
    import { Switch } from "@/components/ui/switch";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";
    import * as turf from '@turf/turf';
    import client from "@/interceptors/client";
    import { json } from "@sveltejs/kit";
    import * as Dialog from "$lib/components/ui/dialog";
  import { onMount } from "svelte";
  let data_aerodreome:any=[];
  let data_aerodreome_update:any=[];


    onMount(async ()=>{
      loaddata();
          
    });

    async function loaddata() {
            const rowData = getRowData();
            // Send rowData to the server via an API call
            //const data=rowData;
           // alert('Row added: ' + JSON.stringify(rowData));
            const res1: any = await client.post('aerodrome_fetch', {withCredentials: true});
            if (res1.status === 200) {
              
              data_aerodreome=res1.data;
               console.log(data_aerodreome);
            }
        }

      async function addRow() {
            const rowData = getRowData();
            // Send rowData to the server via an API call
            const data=rowData;
           // alert('Row added: ' + JSON.stringify(rowData));
            const res1: any = await client.post('aerodrome_data',{data}, {withCredentials: true});
            if (res1.status === 200) {
               console.log(res1.data);
               //rowData={};
               loaddata();
            }
        }

      function updateRow(e) {
        const rowToUpdate = data_aerodreome.find(row => row.id === e);
        console.log(rowToUpdate);
        data_aerodreome_update=rowToUpdate;
      }

     async function deleteRow(e) {
        const id=e;
        const res1: any = await client.post('aerodrome_delete',{id},{withCredentials: true});
            if (res1.status === 200) {
              
               //data_aerodreome=res1.data;
               //console.log(data_aerodreome);
               loaddata();
            }
      }

      function getRowData() {
          const row = document.querySelector('tr');
          const inputs = row.querySelectorAll('input');
          const data = {};
          inputs.forEach(input => {
              data[input.name] = input.value;
          });
          return data;
      }


   

    function updateField(id, field, value) {
    const rowIndex = data_aerodreome.findIndex(row => row.id === id);
    if (rowIndex !== -1) {
      data_aerodreome[rowIndex][field] = value;
    }
    console.log(data_aerodreome); // For debugging
  }

  async function saveRow() {
    alert(`Row with ID ${data_aerodreome_update.id} has been updated!`);
    const rowToUpdate = data_aerodreome.find(row => row.id === data_aerodreome_update.id);
    console.log("Updated data:", rowToUpdate);
    const res1: any = await client.post('aerodrome_data_update',{rowToUpdate}, {withCredentials: true});
            if (res1.status === 200) {
               console.log(res1.data);
               //rowData={};
               loaddata();
            }
  }

</script>
<Toaster position="top-center" richColors  />


<div class="sm:max-w-[970px]" style="background:rgba(255, 255, 255, 1); padding:0px 5px;  border-radius:3px; overflow-y:auto;">
  <div style=" background:rgb(246, 246, 247); text-center sm:text-center; justify-content: center; text-align: center; padding:5px 2px;">
    <div style="color:black;" >Airport Configuration Module</div>
  </div>
  <div id='' style="height:35vh; overflow: auto;padding:20px">
  <table style='border: 2px solid black; border-collapse: collapse; font-size:small;width: auto;'>
    <thead>
      <tr>
      <th class='w-1/6' rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>S. No.</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Airport Name</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>IACO Code</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Lat(dd)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Lat(mm)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Lat(ss)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Long(dd)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Long(mm)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Long(ss)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP Elevation(m)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Aerodrome Elevation(m)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Runway Extremity 1</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Runway Extremity 2</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Dimension X(m)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Dimension Y(m)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Operation Type</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Fwd(dd)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Fwd(mm)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Fwd(ss)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Backward(dd)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Backward(mm)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Backward(ss)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Fwd(dd)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Fwd(mm)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Fwd(ss)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Backward(dd)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Backward(mm)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Backward(ss)</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>UTM Zone</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Add</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Update</th>
      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Delete</th>
    </tr>
      </thead>
      <tbody id="tbody" class="text-center" >
  <tr class="text-center">
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="s_no" disabled value="1"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="text" name="airport_name"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="text" name="iaco_code"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="arp_lat_dd"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="arp_lat_mm"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="arp_lat_ss"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="arp_long_dd"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="arp_long_mm"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="arp_long_ss"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="arp_elevation"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="aerodrome_elevation"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="runway_extremity_1"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="runway_extremity_2"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="dimension_x_m"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="dimension_y_m"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="text" name="operation_type"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="mag_bearing_fwd_dd"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="mag_bearing_fwd_mm"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="mag_bearing_fwd_ss"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="mag_bearing_bck_dd"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="mag_bearing_bck_mm"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="mag_bearing_bck_ss"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="true_bearing_fwd_dd"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="true_bearing_fwd_mm"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="true_bearing_fwd_ss"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="true_bearing_bck_dd"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" name="true_bearing_bck_mm"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="number" step="0.01" name="true_bearing_bck_ss"></td>
            <td style='border: 1.2px solid black; text-align: center;'><input type="text" name="utm_zone"></td>
            <td style='border: 1.2px solid black; text-align: center;'><button type="button" class="btn m-2" style="width:50px; padding: 7px 7px; font-size:15px; border-radius: 3px; display:inline-block;" on:click={addRow}>Add</button></td>
            <!-- <td><button type="button" on:click={updateRow}>Update</button></td>
            <td><button type="button" on:click={deleteRow}>Delete</button></td> -->
        </tr>
    {#each data_aerodreome as row, index}
      <tr>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.id}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.airport_name}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.iaco_code}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.arp_lat_dd}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.arp_lat_mm}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.arp_lat_ss}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.arp_long_dd}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.arp_long_mm}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.arp_long_ss}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.arp_elevation}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.aerodrome_elevation}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.runway_extremity_1}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.runway_extremity_2}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.dimension_x_m}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.dimension_y_m}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.operation_type}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.mag_bearing_fwd_dd}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.mag_bearing_fwd_mm}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.mag_bearing_fwd_ss}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.mag_bearing_bck_dd}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.mag_bearing_bck_mm}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.mag_bearing_bck_ss}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.true_bearing_fwd_dd}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.true_bearing_fwd_mm}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.true_bearing_fwd_ss}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.true_bearing_bck_dd}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.true_bearing_bck_mm}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.true_bearing_bck_ss}</td>
        <td style='border: 1.2px solid black;  text-align: center;'>{row.utm_zone}</td>
        <td style='border: 1.2px solid black;  text-align: center;'></td>
        <td style='border: 1.2px solid black;  text-align: center;'>
        <Dialog.Root>
          <Dialog.Trigger>
            <button type="button" class="btn m-2" style="width:50px; padding: 7px 7px; font-size:15px; border-radius: 3px; display:inline-block;" on:click={() => updateRow(row.id)}>Update</button>
          </Dialog.Trigger>
      
      
          <Dialog.Content class="sm:max-w-[900px]	 top-[40%]" style="">
            <Dialog.Header style="text-center sm:text-center; justify-content: center;">
              <Dialog.Title style="color:black">Update Airport Configuration Module</Dialog.Title>
            </Dialog.Header>
            <div style="position: relative;
            height:20vh;
            overflow: auto; top:25%">
            <!-- <div style=" background:rgb(246, 246, 247); text-center sm:text-center; justify-content: center; text-align: center; padding:5px 2px;">
              <div style="color:black;" >Update Airport Configuration Module</div>
            </div> -->
            <table style='border: 2px solid black; border-collapse: collapse; font-size:small;'>
              <thead style="background: rgb(246, 246, 247);">
              <tr>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Airport Name</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>IACO Code</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Lat(dd)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Lat(mm)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Lat(ss)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Long(dd)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Long(mm)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP. Long(ss)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ARP Elevation(m)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Aerodrome Elevation(m)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Runway Extremity 1</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Runway Extremity 2</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Dimension X(m)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Dimension Y(m)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Operation Type</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Fwd(dd)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Fwd(mm)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Fwd(ss)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Backward(dd)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Backward(mm)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Mag. Bearing-Backward(ss)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Fwd(dd)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Fwd(mm)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Fwd(ss)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Backward(dd)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Backward(mm)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>True Bearing-Backward(ss)</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>UTM Zone</th>
                <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Update</th>
              </tr>
                </thead>
                <tbody id="tbody">
                  
                  <tr>
                  
                    <td><input style="width: 40px;" type="text" bind:value={data_aerodreome_update.airport_name} on:change={(e) => updateField(data_aerodreome_update.id, 'airport_name', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="text" bind:value={data_aerodreome_update.iaco_code} on:change={(e) => updateField(data_aerodreome_update.id, 'iaco_code', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.arp_lat_dd} on:change={(e) => updateField(data_aerodreome_update.id, 'arp_lat_dd', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.arp_lat_mm} on:change={(e) => updateField(data_aerodreome_update.id, 'arp_lat_mm', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"step="0.01"bind:value={data_aerodreome_update.arp_lat_ss} on:change={(e) => updateField(data_aerodreome_update.id, 'arp_lat_ss', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.arp_long_dd} on:change={(e) => updateField(data_aerodreome_update.id, 'arp_long_dd', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.arp_long_mm} on:change={(e) => updateField(data_aerodreome_update.id, 'arp_long_mm', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.arp_long_ss} on:change={(e) => updateField(data_aerodreome_update.id, 'arp_long_ss', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.arp_elevation} on:change={(e) => updateField(data_aerodreome_update.id, 'arp_elevation', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.aerodrome_elevation} on:change={(e) => updateField(data_aerodreome_update.id, 'aerodrome_elevation', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.runway_extremity_1} on:change={(e) => updateField(data_aerodreome_update.id, 'runway_extremity_1', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.runway_extremity_2} on:change={(e) => updateField(data_aerodreome_update.id, 'runway_extremity_2', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.dimension_x_m} on:change={(e) => updateField(data_aerodreome_update.id, 'dimension_x_m', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.dimension_y_m} on:change={(e) => updateField(data_aerodreome_update.id, 'dimension_y_m', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="text" bind:value={data_aerodreome_update.operation_type} on:change={(e) => updateField(data_aerodreome_update.id, 'operation_type', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.mag_bearing_fwd_dd} on:change={(e) => updateField(data_aerodreome_update.id, 'mag_bearing_fwd_dd', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.mag_bearing_fwd_mm} on:change={(e) => updateField(data_aerodreome_update.id, 'mag_bearing_fwd_mm', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.mag_bearing_fwd_ss} on:change={(e) => updateField(data_aerodreome_update.id, 'mag_bearing_fwd_ss', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.mag_bearing_bck_dd} on:change={(e) => updateField(data_aerodreome_update.id, 'mag_bearing_bck_dd', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.mag_bearing_bck_mm} on:change={(e) => updateField(data_aerodreome_update.id, 'mag_bearing_bck_mm', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.mag_bearing_bck_ss} on:change={(e) => updateField(data_aerodreome_update.id, 'mag_bearing_bck_ss', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.true_bearing_fwd_dd} on:change={(e) => updateField(data_aerodreome_update.id, 'true_bearing_fwd_dd', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.true_bearing_fwd_mm} on:change={(e) => updateField(data_aerodreome_update.id, 'true_bearing_fwd_mm', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.true_bearing_fwd_ss} on:change={(e) => updateField(data_aerodreome_update.id, 'true_bearing_fwd_ss', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.true_bearing_bck_dd} on:change={(e) => updateField(data_aerodreome_update.id, 'true_bearing_bck_dd', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number"bind:value={data_aerodreome_update.true_bearing_bck_mm} on:change={(e) => updateField(data_aerodreome_update.id, 'true_bearing_bck_mm', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="number" step="0.01"bind:value={data_aerodreome_update.true_bearing_bck_ss} on:change={(e) => updateField(data_aerodreome_update.id, 'true_bearing_bck_ss', e.target.value)}/></td>
                    <td><input style="width: 40px;" type="text" bind:value={data_aerodreome_update.utm_zone} on:change={(e) => updateField(data_aerodreome_update.id, 'utm_zone', e.target.value)}/></td>
                    <td>
                      <button class="btn m-2" style="width:50px; padding: 7px 7px; font-size:15px; border-radius: 3px; display:inline-block;" on:click={(e) => saveRow(data_aerodreome_update.id,)}>Save</button>
                  </td>
              </tr>
              
            </tbody>
          </table>
        </div>
          </Dialog.Content>
      
        </Dialog.Root>
        </td>
        <td style='border: 1.2px solid black; text-align: center;'><button class="btn m-2" style="width:50px; padding: 7px 7px; font-size:15px; border-radius: 3px; display:inline-block;" type="button" on:click={() => deleteRow(row.id)}>Delete</button></td> 
      </tr>
    {/each}


      
    </tbody>
    </table>
    </div>
  </div>
<style>

button {
  align-items: center;

  border: 0;
  border-radius: 8px;
 
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-size: 15px;
  justify-content: center;
  line-height: 1em;
  max-width: 100%;
  min-width: 70px;
  padding: 3px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s;
}

button:active,
button:hover {
  outline: 0;
}

button span {
  background-color: rgb(5, 6, 45);
  padding: 16px 24px;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  transition: 300ms;
}

button:hover span {
  background: none;
}

button:active {
  transform: scale(0.9);
}

.nhotext {
  font-size: 1.2rem;
    font-weight: 700;
    color: #eac600;
    line-height: 1.58;
    font-family: "Lato", sans-serif;
}
 input{
    background: white;
   width: 66px;
    height: 43px;
    color: black;
  }
</style>