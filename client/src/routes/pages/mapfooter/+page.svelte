<script lang="ts">
	import { onMount } from "svelte";

    export let  curMouseLoc: any;
	
	onMount(() => {


		})	



</script>


<div class="mapfooter d-flex justify-content-between">
    <div class="location-info ">
      Lon <span id="longitude">{curMouseLoc[0].toFixed(2)}</span> 
      Lat <span id="latitude">{curMouseLoc[1].toFixed(2)}</span>
    </div>
    <div class="righttext">
      Powered by Knowledge Spatial Technology Platform 
    </div>
  </div>
  








<style>	
 .mapfooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 8px;
  left: 42%;
  transform: translateX(0%);
  padding: 3px 10px;
  width: 100%;
  max-width: 880px;
  background-color: rgba(17, 24, 39, 0.9); /* Dark background with opacity */
  color: white;
  font-size: 14px;
  border-radius: 3px;
  backdrop-filter: blur(5px); /* Subtle blur effect */
  /* z-index: 9; */
}

.location-info {
    letter-spacing: 0.1em;
    font-weight: bold;
    font-size: 0.7rem;
    color: #35a7c4;
    font-family: Inter, sans-serif;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
}
.righttext{
  letter-spacing: 0.1em;
    font-weight: bold;
    font-size: 0.7rem;
    color: #35a7c4;
    font-family: Inter, sans-serif;
    line-height: normal;
    font-weight: 600;
} 


.location-info span {
  font-weight: lighter;
  font-family: Inter, sans-serif;
  font-size: 0.7rem;
  color:white; /* Light blue for coordinates */
  padding: 0;
}

@media (max-width: 1200px) {
  .mapfooter {
    max-width: 80%;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (min-width:1221px) and (max-width:1441){
  .mapfooter {
    max-width: 80%;
    left: 33%;
    transform: translateX(-50%);
  }
}




</style>
