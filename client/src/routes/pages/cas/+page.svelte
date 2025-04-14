<script lang="ts">
    import { Sheet, SheetTrigger } from "@/components/ui/sheet";
    import SheetContent from "@/components/ui/sheet/sheet-content.svelte";
    import {creation_arp_surface_tool,arp,curMap} from "@/stores/common";
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
  let rwy1:any,rwy2:any;
  let map:any, mapstyles:any; 



    onMount(async ()=>{
      map=$curMap;
      loaddata();
          
    });

    async function loaddata(){
      const res: any = await client.post('rwy_points', {withCredentials: true});
        if (res.status === 200) {
         
          rwy_pts=res.data;
          // console.log(rwy_pts);

        }
    }

    async function process(){
      //console.log(rwy1,rwy2); return;
    if(rwy1!= rwy2){
      const user=$currentUser.userid;
      // console.log($currentUser);
      const arp_ot=$arp.operation_type;
      // console.log(arp_ot);
      //return;
      const res: any = await client.post('cas',{user,rwy1,rwy2}, {withCredentials: true});
        if (res.status === 200) {
          console.log(res.data);

        }
      const res1: any = await client.post('ihs',{user,arp_ot}, {withCredentials: true});
        if (res1.status === 200) {
          console.log(res1.data);

        }  

        const res2: any = await client.post('cs',{user,arp_ot}, {withCredentials: true});
        if (res2.status === 200) {
          console.log(res2.data);

        }  
         const res3: any = await client.post('runway_extend',{user,arp_ot}, {withCredentials: true});
        if (res3.status === 200) {
          console.log(res3.data);

        }
        const res4: any = await client.post('runway_section',{user,arp_ot}, {withCredentials: true});
        if (res4.status === 200) {
          console.log(res4.data);

        }  

        const res5: any = await client.post('transitional_x',{user,arp_ot}, {withCredentials: true});
        if (res5.status === 200) {
          console.log(res5.data);

        }  

        const res6: any = await client.post('second_section',{user,arp_ot}, {withCredentials: true});
        if (res6.status === 200) {
          console.log(res6.data+"6");

        }  
        const res7: any = await client.post('final_agasurface',{user,arp_ot}, {withCredentials: true});
        if (res7.status === 200) {
          console.log(res7.data+"7");

        }  
        const res8: any = await client.post('rwy_profile_30m', {withCredentials: true});
        if (res8.status === 200) {
          console.log(res8.data+"8");

        }
        mapstyles = map.getStyle();
        mapstyles.layers.forEach(layer => {
    // Check if the layer's source is "aaifeats"
    if (layer.source === "aaifeats") {
        // Turn the layer's visibility off
        map.setLayoutProperty(layer.id, 'visibility', 'none');
    }
});
        toast.success("Done");
        mapstyles.layers.forEach(layer => {
    // Check if the layer's source is "aaifeats"
    if (layer.source === "aaifeats") {
        // Turn the layer's visibility off
        map.setLayoutProperty(layer.id, 'visibility', 'visible');
    }
});
          
      }
      else{
        toast.error("Please select different rwy points")
        
      }
    }
    


  console.log($arp);    

</script>
<Toaster position="top-center" richColors  />
<Dialog.Header style="text-center sm:text-center; justify-content: center;">
  <Dialog.Title style="color:black; " >{$arp.airport_name} Airport</Dialog.Title>
</Dialog.Header>

<div class='items-center text-center' style='position: relative;top: 0px;padding: 20px;box-sizing: border-box; height: auto; overflow-y: auto;width:auto' >
  <!-- <p style="color: white; margin-bottom:10px; font-size:20px">{$arp.airport_name} Airport</p> -->
 
  <div style="display: flex; justify-content: space-between; align-items: center; color: black;">
    <!-- Runway Start Dropdown -->
    <div style="flex: 1; margin-right: 10px;">
      <h2>Runway Start:</h2>
      <select style="text-align:center; width: 100%;background-color:white;color:black; border:1px solid gray; border-radius:5px" bind:value={rwy1}>
          <option value="" disabled>Select Runway Start</option>
          {#each rwy_pts as item}
              <option value={item.name}>{item.name}</option>
          {/each}
      </select>
    </div>
  
    <!-- Runway End Dropdown -->
    <div style="flex: 1; margin-left: 10px;">
      <h2>Runway End:</h2>
      <select style="text-align:center; width: 100%;background-color:white;color:black; border:1px solid gray; border-radius:5px" bind:value={rwy2}>
          <option value="" disabled>Select Runway End</option>
          {#each rwy_pts as item}
              <option value={item.name}>{item.name}</option>
          {/each}
      </select>
    </div>
  </div>
  
  <button class='btn' style="width:150px; padding: 7px 20px; border-radius: 3px; margin-bottom:2px; margin-top:10px" title='Aga Surface' on:click={()=>{process();}} >AGA Surface</button>
</div>          
  


<style>
  *{
    font-family: "Inter", sans-serif;
  }
  /* button {
    align-items: center;
    background-image: linear-gradient(144deg, #007bff, #111b69 50%, #007bff);
    border: 0;
    border-radius: 8px;
    box-shadow: #007bff 2px 1px 5px 2px;
    box-sizing: border-box;
    color: #ffffff;
    display: flex;
    font-size: 15px;
    justify-content: center;
    line-height: 1em;
    max-width: 100%;
    min-width: 20px;
    padding: 3px;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s;
    margin: 10px;
  } */
  
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
  
  /* button:active {
    transform: scale(0.9);
  } */
  
  .nhotext {
    font-size: 1.2rem;
      font-weight: 700;
      color: #eac600;
      line-height: 1.58;
      font-family: "Inter", sans-serif;
  }
    
  </style>