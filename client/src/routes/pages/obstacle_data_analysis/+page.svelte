<script lang="ts">
    import { Sheet, SheetTrigger } from "@/components/ui/sheet";
    import SheetContent from "@/components/ui/sheet/sheet-content.svelte";
    import {arp, obs_dataanalysis_tool,servers} from "@/stores/common";
    import { Switch } from "@/components/ui/switch";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";
    import * as turf from '@turf/turf';
    import client from "@/interceptors/client";
    import { json } from "@sveltejs/kit";
    import * as Dialog from "$lib/components/ui/dialog";
    import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import * as Select from "$lib/components/ui/select/index.js";
  import { onMount } from "svelte";
  import { currentUser } from "@/stores/auth";
  let data_aerodreome:any=[];
  let rwy_pts:any=[];
  let rwy:any,transform:any;



    onMount(async ()=>{
      loaddata();
          
    });

    async function loaddata(){
      const res: any = await client.post('rwy_points', {withCredentials: true});
        if (res.status === 200) {
         
          rwy_pts=res.data;
          console.log(rwy_pts);

        }
    }
    async function download_excel(){
  const response = await fetch(`${servers.server}/api/runway_obstacle_excel`, {
  method: 'POST',
  body: JSON.stringify({rwy}),
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
});

if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rwy_obstacle_'+rwy+'.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
} else {
    console.error('Failed to download the file');
}

}
let gpsTable1Id:any =[] ;
let viewtblOn=false;
    async function process(){
      
      const arp_ot=$arp.operation_type;
      console.log(arp_ot);
      //return;
      alert(rwy);
      alert(transform);
      const res: any = await client.post('chart_rwy',{rwy}, {withCredentials: true});
        if (res.status === 200) {
          console.log(res.data);

        }

      const res1: any = await client.post('permisible_ohs',{rwy}, {withCredentials: true});
        if (res1.status === 200) {
          console.log(res1.data);

        }  
      const res2: any = await client.post('permisible_ihs',{rwy}, {withCredentials: true});
        if (res2.status === 200) {
          console.log(res2.data);

        }
      const res3: any = await client.post('permisible_cs',{rwy}, {withCredentials: true});
        if (res3.status === 200) {
          console.log(res3.data);

        } 
     const res4: any = await client.post('permisible_trans_x',{rwy}, {withCredentials: true});
        if (res4.status === 200) {
          console.log(res4.data);

        }
     const res5: any = await client.post('permisible_trans_y',{rwy}, {withCredentials: true});
        if (res5.status === 200) {
          console.log(res5.data);

        }              
    const res6: any = await client.post('permisible_first_sec',{rwy}, {withCredentials: true});
        if (res6.status === 200) {
          console.log(res6.data);

        }       
    const res7: any = await client.post('permisible_secnd_sec',{rwy}, {withCredentials: true});
        if (res7.status === 200) {
          console.log(res7.data);

        }
    const res8: any = await client.post('surfacefor_sign',{rwy,transform}, {withCredentials: true});
        if (res8.status === 200) {
          console.log(res8.data);

        }                
    }
    async function viewTable(){
      let body={
        rwy:rwy
      }
      const res: any = await client.post('fetchData_oda',body
       ,{withCredentials: true});
    if (res.status === 200) {
      let data =res.data.data;
      gpsTable1Id=data;
      viewtblOn=true;
           
    }       
    }   


  console.log($arp);    

</script>
<Toaster position="top-center" richColors  />
<!-- <button type="button"  class="absolute left-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" style="background-color: rgb(255, 255, 255);top:0px;" on:click={() => obs_dataanalysis_tool.set(false)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-arrow-left h-4 w-4"><path d="M15 18l-6-6 6-6"></path></svg><span class="sr-only">Back</span></button> -->

<!-- <div class='justify-center' style='position: relative;top: 35px;'>
    <br/>
    <p class='aaiheaders'>Obstacle Data Analysis</p>
  <br/> -->
  <!-- <Dialog.Root>
    <Dialog.Trigger>
      <button class='my-2' title='Area of Interest'  > <span class="text">Process Rwy Chart</span></button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[900px]	p-2 m-2" style="background:rgba(135, 206, 235, 1);"> -->
      <Dialog.Header style="text-center sm:text-center; justify-content: center;">
        <Dialog.Title style="color:black; " >{$arp.airport_name} Airport</Dialog.Title>
      </Dialog.Header>
      <div class='items-center text-center' style='position: relative;top: 0px;padding: 20px;box-sizing: border-box; height: auto; width:100%' >
        <!-- <p style="color: white; margin-bottom:10px; font-size:20px">{$arp.airport_name} Airport</p> -->
               
        <div style="display: flex; justify-content: space-between; align-items: center; color: black;">
          <div style="flex: 1; margin-right: 10px;">
                <h2>Process Runway </h2>
                <select style="text-align:center;width: 100%; background-color:white;color:black; border:1px solid gray; border-radius:5px" bind:value={rwy}>
                    <option value="" disabled selected>Select Runway Start</option>
                    {#each rwy_pts as item}
                        <option value={item.name}>{item.name}</option>
                    {/each}
                </select>
                
                <!-- <h2 style="margin-left:20px">Runway End : </h2>
                <select style="text-align:center" bind:value={rwy2}>
                    <option value="" disabled>Select Runway End</option>
                    {#each rwy_pts as item}
                        <option value={item.name}>{item.name}</option>
                    {/each}
                </select> -->
                </div>

                <div style="flex: 1; margin-left: 10px;">
                  <h2>Runway transform </h2>
                  <select style="text-align:center;width: 100%; background-color:white;color:black; border:1px solid gray; border-radius:5px" bind:value={transform}>
                      <option value="" disabled selected>Select Runway transform</option>
                      <option value="normal">Normal</option> 
                      <option value="transform">Transform</option> 
                  </select>
                  </div>
                  </div>

                  <button class='btn' style="width:150px; padding: 7px 20px; border-radius: 3px; margin-bottom:2px; margin-top:10px" title='Aga Surface' on:click={()=>{process();}} > <span >Process</span></button>
                  <button class='btn' style="width:150px; padding: 7px 20px; border-radius: 3px; margin-bottom:2px; margin-top:10px" title='Aga Surface' on:click={()=>{viewTable();}} > <span >View</span></button>

                  <button class='btn' style="width:150px; padding: 7px 20px; border-radius: 3px; margin-bottom:2px; margin-top:10px" on:click={()=>{download_excel();}} > <span >Download </span></button>
      </div>   
      <div>
        {#if viewtblOn}
        <div id='gpsTbl'style="background:rgba(255,255,255,1);min-height: 45vh; left: 50%; overflow:auto;" class="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div style="text-center sm:text-center; text-align: center;">
            <div style="color:black; " >Runway</div>
          </div>
          <div id='gpsTbl' style="height:45vh; overflow: auto;padding:20px">
          <table style='border: 2px solid black; border-collapse: collapse; font-size:small;width:100%;'>
              <thead>
                  <tr>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>S.No</th>
                      <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>ID</th> -->
                      <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>UUID</th> -->
                      <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Object</th> -->
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Latitude</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Longitude</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Top Elevation</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>X</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Y</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>YY</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Permissible Top Elevation (TS Appfunel)</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Obstacle (TS Appfunel)</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Permissible Top Elevation (IHS CS)</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Obstacle (IHS CS)</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Remarks</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Type</th>
                      <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>User</th>
                      <!-- <th rowspan='2' colspan="1" style='border: 1.2px solid black; padding: 5px; text-align: center;'>Geometry</th> -->
                  </tr>
              </thead>
              <tbody id='tbody'>
                {#each gpsTable1Id as gps, i}
                  <tr style="height: 10px;">
                      <td style="border: 1px solid black; text-align: center;">{i+1}</td>
                      <!-- <td style="border: 1px solid black; text-align: center;">{gps.id}</td> -->
                      <!-- <td style="border: 1px solid black; text-align: center;">{gps.uuid}</td> -->
                      <!-- <td style="border: 1px solid black; text-align: center;">{gps.object}</td> -->
                      <td style="border: 1px solid black; text-align: center;">{gps.latitude}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.longitude}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.topelevation}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.x}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.y}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.yy}</td>
                      <td style="border: 1px solid black; text-align: center;">{Math.round(gps.permissibletopelevation_ts_appfunel)}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.obstacle_ts_appfunel}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.permissibletopelevation_ihs_cs}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.obstacle_ihs_cs}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.remarks}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.type}</td>
                      <td style="border: 1px solid black; text-align: center;">{gps.user}</td>
                      <!-- <td style="border: 1px solid black; text-align: center;">{gps.geom}</td> -->
                  </tr>
                  {/each}
              </tbody>
          </table>
        </div>
      </div>
      {/if}
      
      </div>       
    <!-- </Dialog.Content>

  </Dialog.Root>

  </div> -->
  <style>

      
    </style>