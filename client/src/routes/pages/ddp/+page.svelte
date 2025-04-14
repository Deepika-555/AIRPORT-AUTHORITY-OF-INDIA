<script lang="ts">
    import { drawControl, surveyDataUp  } from "@/stores/common";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";
    import * as turf from '@turf/turf';
    import client from "@/interceptors/client";
    import { json } from "@sveltejs/kit";
    import * as Dialog from "$lib/components/ui/dialog";





    let show=false;
    let controlshow=false;
    let shapeType = 'point';
    let numEdges = 0;
   

function onClickOpen(id:any){
  if (id==='surveyDataup' && $surveyDataUp) {
    surveyDataUp.set(true);
  }
}


</script>
<Toaster position="top-center" richColors  />
<Dialog.Header style="text-center sm:text-center; justify-content: center;">
  <Dialog.Title style="color:black; " >DGPS Data Processing</Dialog.Title>
</Dialog.Header>
<div class='text-center' style='position: relative;top: 10px;padding-bottom: 20px;box-sizing: border-box; height: auto; overflow-y: auto;width:auto'>
<!-- 
<div class='class="flex items-center"'>
  <h1 style="color:white">DGPS Data Processing </h1>
  </div>
<br/> -->

<!-- <Sheet> -->
  <!-- <Dialog.Root>
    <Dialog.Trigger>
      <button class='my-2' title='Area of Interest' on:click={()=>{$surveyDataUp=!$surveyDataUp; onClickOpen('surveyDataup');}} > <span class="text">Survey Data Upload </span></button>
</Dialog.Trigger>


    <Dialog.Content class="w-full p-2 m-2" style="background:rgba(107,138,66,1);">
     <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, possimus fugit aspernatur cum voluptate nulla odio deleniti cumque nihil totam! Reiciendis odit delectus labore id porro maxime dolorem totam perferendis vitae ad dignissimos doloribus harum, nobis repudiandae corporis illo? Animi consectetur vero quibusdam non. Facere suscipit, velit quos blanditiis natus, laboriosam accusamus, est hic molestiae deserunt expedita similique iure. Blanditiis dicta nam nesciunt repudiandae ducimus a quas rem officia dolorum culpa laudantium voluptate minus obcaecati est tenetur, provident ab dolor, nemo adipisci? Reiciendis architecto suscipit est in corporis temporibus quisquam quidem, repudiandae atque eligendi itaque consequatur dolores odit dolorum modi.</p>
    </Dialog.Content>

  </Dialog.Root>
    <SheetTrigger><button class='my-2' title='Area of Interest' on:click={()=>{show=!show;}} > <span class="text">DGPS Data Processing</span></button></SheetTrigger>
    <SheetTrigger><button class='my-2' title='Area of Interest' on:click={()=>{show=!show;}} > <span class="text">TS Data Refinement & Processing</span></button></SheetTrigger>
    <SheetTrigger><button class='my-2' title='Area of Interest' on:click={()=>{show=!show;}} > <span class="text">Obstacle data Analysis</span></button></SheetTrigger>
    <SheetTrigger><button class='my-2' title='Area of Interest' on:click={()=>{show=!show;}} > <span class="text">Import/Export</span></button></SheetTrigger>
    <SheetTrigger><button class='my-2' title='Area of Interest' on:click={()=>{show=!show;}} > <span class="text">Design & Drafting</span></button></SheetTrigger>
    <SheetTrigger><button class='my-2' title='Area of Interest' on:click={()=>{show=!show;}} > <span class="text">E-charting</span></button></SheetTrigger>
    <SheetTrigger><button class='my-2' title='Area of Interest' on:click={()=>{show=!show;}} > <span class="text">Comparative Study</span></button></SheetTrigger> -->

    <button class="btn" style="width:200px; padding: 7px 0px; border-radius: 3px;">Filtering DGPS data </button>
   <!-- <button>Total Station </button> -->
<!-- </Sheet>     -->
</div>
<style>

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
    color: #ffffff;
    line-height: 1.58;
    font-family: "Inter", sans-serif;
}
  
</style>