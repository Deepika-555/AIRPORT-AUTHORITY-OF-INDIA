<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { drawControl, surveyDataUp, dgpsDataProcess, tsDataRP, ipsd_tool  } from "@/stores/common";
    
    import SDU from '../sdu/+page.svelte';
    import DDP from '../ddp/+page.svelte';
    import TSDPR from '../tsdrp/+page.svelte';

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
</script>

<p class='aaiheaders'>Input & Processing of Survey Data</p> 


<!-- <Sheet> -->
<Dialog.Root>
<Dialog.Trigger>
  <button class='btn' title='Area of Interest' on:click={()=>{$surveyDataUp=!$surveyDataUp; onClickOpen('surveyDataup');}} > <span class="text">Survey Data Upload </span></button>
</Dialog.Trigger>


<Dialog.Content class="sm:max-w-[900px]	p-2 m-2" style="background:rgba(135, 206, 235, 1);">
 <SDU />
</Dialog.Content>

</Dialog.Root>

<Dialog.Root>
<Dialog.Trigger>
  <button class='btn' title='Area of Interest' on:click={()=>{$dgpsDataProcess=!$dgpsDataProcess; onClickOpen('dgpsDataProcess');}} > <span class="text">DGPS Data Processing</span></button>
</Dialog.Trigger>
<Dialog.Content class="w-full p-2 m-2" style="background:rgba(107,138,66,1);">
 <DDP />
</Dialog.Content>

</Dialog.Root>
<Dialog.Root>
<Dialog.Trigger>
  <button class='btn' title='Area of Interest' on:click={()=>{$tsDataRP=!$tsDataRP; onClickOpen('tsDataRP');}} > <span class="text">TS Data Refinement & Processing</span></button>
</Dialog.Trigger>
<Dialog.Content class="w-full p-2 m-2" style="background:rgba(135, 206, 235, 1);">
 <TSDPR />
</Dialog.Content>
</Dialog.Root>

