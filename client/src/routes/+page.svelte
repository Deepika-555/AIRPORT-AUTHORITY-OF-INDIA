<svelte:head>
    <title>Airport Authority of India</title>
    <meta name="description" content="Marine Spatial Planning System" />
</svelte:head>

<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import * as Dialog from "$lib/components/ui/dialog";
    import client from '$lib/interceptors/client';
    import { authenticated, currentUser } from '$lib/stores/auth'; 
    import { goto } from '$app/navigation';
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
 

    

    import BgImage3 from '@/assets/images/image5.jpg';
    import BgImage1 from '@/assets/images/image1.png';
    import BgImage2 from '@/assets/images/image3.jfif';
    import gif from '@/assets/images/KS_LOGO_GIF.gif';
    // import {fetchVisitorCount, fetchVisitorCountincrement } from '@/stores/common';
    
    let dialogOpen = false;
    let canvas; // Reference to the canvas
    let ctx; // Context for the canvas

    let userid: any, password: any, msg: string;

    let captcha = '';
  let userInput = '';
  let message = '';

  function generateCaptcha() {
    const randomchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniquechar = '';

    // Generate a captcha of length 5
    for (let i = 0; i < 5; i++) {
      uniquechar += randomchar.charAt(Math.floor(Math.random() * randomchar.length));
    }

    // Update the captcha state
    captcha = uniquechar;
  }

  // Function to validate user input against the generated captcha
  function captchaRefresh() {
    // Refresh the captcha
    generateCaptcha();
  }

    function setupCanvas() {
        if (canvas && typeof window !== 'undefined') {
            ctx = canvas.getContext('2d');
            setCanvasSize();
            drawPixelatedPattern();

            window.addEventListener('resize', () => {
                setCanvasSize();
                drawPixelatedPattern();
            });
        }
    }

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const colors = ['rgb(38, 38, 38)', 'rgb(44, 44, 42)', 'rgb(41, 41, 41)'];

    function randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function drawPixelatedPattern() {
        const pixelSize = 15;
        const rows = Math.ceil(canvas.width / pixelSize);
        const cols = Math.ceil(canvas.height / pixelSize);

        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                const color = colors[randomIntFromRange(0, colors.length - 1)];
                ctx.fillStyle = color;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }

    $: submit = async () => {
      if(!userid || !password) {
          msg=`Please enter ${!userid?'userid':'password'}!`;
          return
        }
        try {
          const res: any = await client.post('login', {
            userid,
            password,
          }, {withCredentials: true});
          // if (res.status === 200 && userInput === captcha) {
          if (res.status === 200) {
            client.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            authenticated.set(true);
            const response: any = await client.get('user', {withCredentials: true});
            currentUser.set(response.data);
            goto('/map');

          } else {
          toast.error('Invalid Captcha')
            captchaRefresh();
            msg = res.response.data.message;
          }
        } catch (res) {
          console.log(res)
        }
    }

    let images = [
        { image: BgImage1, text: "Charting Harmony Between Nature & Progress" },
        { image: BgImage2, text: "Sustainable Ocean with Smarter Spatial Decisions" },
        { image: BgImage3, text: "Unlocking Ocean Potential & Preserving Ocean Life" }
    ];

    let currentIndex = 0;
    let bgImage = images[currentIndex].image;
    let bgText = images[currentIndex].text;
    let fadeOut = false;

    function changeImage() {
        setTimeout(() => {
            fadeOut = true;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                bgImage = images[currentIndex].image;
                bgText = images[currentIndex].text;
                fadeOut = false;
                changeImage();
            }, 500);
        }, 5000);
    }

    let cursorStyle = { top: '0px', left: '0px' };

    function updateCursorPosition(event) {
        cursorStyle = { top: `${event.clientY}px`, left: `${event.clientX}px` };
    }

    onMount(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', updateCursorPosition);
            setupCanvas();
            changeImage();
        }
        generateCaptcha();
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('mousemove', updateCursorPosition);
        }
    });
</script>
<Toaster position="top-center" richColors  />

<section >
  <div class="custom-cursor" style="top: {cursorStyle.top}; left: {cursorStyle.left}; "></div>
  <div class="line-container">


    <div class="line1">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
    </div>
    
    <div class="line2">
        <div class="dot dot1"></div>
        <div class="dot dot2"></div>
    </div>
    </div>
    
  <h1 class="centered-heading ">
    <!-- <div class="animate-charcter">GeoPortal <br> Digitization of Survey and Charting Procedures for Aerodrome Safeguarding </div></h1> -->
    <span class="text1">
      <div class="wave-text">
        <span style="--i:1">G</span>
        <span style="--i:1">E</span>
        <span style="--i:1">O</span>
        <span style="--i:1">P</span>
        <span style="--i:1">O</span>
        <span style="--i:1">R</span>
        <span style="--i:1">T</span>
        <span style="--i:1">A</span>
        <span style="--i:1">L</span>
      </div> 
    </span> 
    <span class="text2"> DIGITIZATION OF SURVEY AND CHARTING PROCEDURES FOR AERODROME SAFEGAURDING </span></h1>
  <img src={bgImage} class={`bgimg ${fadeOut ? 'fade-out' : 'fade-in'}`} alt="Background Image">
  <div class="text-grid">
    <!-- Common text for every image -->
    <!-- <div class="grid-item1">
        <p>Where Science Meets Strategy for Marine Planning & Development</p>
    </div> -->

    <!-- Dynamic text for each image -->
    <!-- <div class="grid-item2">
        <p>{bgText}</p>
    </div> -->
</div>

    <Dialog.Root>
      <Dialog.Trigger><button class="login-button">
        
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-right">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12h8"/>
                <path d="m12 16 4-4-4-4"/>
            </svg>
            <span class="login-text">
                <div class="waviy">
                    <span style="--i:1">L</span>
                    <span style="--i:2">o</span>
                    <span style="--i:3">g</span>
                    <span style="--i:4">i</span>
                    <span style="--i:5">n</span>
                </div>
            </span>
        
    </button>

  </Dialog.Trigger>


      <Dialog.Content class="max-w-[100%] p-0 m-0" style="background:rgba(107,138,66,1);">
        <canvas id="militaryCanvas"></canvas>




        <!-- import logoutIcon from '@/assets/images/logout.svg' -->

        <div id="log" class="d-flex justify-content-center align-items-center">
          <div class="aeroplane-1">
            <i class="aeroplane-icon">
               <svg width="40px" height="40px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="rotate(45)">
      
                  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                  
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                  
                  <g id="SVGRepo_iconCarrier">
                  
                  <path d="M930.21885 94.836128c31.585402 30.754207 32.224782 81.297243 1.438607 112.850675l-133.278886 133.310856-154.602229 154.634198-219.403453 219.403453-161.667385 52.493147 48.78474-165.407761 215.375355-215.343387 150.126565-150.126564 140.376011-140.344042c30.754207-31.585402 81.297243-32.256751 112.850675-1.470575z" fill="#5FCEFF"/>
                  
                  <path d="M832.553464 529.742812l50.798789 280.78399-52.7489 52.7489-186.827011-367.643845 154.602229-154.634198zM676.992164 236.650745l-150.126565 150.126564-351.307671-178.579001 52.7489-52.7489 448.653367 81.169368z" fill="#8B87C1"/>
                  
                  <path d="M424.372889 715.03531l-25.926884 183.726015-56.489276 56.553214-79.251225-187.786082z" fill="#FFB578"/>
                  
                  <path d="M311.490244 602.120696l-48.78474 165.407761-189.128781-80.593925 57.384408-55.658081z" fill="#FF4893"/>
                  
                  <path d="M526.849614 409.162024a22.31758 22.31758 0 0 1-10.121394-2.432843L165.417352 228.146983a22.378321 22.378321 0 0 1-5.684094-35.773345l52.7489-52.748899a22.352746 22.352746 0 0 1 19.808011-6.195598l448.653367 81.169367a22.378321 22.378321 0 0 1 18.036927 26.003609 22.365533 22.365533 0 0 1-26.003609 18.036926L235.848322 179.557254l-22.662845 22.666042 323.823895 164.605339a22.378321 22.378321 0 0 1-10.159758 42.333389zM830.603353 885.654023a22.378321 22.378321 0 0 1-19.951872-12.240942l-186.827011-367.643845a22.378321 22.378321 0 1 1 39.897349-20.277956l172.859743 340.153676 22.662845-22.662845-82.889301-458.001111a22.378321 22.378321 0 0 1 44.040536-7.973076l84.973681 469.53234a22.371927 22.371927 0 0 1-6.195598 19.808011l-52.748899 52.7489a22.36873 22.36873 0 0 1-15.821473 6.556848z" fill="#4F46A3"/>
                  
                  <path d="M341.956729 977.69286a22.387912 22.387912 0 0 1-20.616827-13.676351l-75.731435-179.448559-180.804046-77.048559a22.371927 22.371927 0 0 1-6.806207-36.649296l57.384409-55.658082a22.378321 22.378321 0 0 1 12.010765-6.029359l173.387231-28.001673 500.762886-500.702145c19.191009-19.712104 45.191421-30.687072 73.00128-30.687072 26.799638 0 52.122307 10.306815 71.303724 29.021486 19.542668 19.027967 30.508045 44.55204 30.856508 71.850395 0.345266 27.304749-9.96155 53.103756-29.034273 72.64962L445.485236 725.569105l-24.881496 176.321988a22.378321 22.378321 0 0 1-6.326671 12.688508l-56.489276 56.550017a22.378321 22.378321 0 0 1-15.831064 6.563242z m-228.626518-298.143174l158.147595 67.390715a22.384715 22.384715 0 0 1 11.844525 11.886086l66.316556 157.130979 27.694771-27.723543 24.881496-176.328381a22.41029 22.41029 0 0 1 6.333065-12.698099L915.82959 191.86533c10.524205-10.789548 16.316993-25.284306 16.121982-40.626243a56.984796 56.984796 0 0 0-17.346396-40.370491 57.058325 57.058325 0 0 0-40.060391-16.316993 56.968811 56.968811 0 0 0-41.144142 17.365577L327.311717 617.948562a22.362336 22.362336 0 0 1-12.253729 6.26593l-173.572652 28.033643-28.155125 27.301551zM832.553464 552.121133a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.884974a22.378321 22.378321 0 1 1 31.642946 31.646143l-65.888171 65.888171a22.311186 22.311186 0 0 1-15.821473 6.553651zM861.964971 671.973026a22.378321 22.378321 0 0 1-15.827866-38.196597l65.859398-65.888171a22.378321 22.378321 0 0 1 31.655734 31.636552l-65.859399 65.888171a22.304792 22.304792 0 0 1-15.827867 6.560045zM502.505198 222.072867a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.856202a22.378321 22.378321 0 1 1 31.636552 31.652537l-65.884974 65.856202a22.304792 22.304792 0 0 1-15.818276 6.550454zM382.685274 192.725297a22.378321 22.378321 0 0 1-15.827867-38.196597l65.888171-65.92014a22.378321 22.378321 0 0 1 31.652536 31.639749l-65.888171 65.92014a22.301595 22.301595 0 0 1-15.824669 6.556848z" fill="#4F46A3"/>
                  
                  <path d="M262.702307 789.913172a22.384715 22.384715 0 0 1-6.90531-43.669695l161.667384-52.493148a22.378321 22.378321 0 1 1 13.820212 42.569961l-161.667385 52.493147a22.474228 22.474228 0 0 1-6.914901 1.099735z" fill="#4F46A3"/>
                  
                  <path d="M262.715095 789.913172a22.378321 22.378321 0 0 1-21.473598-28.714583l48.78474-165.404564a22.378321 22.378321 0 0 1 42.928014 12.662932l-48.78474 165.404565a22.394306 22.394306 0 0 1-21.454416 16.05165z" fill="#4F46A3"/>
                  
                  </g>
                  
                  </svg>
                  
            </i>
         </div>

         <div class="aeroplane-2">
          <i class="aeroplane-icon">
             <svg width="40px" height="40px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="rotate(45)">
    
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                
                <g id="SVGRepo_iconCarrier">
                
                <path d="M930.21885 94.836128c31.585402 30.754207 32.224782 81.297243 1.438607 112.850675l-133.278886 133.310856-154.602229 154.634198-219.403453 219.403453-161.667385 52.493147 48.78474-165.407761 215.375355-215.343387 150.126565-150.126564 140.376011-140.344042c30.754207-31.585402 81.297243-32.256751 112.850675-1.470575z" fill="#5FCEFF"/>
                
                <path d="M832.553464 529.742812l50.798789 280.78399-52.7489 52.7489-186.827011-367.643845 154.602229-154.634198zM676.992164 236.650745l-150.126565 150.126564-351.307671-178.579001 52.7489-52.7489 448.653367 81.169368z" fill="#8B87C1"/>
                
                <path d="M424.372889 715.03531l-25.926884 183.726015-56.489276 56.553214-79.251225-187.786082z" fill="#FFB578"/>
                
                <path d="M311.490244 602.120696l-48.78474 165.407761-189.128781-80.593925 57.384408-55.658081z" fill="#FF4893"/>
                
                <path d="M526.849614 409.162024a22.31758 22.31758 0 0 1-10.121394-2.432843L165.417352 228.146983a22.378321 22.378321 0 0 1-5.684094-35.773345l52.7489-52.748899a22.352746 22.352746 0 0 1 19.808011-6.195598l448.653367 81.169367a22.378321 22.378321 0 0 1 18.036927 26.003609 22.365533 22.365533 0 0 1-26.003609 18.036926L235.848322 179.557254l-22.662845 22.666042 323.823895 164.605339a22.378321 22.378321 0 0 1-10.159758 42.333389zM830.603353 885.654023a22.378321 22.378321 0 0 1-19.951872-12.240942l-186.827011-367.643845a22.378321 22.378321 0 1 1 39.897349-20.277956l172.859743 340.153676 22.662845-22.662845-82.889301-458.001111a22.378321 22.378321 0 0 1 44.040536-7.973076l84.973681 469.53234a22.371927 22.371927 0 0 1-6.195598 19.808011l-52.748899 52.7489a22.36873 22.36873 0 0 1-15.821473 6.556848z" fill="#4F46A3"/>
                
                <path d="M341.956729 977.69286a22.387912 22.387912 0 0 1-20.616827-13.676351l-75.731435-179.448559-180.804046-77.048559a22.371927 22.371927 0 0 1-6.806207-36.649296l57.384409-55.658082a22.378321 22.378321 0 0 1 12.010765-6.029359l173.387231-28.001673 500.762886-500.702145c19.191009-19.712104 45.191421-30.687072 73.00128-30.687072 26.799638 0 52.122307 10.306815 71.303724 29.021486 19.542668 19.027967 30.508045 44.55204 30.856508 71.850395 0.345266 27.304749-9.96155 53.103756-29.034273 72.64962L445.485236 725.569105l-24.881496 176.321988a22.378321 22.378321 0 0 1-6.326671 12.688508l-56.489276 56.550017a22.378321 22.378321 0 0 1-15.831064 6.563242z m-228.626518-298.143174l158.147595 67.390715a22.384715 22.384715 0 0 1 11.844525 11.886086l66.316556 157.130979 27.694771-27.723543 24.881496-176.328381a22.41029 22.41029 0 0 1 6.333065-12.698099L915.82959 191.86533c10.524205-10.789548 16.316993-25.284306 16.121982-40.626243a56.984796 56.984796 0 0 0-17.346396-40.370491 57.058325 57.058325 0 0 0-40.060391-16.316993 56.968811 56.968811 0 0 0-41.144142 17.365577L327.311717 617.948562a22.362336 22.362336 0 0 1-12.253729 6.26593l-173.572652 28.033643-28.155125 27.301551zM832.553464 552.121133a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.884974a22.378321 22.378321 0 1 1 31.642946 31.646143l-65.888171 65.888171a22.311186 22.311186 0 0 1-15.821473 6.553651zM861.964971 671.973026a22.378321 22.378321 0 0 1-15.827866-38.196597l65.859398-65.888171a22.378321 22.378321 0 0 1 31.655734 31.636552l-65.859399 65.888171a22.304792 22.304792 0 0 1-15.827867 6.560045zM502.505198 222.072867a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.856202a22.378321 22.378321 0 1 1 31.636552 31.652537l-65.884974 65.856202a22.304792 22.304792 0 0 1-15.818276 6.550454zM382.685274 192.725297a22.378321 22.378321 0 0 1-15.827867-38.196597l65.888171-65.92014a22.378321 22.378321 0 0 1 31.652536 31.639749l-65.888171 65.92014a22.301595 22.301595 0 0 1-15.824669 6.556848z" fill="#4F46A3"/>
                
                <path d="M262.702307 789.913172a22.384715 22.384715 0 0 1-6.90531-43.669695l161.667384-52.493148a22.378321 22.378321 0 1 1 13.820212 42.569961l-161.667385 52.493147a22.474228 22.474228 0 0 1-6.914901 1.099735z" fill="#4F46A3"/>
                
                <path d="M262.715095 789.913172a22.378321 22.378321 0 0 1-21.473598-28.714583l48.78474-165.404564a22.378321 22.378321 0 0 1 42.928014 12.662932l-48.78474 165.404565a22.394306 22.394306 0 0 1-21.454416 16.05165z" fill="#4F46A3"/>
                
                </g>
                
                </svg>
          </i>
       </div>

       <div class="aeroplane-3">
          <i class="aeroplane-icon">
             <svg width="40px" height="40px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="rotate(45)">
    
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                
                <g id="SVGRepo_iconCarrier">
                
                <path d="M930.21885 94.836128c31.585402 30.754207 32.224782 81.297243 1.438607 112.850675l-133.278886 133.310856-154.602229 154.634198-219.403453 219.403453-161.667385 52.493147 48.78474-165.407761 215.375355-215.343387 150.126565-150.126564 140.376011-140.344042c30.754207-31.585402 81.297243-32.256751 112.850675-1.470575z" fill="#5FCEFF"/>
                
                <path d="M832.553464 529.742812l50.798789 280.78399-52.7489 52.7489-186.827011-367.643845 154.602229-154.634198zM676.992164 236.650745l-150.126565 150.126564-351.307671-178.579001 52.7489-52.7489 448.653367 81.169368z" fill="#8B87C1"/>
                
                <path d="M424.372889 715.03531l-25.926884 183.726015-56.489276 56.553214-79.251225-187.786082z" fill="#FFB578"/>
                
                <path d="M311.490244 602.120696l-48.78474 165.407761-189.128781-80.593925 57.384408-55.658081z" fill="#FF4893"/>
                
                <path d="M526.849614 409.162024a22.31758 22.31758 0 0 1-10.121394-2.432843L165.417352 228.146983a22.378321 22.378321 0 0 1-5.684094-35.773345l52.7489-52.748899a22.352746 22.352746 0 0 1 19.808011-6.195598l448.653367 81.169367a22.378321 22.378321 0 0 1 18.036927 26.003609 22.365533 22.365533 0 0 1-26.003609 18.036926L235.848322 179.557254l-22.662845 22.666042 323.823895 164.605339a22.378321 22.378321 0 0 1-10.159758 42.333389zM830.603353 885.654023a22.378321 22.378321 0 0 1-19.951872-12.240942l-186.827011-367.643845a22.378321 22.378321 0 1 1 39.897349-20.277956l172.859743 340.153676 22.662845-22.662845-82.889301-458.001111a22.378321 22.378321 0 0 1 44.040536-7.973076l84.973681 469.53234a22.371927 22.371927 0 0 1-6.195598 19.808011l-52.748899 52.7489a22.36873 22.36873 0 0 1-15.821473 6.556848z" fill="#4F46A3"/>
                
                <path d="M341.956729 977.69286a22.387912 22.387912 0 0 1-20.616827-13.676351l-75.731435-179.448559-180.804046-77.048559a22.371927 22.371927 0 0 1-6.806207-36.649296l57.384409-55.658082a22.378321 22.378321 0 0 1 12.010765-6.029359l173.387231-28.001673 500.762886-500.702145c19.191009-19.712104 45.191421-30.687072 73.00128-30.687072 26.799638 0 52.122307 10.306815 71.303724 29.021486 19.542668 19.027967 30.508045 44.55204 30.856508 71.850395 0.345266 27.304749-9.96155 53.103756-29.034273 72.64962L445.485236 725.569105l-24.881496 176.321988a22.378321 22.378321 0 0 1-6.326671 12.688508l-56.489276 56.550017a22.378321 22.378321 0 0 1-15.831064 6.563242z m-228.626518-298.143174l158.147595 67.390715a22.384715 22.384715 0 0 1 11.844525 11.886086l66.316556 157.130979 27.694771-27.723543 24.881496-176.328381a22.41029 22.41029 0 0 1 6.333065-12.698099L915.82959 191.86533c10.524205-10.789548 16.316993-25.284306 16.121982-40.626243a56.984796 56.984796 0 0 0-17.346396-40.370491 57.058325 57.058325 0 0 0-40.060391-16.316993 56.968811 56.968811 0 0 0-41.144142 17.365577L327.311717 617.948562a22.362336 22.362336 0 0 1-12.253729 6.26593l-173.572652 28.033643-28.155125 27.301551zM832.553464 552.121133a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.884974a22.378321 22.378321 0 1 1 31.642946 31.646143l-65.888171 65.888171a22.311186 22.311186 0 0 1-15.821473 6.553651zM861.964971 671.973026a22.378321 22.378321 0 0 1-15.827866-38.196597l65.859398-65.888171a22.378321 22.378321 0 0 1 31.655734 31.636552l-65.859399 65.888171a22.304792 22.304792 0 0 1-15.827867 6.560045zM502.505198 222.072867a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.856202a22.378321 22.378321 0 1 1 31.636552 31.652537l-65.884974 65.856202a22.304792 22.304792 0 0 1-15.818276 6.550454zM382.685274 192.725297a22.378321 22.378321 0 0 1-15.827867-38.196597l65.888171-65.92014a22.378321 22.378321 0 0 1 31.652536 31.639749l-65.888171 65.92014a22.301595 22.301595 0 0 1-15.824669 6.556848z" fill="#4F46A3"/>
                
                <path d="M262.702307 789.913172a22.384715 22.384715 0 0 1-6.90531-43.669695l161.667384-52.493148a22.378321 22.378321 0 1 1 13.820212 42.569961l-161.667385 52.493147a22.474228 22.474228 0 0 1-6.914901 1.099735z" fill="#4F46A3"/>
                
                <path d="M262.715095 789.913172a22.378321 22.378321 0 0 1-21.473598-28.714583l48.78474-165.404564a22.378321 22.378321 0 0 1 42.928014 12.662932l-48.78474 165.404565a22.394306 22.394306 0 0 1-21.454416 16.05165z" fill="#4F46A3"/>
                
                </g>
                
                </svg>
          </i>
       </div>

       <div class="aeroplane-4">
          <i class="aeroplane-icon">
             <svg width="40px" height="40px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="rotate(45)">
    
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                
                <g id="SVGRepo_iconCarrier">
                
                <path d="M930.21885 94.836128c31.585402 30.754207 32.224782 81.297243 1.438607 112.850675l-133.278886 133.310856-154.602229 154.634198-219.403453 219.403453-161.667385 52.493147 48.78474-165.407761 215.375355-215.343387 150.126565-150.126564 140.376011-140.344042c30.754207-31.585402 81.297243-32.256751 112.850675-1.470575z" fill="#5FCEFF"/>
                
                <path d="M832.553464 529.742812l50.798789 280.78399-52.7489 52.7489-186.827011-367.643845 154.602229-154.634198zM676.992164 236.650745l-150.126565 150.126564-351.307671-178.579001 52.7489-52.7489 448.653367 81.169368z" fill="#8B87C1"/>
                
                <path d="M424.372889 715.03531l-25.926884 183.726015-56.489276 56.553214-79.251225-187.786082z" fill="#FFB578"/>
                
                <path d="M311.490244 602.120696l-48.78474 165.407761-189.128781-80.593925 57.384408-55.658081z" fill="#FF4893"/>
                
                <path d="M526.849614 409.162024a22.31758 22.31758 0 0 1-10.121394-2.432843L165.417352 228.146983a22.378321 22.378321 0 0 1-5.684094-35.773345l52.7489-52.748899a22.352746 22.352746 0 0 1 19.808011-6.195598l448.653367 81.169367a22.378321 22.378321 0 0 1 18.036927 26.003609 22.365533 22.365533 0 0 1-26.003609 18.036926L235.848322 179.557254l-22.662845 22.666042 323.823895 164.605339a22.378321 22.378321 0 0 1-10.159758 42.333389zM830.603353 885.654023a22.378321 22.378321 0 0 1-19.951872-12.240942l-186.827011-367.643845a22.378321 22.378321 0 1 1 39.897349-20.277956l172.859743 340.153676 22.662845-22.662845-82.889301-458.001111a22.378321 22.378321 0 0 1 44.040536-7.973076l84.973681 469.53234a22.371927 22.371927 0 0 1-6.195598 19.808011l-52.748899 52.7489a22.36873 22.36873 0 0 1-15.821473 6.556848z" fill="#4F46A3"/>
                
                <path d="M341.956729 977.69286a22.387912 22.387912 0 0 1-20.616827-13.676351l-75.731435-179.448559-180.804046-77.048559a22.371927 22.371927 0 0 1-6.806207-36.649296l57.384409-55.658082a22.378321 22.378321 0 0 1 12.010765-6.029359l173.387231-28.001673 500.762886-500.702145c19.191009-19.712104 45.191421-30.687072 73.00128-30.687072 26.799638 0 52.122307 10.306815 71.303724 29.021486 19.542668 19.027967 30.508045 44.55204 30.856508 71.850395 0.345266 27.304749-9.96155 53.103756-29.034273 72.64962L445.485236 725.569105l-24.881496 176.321988a22.378321 22.378321 0 0 1-6.326671 12.688508l-56.489276 56.550017a22.378321 22.378321 0 0 1-15.831064 6.563242z m-228.626518-298.143174l158.147595 67.390715a22.384715 22.384715 0 0 1 11.844525 11.886086l66.316556 157.130979 27.694771-27.723543 24.881496-176.328381a22.41029 22.41029 0 0 1 6.333065-12.698099L915.82959 191.86533c10.524205-10.789548 16.316993-25.284306 16.121982-40.626243a56.984796 56.984796 0 0 0-17.346396-40.370491 57.058325 57.058325 0 0 0-40.060391-16.316993 56.968811 56.968811 0 0 0-41.144142 17.365577L327.311717 617.948562a22.362336 22.362336 0 0 1-12.253729 6.26593l-173.572652 28.033643-28.155125 27.301551zM832.553464 552.121133a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.884974a22.378321 22.378321 0 1 1 31.642946 31.646143l-65.888171 65.888171a22.311186 22.311186 0 0 1-15.821473 6.553651zM861.964971 671.973026a22.378321 22.378321 0 0 1-15.827866-38.196597l65.859398-65.888171a22.378321 22.378321 0 0 1 31.655734 31.636552l-65.859399 65.888171a22.304792 22.304792 0 0 1-15.827867 6.560045zM502.505198 222.072867a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.856202a22.378321 22.378321 0 1 1 31.636552 31.652537l-65.884974 65.856202a22.304792 22.304792 0 0 1-15.818276 6.550454zM382.685274 192.725297a22.378321 22.378321 0 0 1-15.827867-38.196597l65.888171-65.92014a22.378321 22.378321 0 0 1 31.652536 31.639749l-65.888171 65.92014a22.301595 22.301595 0 0 1-15.824669 6.556848z" fill="#4F46A3"/>
                
                <path d="M262.702307 789.913172a22.384715 22.384715 0 0 1-6.90531-43.669695l161.667384-52.493148a22.378321 22.378321 0 1 1 13.820212 42.569961l-161.667385 52.493147a22.474228 22.474228 0 0 1-6.914901 1.099735z" fill="#4F46A3"/>
                
                <path d="M262.715095 789.913172a22.378321 22.378321 0 0 1-21.473598-28.714583l48.78474-165.404564a22.378321 22.378321 0 0 1 42.928014 12.662932l-48.78474 165.404565a22.394306 22.394306 0 0 1-21.454416 16.05165z" fill="#4F46A3"/>
                
                </g>
                
                </svg>
          </i>
       </div>

       <div class="aeroplane-5">
          <i class="aeroplane-icon">
             <svg width="40px" height="40px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="rotate(45)">
    
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                
                <g id="SVGRepo_iconCarrier">
                
                <path d="M930.21885 94.836128c31.585402 30.754207 32.224782 81.297243 1.438607 112.850675l-133.278886 133.310856-154.602229 154.634198-219.403453 219.403453-161.667385 52.493147 48.78474-165.407761 215.375355-215.343387 150.126565-150.126564 140.376011-140.344042c30.754207-31.585402 81.297243-32.256751 112.850675-1.470575z" fill="#5FCEFF"/>
                
                <path d="M832.553464 529.742812l50.798789 280.78399-52.7489 52.7489-186.827011-367.643845 154.602229-154.634198zM676.992164 236.650745l-150.126565 150.126564-351.307671-178.579001 52.7489-52.7489 448.653367 81.169368z" fill="#8B87C1"/>
                
                <path d="M424.372889 715.03531l-25.926884 183.726015-56.489276 56.553214-79.251225-187.786082z" fill="#FFB578"/>
                
                <path d="M311.490244 602.120696l-48.78474 165.407761-189.128781-80.593925 57.384408-55.658081z" fill="#FF4893"/>
                
                <path d="M526.849614 409.162024a22.31758 22.31758 0 0 1-10.121394-2.432843L165.417352 228.146983a22.378321 22.378321 0 0 1-5.684094-35.773345l52.7489-52.748899a22.352746 22.352746 0 0 1 19.808011-6.195598l448.653367 81.169367a22.378321 22.378321 0 0 1 18.036927 26.003609 22.365533 22.365533 0 0 1-26.003609 18.036926L235.848322 179.557254l-22.662845 22.666042 323.823895 164.605339a22.378321 22.378321 0 0 1-10.159758 42.333389zM830.603353 885.654023a22.378321 22.378321 0 0 1-19.951872-12.240942l-186.827011-367.643845a22.378321 22.378321 0 1 1 39.897349-20.277956l172.859743 340.153676 22.662845-22.662845-82.889301-458.001111a22.378321 22.378321 0 0 1 44.040536-7.973076l84.973681 469.53234a22.371927 22.371927 0 0 1-6.195598 19.808011l-52.748899 52.7489a22.36873 22.36873 0 0 1-15.821473 6.556848z" fill="#4F46A3"/>
                
                <path d="M341.956729 977.69286a22.387912 22.387912 0 0 1-20.616827-13.676351l-75.731435-179.448559-180.804046-77.048559a22.371927 22.371927 0 0 1-6.806207-36.649296l57.384409-55.658082a22.378321 22.378321 0 0 1 12.010765-6.029359l173.387231-28.001673 500.762886-500.702145c19.191009-19.712104 45.191421-30.687072 73.00128-30.687072 26.799638 0 52.122307 10.306815 71.303724 29.021486 19.542668 19.027967 30.508045 44.55204 30.856508 71.850395 0.345266 27.304749-9.96155 53.103756-29.034273 72.64962L445.485236 725.569105l-24.881496 176.321988a22.378321 22.378321 0 0 1-6.326671 12.688508l-56.489276 56.550017a22.378321 22.378321 0 0 1-15.831064 6.563242z m-228.626518-298.143174l158.147595 67.390715a22.384715 22.384715 0 0 1 11.844525 11.886086l66.316556 157.130979 27.694771-27.723543 24.881496-176.328381a22.41029 22.41029 0 0 1 6.333065-12.698099L915.82959 191.86533c10.524205-10.789548 16.316993-25.284306 16.121982-40.626243a56.984796 56.984796 0 0 0-17.346396-40.370491 57.058325 57.058325 0 0 0-40.060391-16.316993 56.968811 56.968811 0 0 0-41.144142 17.365577L327.311717 617.948562a22.362336 22.362336 0 0 1-12.253729 6.26593l-173.572652 28.033643-28.155125 27.301551zM832.553464 552.121133a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.884974a22.378321 22.378321 0 1 1 31.642946 31.646143l-65.888171 65.888171a22.311186 22.311186 0 0 1-15.821473 6.553651zM861.964971 671.973026a22.378321 22.378321 0 0 1-15.827866-38.196597l65.859398-65.888171a22.378321 22.378321 0 0 1 31.655734 31.636552l-65.859399 65.888171a22.304792 22.304792 0 0 1-15.827867 6.560045zM502.505198 222.072867a22.378321 22.378321 0 0 1-15.821473-38.202991l65.888171-65.856202a22.378321 22.378321 0 1 1 31.636552 31.652537l-65.884974 65.856202a22.304792 22.304792 0 0 1-15.818276 6.550454zM382.685274 192.725297a22.378321 22.378321 0 0 1-15.827867-38.196597l65.888171-65.92014a22.378321 22.378321 0 0 1 31.652536 31.639749l-65.888171 65.92014a22.301595 22.301595 0 0 1-15.824669 6.556848z" fill="#4F46A3"/>
                
                <path d="M262.702307 789.913172a22.384715 22.384715 0 0 1-6.90531-43.669695l161.667384-52.493148a22.378321 22.378321 0 1 1 13.820212 42.569961l-161.667385 52.493147a22.474228 22.474228 0 0 1-6.914901 1.099735z" fill="#4F46A3"/>
                
                <path d="M262.715095 789.913172a22.378321 22.378321 0 0 1-21.473598-28.714583l48.78474-165.404564a22.378321 22.378321 0 0 1 42.928014 12.662932l-48.78474 165.404565a22.394306 22.394306 0 0 1-21.454416 16.05165z" fill="#4F46A3"/>
                
                </g>
                
                </svg>
          </i>
       </div>

            <div class="container-fluid" >
              <form on:submit|preventDefault={submit}> 
              <div class="box" >
          
                   
          
              <div class="input-container">
                  <label for="floatingInput">Username:</label>
                  <input type="text"  name="name" id="floatingInput" placeholder="Username"  bind:value={userid}>
                </div>
          
          
                <div class="input-container1">
                  <label  for="floatingPassword">Password:</label>
                  <input type="password" id="floatingPassword" placeholder="Password" bind:value={password}>
                </div>

                <div class="input-container2">
                  <label for="captchaInput">Captcha:</label>
                  <input type="text" id="captchaInput" bind:value={userInput} placeholder="Enter Captcha">
                </div>
                
                <div class="inline">
                  <i class="fas fa-sync"></i> 
                </div>
                
                <div id="image" class="inline">
                  <!-- Display the generated CAPTCHA -->
                  <span id="captchaDisplay">{captcha}</span>
                  <span id="captchaRefresh" on:click={captchaRefresh}>⟲</span>
                </div>
                
                <!-- <input type="submit" id="btn" style="position: absolute; left:70%;top:70%;" on:click={printmsg} value="Submit"> -->
                
                <div id="key">{message}</div>

                {#if msg}
                <div class="alert alert-warning" role="alert" style=" z-index: 99;">
                  {msg}
                </div>
              {/if}
          
               <!-- Buttons -->
          <div class="btn-container">
              <div class="btn1">
                  <button class="tab-button" type="submit" >Log In</button>
                  <div class="hollow-rectangle"></div>
                   <!-- Left vertical rectangle -->
                <!-- <div class="hollow-rectangle-right"></div> -->
              
                <!-- <div class="hollow-rectangle-left"></div> -->
                 </div>
              
                 
          </div>
          
              
                
              </div>
            </form>
            </div>
          
          <!-- <button style="top:0;left:0;z-index:999;position:absolute" ><a href="/" ><img src="{HomeSvg}" alt="" style="height:30px;width:30px"></a>
            </button> -->
        </div>
      </Dialog.Content>
    </Dialog.Root>


    <!-- <div style="position: absolute; z-index: 2; bottom: 35px; right: -50px">
      <img src={gif} alt="Your GIF" style="max-width: 50%; ">
    </div> -->
  <div style="z-index: 2;">
      <p id="leftfooter">Developed by Airports Authority of India</p>
      <p id="rightfooter">Powered by Knowledge Spatial Generative Technology Platform</p>
  </div>
</section>


<style>

/* .aeroplane-icon svg {
  width: 50px;
  z-index: 999;
} */


.aeroplane-1 {
  position: relative;
  width: 45px;
  height: 45px;
  margin-bottom: 20px;
  top: -160px;
  left: 225px;
}

.aeroplane-1 .aeroplane-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  transform: rotate(225deg);
  -webkit-animation: move-aeroplane-1 10s infinite;
  animation: move-aeroplane-1 10s infinite;
}

.aeroplane-1 .aeroplane-icon:after {
  position: absolute;
  right: 0;
  top: 15px;
  content: '';
  height: 1px;
  width: 0px;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,ffffff+100 */
  background: #ffffff; /* Old browsers */
  background: -moz-linear-gradient(left, rgba(0,0,0,0.09) 0%, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
  -webkit-animation: line-1 10s infinite;
  animation: line-1 10s infinite;
  animation-fill-mode: forwards;
}

@-webkit-keyframes move-aeroplane-1 {
  0% {
    bottom: 10px;
    right: 10px;
    opacity: 0;
    transform: rotate(225deg) scale(0);
  }

  30% {
    bottom: 10px;
    right: 10px;
    opacity: 1;
    transform: rotate(225deg) scale(1);
  }

  70% {
    bottom: 200px;
    right: 180px;
    opacity: 1;
    transform: rotate(225deg) scale(1);
  }

  100% {
    bottom: 200px;
    right: 180px;
    opacity: 0;
    transform: rotate(225deg) scale(0);
  }
}
@keyframes move-aeroplane-1 {
  0% {
    bottom: 10px;
    right: 10px;
    opacity: 0;
    transform: rotate(225deg) scale(0);
  }

  30% {
    bottom: 10px;
    right: 10px;
    opacity: 1;
    transform: rotate(225deg) scale(1);
  }

  70% {
    bottom: 200px;
    right: 180px;
    opacity: 1;
    transform: rotate(225deg) scale(1);
  }

  100% {
    bottom: 200px;
    right: 180px;
    opacity: 0;
    transform: rotate(225deg) scale(0);
  }
}

@-webkit-keyframes line-1 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}

@keyframes line-1 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}

.aeroplane-2 {
  position: relative;
  width: 45px;
  height: 45px;
  margin-bottom: 20px;
  left: -40%;
  top: -20%;
}

.aeroplane-2 .aeroplane-icon {
  position: absolute;
  left: 0;
  top: 0;
  -webkit-animation: move-aeroplane-2 15s infinite;
  animation: move-aeroplane-2 15s infinite;
}

.aeroplane-2 .aeroplane-icon:after {
  position: absolute;
  right: 0;
  top: 15px;
  content: '';
  height: 1px;
  width: 0;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,ffffff+100 */
  background: #ffffff; /* Old browsers */
  background: -moz-linear-gradient(left, rgba(0,0,0,0.09) 0%, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
  -webkit-animation: line-2 15s infinite;
  animation: line-2 15s infinite;
  animation-fill-mode: forwards;
}

@-webkit-keyframes move-aeroplane-2 {
  0% {
    left: 10px;
    opacity: 0;
    transform: scale(0);
  }

  30% {
    left: 10px;
    opacity: 1;
    transform: scale(1);
  }

  70% {
    left: 500px;
    opacity: 1;
    transform: scale(1);
  }

  100% {
    left: 500px;
    opacity: 0;
    transform: scale(0);
  }
}
@keyframes move-aeroplane-2 {
  0% {
    left: 10px;
    opacity: 0;
    transform: scale(0);
  }

  30% {
    left: 10px;
    opacity: 1;
    transform: scale(1);
  }

  70% {
    left: 500px;
    opacity: 1;
    transform: scale(1);
  }

  100% {
    left: 500px;
    opacity: 0;
    transform: scale(0);
  }
}

@-webkit-keyframes line-2 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}
@keyframes line-2 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}


.aeroplane-3 {
  position: relative;
  width: 45px;
  height: 45px;
  margin-bottom: 20px;
  top: 300px;
  left: 350px;
}

.aeroplane-3 .aeroplane-icon {
  position: absolute;
  right: 0;
  top: 0;
  transform: rotate(-45deg);
  -webkit-animation: move-aeroplane-3 13s infinite;
  animation: move-aeroplane-3 13s infinite;
}

.aeroplane-3 .aeroplane-icon:before {
  position: absolute;
  left: 0;
  top: 15px;
  content: '';
  height: 1px;
  width: 0px;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,ffffff+100 */
  background: #ffffff; /* Old browsers */
  background: -moz-linear-gradient(left, rgba(0,0,0,0.09) 0%, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
  -webkit-animation: line-3 13s infinite;
  animation: line-3 13s infinite;
  animation-fill-mode: forwards;
}

@-webkit-keyframes move-aeroplane-3 {
  0% {
    top: -10px;
    left: 10px;
    opacity: 0;
    transform: rotate(-45deg) scale(0);
  }

  30% {
    top: -10px;
    left: 10px;
    opacity: 1;
    transform: rotate(-45deg) scale(1);
  }

  70% {
    top: -160px;
    left: 200px;
    opacity: 1;
    transform: rotate(-45deg) scale(1);
  }

  100% {
    top: -160px;
    left: 200px;
    opacity: 0;
    transform: rotate(-45deg) scale(0);
  }
}
@keyframes move-aeroplane-3 {
  0% {
    top: -10px;
    left: 10px;
    opacity: 0;
    transform: rotate(-45deg) scale(0);
  }

  30% {
    top: -10px;
    left: 10px;
    opacity: 1;
    transform: rotate(-45deg) scale(1);
  }

  70% {
    top: -160px;
    left: 200px;
    opacity: 1;
    transform: rotate(-45deg) scale(1);
  }

  100% {
    top: -160px;
    left: 200px;
    opacity: 0;
    transform: rotate(-45deg) scale(0);
  }
}

@-webkit-keyframes line-3 {
  0% {
    width: 0;
    opacity: 0;
    left: 0;
  }

  30% {
    width: 0;
    opacity: 0;
    left: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
    left: -100px;
  }

  55% {
    width: 100px;
    opacity: 1;
    left: -100px;
  }

  70% {
    width: 0;
    opacity: 0;
    left: 0;
  }

  100% {
    width: 0;
    opacity: 0;
    left: 0;
  }
}
@keyframes line-3 {
  0% {
    width: 0;
    opacity: 0;
    left: 0;
  }

  30% {
    width: 0;
    opacity: 0;
    left: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
    left: -100px;
  }

  55% {
    width: 100px;
    opacity: 1;
    left: -100px;
  }

  70% {
    width: 0;
    opacity: 0;
    left: 0;
  }

  100% {
    width: 0;
    opacity: 0;
    left: 0;
  }
}


.aeroplane-4 {
  position: relative;
  width: 45px;
  height: 45px;
  left: 610px;
  top: -130px;
}

.aeroplane-4 .aeroplane-icon {
  position: absolute;
  left: 0;
  top: 0;
  transform: rotate(90deg);
  -webkit-animation: move-aeroplane-4 11s infinite;
  animation: move-aeroplane-4 11s infinite;
}

.aeroplane-4 .aeroplane-icon:after {
  position: absolute;
  right: 0;
  top: 15px;
  content: '';
  height: 1px;
  width: 0;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,ffffff+100 */
  background: #ffffff; /* Old browsers */
  background: -moz-linear-gradient(left, rgba(0,0,0,0.09) 0%, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
  -webkit-animation: line-4 11s infinite;
  animation: line-4 11s infinite;
  animation-fill-mode: forwards;
}

@-webkit-keyframes move-aeroplane-4 {
  0% {
    top: 10px;
    opacity: 0;
    transform: rotate(90deg) scale(0);
  }

  30% {
    top: 10px;
    opacity: 1;
    transform: rotate(90deg) scale(1);
  }

  70% {
    top: 250px;
    opacity: 1;
    transform: rotate(90deg) scale(1);
  }

  100% {
    top: 250px;
    opacity: 0;
    transform: rotate(90deg) scale(0);
  }
}
@keyframes move-aeroplane-4 {
  0% {
    top: 10px;
    opacity: 0;
    transform: rotate(90deg) scale(0);
  }

  30% {
    top: 10px;
    opacity: 1;
    transform: rotate(90deg) scale(1);
  }

  70% {
    top: 250px;
    opacity: 1;
    transform: rotate(90deg) scale(1);
  }

  100% {
    top: 250px;
    opacity: 0;
    transform: rotate(90deg) scale(0);
  }
}

@-webkit-keyframes line-4 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}
@keyframes line-4 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}


.aeroplane-5 {
  position: relative;
  width: 45px;
  height: 45px;
  left: -40%;
  top: 30%;
}

.aeroplane-5 .aeroplane-icon {
  position: absolute;
  left: 0;
  top: 0;
  -webkit-animation: move-aeroplane-5 17s infinite;
  animation: move-aeroplane-5 17s infinite;
}

.aeroplane-5 .aeroplane-icon:after {
  position: absolute;
  right: 0;
  top: 15px;
  content: '';
  height: 1px;
  width: 0;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#000000+0,ffffff+100 */
  background: #ffffff; /* Old browsers */
  background: -moz-linear-gradient(left, rgba(0,0,0,0.09) 0%, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, rgba(0,0,0,0.09) 0%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#ffffff',GradientType=1 ); /* IE6-9 */
  -webkit-animation: line-5 17s infinite;
  animation: line-5 17s infinite;
  animation-fill-mode: forwards;
}

@-webkit-keyframes move-aeroplane-5 {
  0% {
    left: 10px;
    opacity: 0;
    transform: scale(0);
  }

  30% {
    left: 10px;
    opacity: 1;
    transform: scale(1);
  }

  70% {
    left: 200px;
    opacity: 1;
    transform: scale(1);
  }

  100% {
    left: 200px;
    opacity: 0;
    transform: scale(0);
  }
}
@keyframes move-aeroplane-5 {
  0% {
    left: 10px;
    opacity: 0;
    transform: scale(0);
  }

  30% {
    left: 10px;
    opacity: 1;
    transform: scale(1);
  }

  70% {
    left: 200px;
    opacity: 1;
    transform: scale(1);
  }

  100% {
    left: 200px;
    opacity: 0;
    transform: scale(0);
  }
}

@-webkit-keyframes line-5 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}
@keyframes line-5 {
  0% {
    width: 0;
    opacity: 0;
  }

  30% {
    width: 0;
    opacity: 0;
  }

  45% {
    width: 100px;
    opacity: 1;
  }

  55% {
    width: 100px;
    opacity: 1;
  }

  70% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}


  .inline {
      margin: 10px;
      cursor: pointer;
      left: 88%;
      position: absolute;
      color: white;
      top: 49%;
      z-index: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0px;
  
    }
  
    #captchaDisplay {
      left: -135%;
      position: relative;
      font-size: 20px;
      font-weight: bold;
      color: rgb(234, 198, 0);
    }
  
    #captchaRefresh {
   
      /* font-size: 20px; */
      /* font-weight: bold; */
      color: rgb(53 167 196);
      position: absolute;
      top: 13px;
      right: 105%;
    }
  
    #key {
      font-size: 16px;
      margin-top: 10px;
      color: white;
      z-index: 1;
      position: absolute;
      top: 58%;
    }
  
  .text-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          position: absolute;
          height: 40%;
          bottom: 30%;
          width: 100%;
          padding: 0 5%;
          z-index: 2;
          color: white;
          font-family: "Russo One";
      }
  
      .text-grid .grid-item1 {
          background: none;
          padding: 20px;
          border-radius: 10px;
          font-size: 1.5rem;
          animation: drop-in 2s ease 200ms backwards;
      }
  
      @keyframes drop-in {
          from {
              opacity: 0;
              transform: translateY(-100px);
          }
          to {
              opacity: 1;
              transform: translate(0px);
          }
      }
  
      .text-grid .grid-item2 {
          background: none;
          padding: 20px;
          border-radius: 10px;
          color: rgb(234, 198, 0);
          text-align: center;
          align-items: center;
          display: flex;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          position: relative;
          transform: translateX(30%);
          opacity: 0;
          animation: slide-in-anim 3s ease-out forwards;
      }
  
      @keyframes slide-in-anim {
          0% {
              opacity: 0.5;
          }
  
          100% {
              opacity: 1;
              transform: translateX(-10%);
          }
      }
  
  
     
  
  .line-container{
          position: relative;
          width: 100%;
          height: 100vh;
   z-index: 2;
      }
  
      .line1 {
          position: absolute;
          top: 80%;
     
          width: 150%; /* Make it span full width of the parent */
          height: 2px;
          background-color: black; /* Line color */
          margin-left: 100px; /* Adjust to position the line vertically */
          left: 8%;
          transform: rotate(90deg);
      }
  
      .line2 {
          position: absolute;
          transform: rotate(90deg);
          width: 150%; /* Make it span full width of the parent */
          height: 2px;
          background-color: black; /* Line color */
          margin-left: 100px; /* Adjust to position the line vertically */
          top: 30%;
          left: 14%;
      }
  
      .dot {
          position: absolute;
          top: -1px; /* Adjust to vertically center the dots above the line */
          width: 10px;
          height: 5px;
          background-color: #eac600; /* Dot color */
          border-radius: 50%; /* Makes the dots circular */
      }
  
      /* Animation for dots moving across the line */
      @keyframes moveDot {
          0% {
              left: 0;
          }
          100% {
              left: 100%;
          }
      }
  
      .dot1 {
          animation: moveDot 6s linear infinite;
      }
  
      .dot2 {
          animation: moveDot 6s linear infinite;
          animation-delay: 3s; /* Delays the start of the second dot */
      }
  
  .login-button {
          position: absolute;
          bottom: 25%;
          left: 10%;
          z-index: 2;
          background: none;
          border: none;
          cursor: pointer;
          display: inline-block;
          
      }
  
    
  
      .login-button svg {
          vertical-align: middle;
          margin-right: 10px;
          display: inline-block;
          color: #eac600;
      }
  
      .login-text {
          display: inline-block;
          vertical-align: middle;
      }
  
      .waviy span {
          position: relative;
          display: inline-block;
          font-size: 30px;
          color: #eac600;
          animation: flip 2s infinite;
          animation-delay: calc(.2s * var(--i));
      }
  
      @keyframes flip {
          0%, 80% {
              transform: rotateY(360deg);
          }
      }
  
      .login-button a {
          color: #adff00;
          text-decoration: none;
      }
  
      #leftfooter{
      padding-left: 50px;
      padding-right: 50px;
      bottom: 5px;
      left: 0;
      position: absolute;
      font-weight: 200;
      font-family: Inter, sans-serif;
      font-size: 10px;
      line-height: normal;
      background-color: rgba(128, 128, 128, 0.7); /* Gray background with 70% opacity */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Optional: shadow for extra emphasis */
      color: white;
      border-radius: 25px;
  
      }
      #rightfooter{
      padding-right: 50px;
      padding-left: 50px;
      bottom: 5px;
      border-radius: 25px;
      position: absolute;
      right: 0;
      font-family: Inter, sans-serif;
      font-weight: 200;
      font-size: 10px;
      line-height: normal;
      background-color: rgba(128, 128, 128, 0.7); /* Gray background with 70% opacity */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Optional: shadow for extra emphasis */
      color: white;
      }
      section {
          margin: 0;
          padding: 0;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden; /* Prevent scrollbars due to absolutely positioned elements */
          color: white;
      }
      
      .centered-heading {
          /* position: absolute;
          top:50px;
          font-size: 1.5rem; 
          font-weight: bold;
          text-align: center; */
          /* margin: 0; */
          font-family: Inter, sans-serif;
          line-height: normal;
          padding: 1rem 1rem; 
          background: none; 
           
          /* color: white; */
          z-index: 2; 
      }
  
      .centered-heading {
        text-align: center;
    position: absolute;
    top: 100px;
    /* font-size: 1.5rem;  */
          /* font-weight: bold; */
          text-align: center;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    
      }
  
      .centered-heading span {
    text-transform: uppercase;
    /* display: block; */
    display: inline-block;
    vertical-align: middle;
      }
  
  
      .text1 {
    color: white;
    font-size: 40px;
    font-weight: 700;
    /* letter-spacing: 8px; */
    margin-bottom: 20px;
    /* background: rgb(0, 0, 0); */
    position: relative;
    /* display: inline-block; */
    font-family: Inter, sans-serif;
    line-height: normal;   
    width: 400px;
  }
  
  .wave-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
  position: relative;
  overflow: hidden; /* Prevents overflow if text moves out of view */
}

.wave-text span {
  display: inline-block;
  opacity: 0;
  position: relative;
  animation: flight 5s ease forwards infinite;
  animation-delay: calc(var(--i) * 0.1s);
  transform: scale(0.1); /* Initial small size */
}

@keyframes flight {
  0% {
    transform: translateX(-100px) scale(0.1);
    opacity: 0;
  }
  50% {
    transform: translateX(50px) scale(1.2); /* Mid-size, moving right */
    opacity: 0.5;
  }
  100% {
    transform: translateX(0) scale(1); /* Final size and position */
    opacity: 1;
  }

}
  
  .text2 {
    font-family: Inter, sans-serif;
    line-height: normal;
    font-size: 27px;
    color: #ffaf00;
    position: relative;
    animation: bounce 2s ease-in-out infinite;
  }
  
  /* Bouncing animation */
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0); /* Starting at normal position */
    }
    30% {
      transform: translateY(-20px); /* Move up */
    }
    50% {
      transform: translateY(0); /* Back to normal position */
    }
    70% {
      transform: translateY(-10px); /* Move up a bit */
    }
    90% {
      transform: translateY(0); /* Back to normal position */
    }
  }
  
  
      .animate-charcter{
        background-image: -webkit-linear-gradient(92deg, #28C76F, #0396FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-animation: hue 3s infinite linear;
      }
  
      @-webkit-keyframes hue {
      from {
          -webkit-filter: hue-rotate(0deg);
      }
  
      to {
          -webkit-filter: hue-rotate(-360deg);
      }
  }
  
      /* .animate-charcter {
          text-transform: uppercase;
          color: #f5f5f5;
      text-shadow: 1px 1px 1px #919191,
          1px 2px 1px #919191,
          1px 3px 1px #919191,
          1px 4px 1px #919191,
          1px 5px 1px #919191,
          1px 6px 1px #919191,
          1px 7px 1px #919191,
          1px 8px 1px #919191,
          1px 9px 1px #919191,
          1px 10px 1px #919191,
      1px 18px 6px rgba(16,16,16,0.4),
      1px 22px 10px rgba(16,16,16,0.2),
      1px 25px 35px rgba(16,16,16,0.2),
      1px 30px 60px rgba(16,16,16,0.4);
          background-size: auto auto;
          background-clip: border-box;
          background-size: 200% auto;
         
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
      
          
          display: inline-block;
          font-size: 2rem;
          font-family: "Russo One";
  
      } */
  
  
      .bgimg {
          height: 100vh;
          width: 100vw;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          transition: opacity 1s ease-in-out; /* Smooth transition for image change */
          filter: brightness(50%);
      }
      .fade-in {
          opacity: 1;
      }
      .fade-out {
          opacity: 0;
      }
      /* .login-button {
          height: 50px;
          width: 100px;
          position: absolute;
          top: 85vh;
          left: 5vw;
          z-index: 2;
          background-color: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
      }
      .login-button:hover {
          height: 55px;
          width: 105px;
          position: absolute;
          top: 85vh;
          left: 5vw;
          z-index: 2;
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          color:  rgba(0, 0, 0, 1);
          font-size: 16px;
          cursor: pointer;
      }
      .login-button a {
          color: white;
          text-decoration: none;
      } */
      .custom-cursor {
      /* position: fixed;
      width: 20px; 
      height: 20px; 
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: background-color 0.3s ease;  */
  
      position: fixed;
      width: 1px;
      height: 1px;
      pointer-events: none;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 100px 70px rgb(225 242 2 / 40%);
      z-index: 9999;
    }
    #log {
      position: relative;
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  #log::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/image3.jfif');
      background-size: cover;
      background-position: center;
      filter: brightness(50%); /* Adjust the brightness value as needed */
      z-index: -1; /* Ensure the background image is behind the content */
  }
  
    
    #militaryCanvas {
      display: block;
      position: absolute;
    
      top: 0;
      left: 0;
      z-index: 99; /* Canvas stays behind the content */
      
    }
  
    .form-signin {
      max-width: 330px;
      padding: 1rem;
      background-color: rgba(255, 255, 255, 0.8); /* Adjust transparency as needed */
      border-radius: 10px; /* Rounded corners */
    }
  
    h1 {
      color: #ffaf00;
      text-shadow: 2px 2px  #1f4941 ;
    }
  
    .btn-primary {
      background-color: #ffaf00;
      color: white;
      border: none;
    }
  
    .btn-primary:hover {
      background-color: #1f4941;
      color: #ffaf00;
    }
  
    .form-signin .form-floating:focus-within {
      z-index: 2;
    }
  
    /* .form-signin input[type="email"] {
      margin-bottom: -1px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    } */
  
    .form-signin input[type="password"] {
      margin-bottom: 10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  
  
  
    .container-fluid {
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        position: absolute;
        top: 5%;
      }
    
      .box {
          display: flex;
          flex-direction: column; /* Arrange buttons in a column */
       align-items: center; /* Center buttons horizontally */
    justify-content: center; /* Center buttons vertically */
        width: 140mm;
        height: 85mm;
        border: 4px solid white; /* White inner border */
        /* background: repeating-linear-gradient(
          0deg, 
          #272727,  
          #272727 3px,  
          #37414b 3px,  
          #37414b 6px  
        ); */
        background: rgba(17, 24, 39, 0.75);
        position: relative; /* Positioning for pseudo-elements */
        /* border-radius: 12px; Apply radius to the main box */
        box-shadow: 0 4px 60px #050505;
      }
    
      .box::before {
    content: '';
    position: absolute;
    top: -21px; /* Position the grey border outside the white border */
    left: -20px; /* Position the grey border outside the white border */
    right: -20px; /* Position the grey border outside the white border */
    bottom: -21px; /* Position the grey border outside the white border */
    border-radius: 25px; /* Apply radius to the grey border */
    border: 15px solid #645c53; /* Grey border */
    z-index: 1; /* Ensure it is behind the white border */ 
    /* Gradient for the border   #D9DAD9, #68A4A5, #4C8055 */
    border-image: linear-gradient(20deg,    #111827,#604439, #192338af 	) 1; 
    /* Clip-path to cut 2% off each corner */
    
  }
  
    
      .box::after {
        content: '';
        position: absolute;
        top: -5px; /* Position the black border outside the grey border */
        left: -5px; /* Position the black border outside the grey border */
        right: -5px; /* Position the black border outside the grey border */
        bottom: -5px; /* Position the black border outside the grey border */
        border: 3px solid black; /* Black border */
        z-index: 0; /* Ensure it is above the grey border */
      }
  
  
      /* The rectangle covering the top border */
   .rectangle1 {
        position: absolute;
        top: -32px;
        left: 39%;
        width: 23%;
        height: 5px;
        /* border: 2px solid black; */
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 3px solid #d5cfb7;
        z-index: 4;
  
    }
  
   /* The rectangle covering the top border */
   .rectangle2 {
          position: absolute;
          top: -29px;
      left: 37%;
      width: 27%;
      height: 5px;
      
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 3px solid #979390;
      z-index: 5;
  
    }
  
    .rectangle2::before {
    content: '';
    position: absolute;
    top: -4px; /* Position above the element to create the black border effect */
    left: -4px; /* Position the border to match the size of the rectangle */
    right: -4px;
    bottom: -4px;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid black; /* Black border at the top */
    z-index: -1; /* Ensure it's behind the original rectangle */
  }
  
      /* The rectangle covering the top border */
      .rectangle {
          position: absolute;
          top: -30px;
      left: 14%;
      width: 73.5%;
      height: 31px; /* Adjust height to match the height of the trapezoid */
      background: linear-gradient(to left, #607744, #1e2f23); /* Linear gradient */
      z-index: 4;
  
      /* Clip-path to mimic the effect of the border */
      clip-path: polygon(
        0px 0%,    /* Top-left indentation */
        calc(100% - 0px) 0%, /* Top-right indentation */
        96% 100%,  /* Bottom-right corner */
        4% 100%     /* Bottom-left corner */)
  
      }
  
    /* The triangle at the bottom of the rectangle */
    .triangle {
      position: absolute;
      top: 0.5px; /* Attach the base of the triangle to the bottom of the rectangle */
      left: 51%;
      transform: translateX(-50%) rotate(180deg);
      width: 68%;
      height: 0;
      padding-top: 20px; /* Set the height of the triangle using padding */
      background: linear-gradient(to right, #607744, #1e2f23); /* Linear gradient */
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      z-index: 3;
      
    }
  
  
     /* The rectangle covering the top border */
   .rectangle3 {
      position: absolute;
      top: -25px;
      left: 11%;
      width: 80%;
      height: 5px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #b7eeaa;
      z-index: 2;
  
    }
  
     /* The rectangle covering the top border */
   .rectangle4 {
      position: absolute;
      top: -16px;
      left: 12%;
      width: 78%;
      height: 5px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #b7eeaa;
      z-index: 2;
  
    }
  
      /* The rectangle covering the top border */
   .rectangle5 {
      position: absolute;
      top: -7px;
      left: 13%;
      width: 76%;
      height: 5px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #b7eeaa;
      z-index: 2;
  
    }
  
  
  
     /* Text inside the rectangle and triangle */
     .center-text {
      position: absolute;
      top: -25px; /* Adjust as needed */
      left: 50%;
      background: none;
      transform: translateX(-50%);
      font-size: 24px;
      color: #fbb444;
      font-weight: bold;
      text-align: center;
      z-index: 4; /* Ensure the text is above all other elements */
    }
  
    /* Vertical rectangle for the left side */
  .rectangle-left {
    position: absolute;
    top: 33%; /* Adjust vertically based on the height of the box */
    left: -29px; /* Position to the left of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 30%; /* Tall height to match the Y-axis */
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 8px solid #d5cfb7; /* Solid left border for the rectangle */
    z-index: 2;
  }
  
    /* Vertical rectangle for the left side */
    .rectangle-left-top {
    position: absolute;
    top: 6%; /* Adjust vertically based on the height of the box */
    left: -29px; /* Position to the left of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 14%; /* Tall height to match the Y-axis */
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 4px solid #d5cfb7; /* Solid left border for the rectangle */
    z-index: 1;
  }
  
   /* Vertical rectangle for the left side */
   .rectangle-left-bottom {
    position: absolute;
    top: 74.5%; /* Adjust vertically based on the height of the box */
    left: -29px; /* Position to the left of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 14%; /* Tall height to match the Y-axis */
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 4px solid #d5cfb7; /* Solid left border for the rectangle */
    z-index: 1;
  }
  
  /* Vertical rectangle for the right side */
  .rectangle-right {
    position: absolute;
    top: 33%; /* Adjust vertically based on the height of the box */
    right: -29px; /* Position to the right of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 30%; /* Tall height to match the Y-axis */
    border-top: 6px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 8px solid #d5cfb7; /* Solid right border for the rectangle */
    z-index: 2;
  }
  
  /* Vertical rectangle for the right side */
  .rectangle-right-top {
    position: absolute;
    top: 6%; /* Adjust vertically based on the height of the box */
    right: -29px; /* Position to the right of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 14%; /* Tall height to match the Y-axis */
    border-top: 6px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid #d5cfb7; /* Solid right border for the rectangle */
    z-index: 2;
  }
  
  /* Vertical rectangle for the right side */
  .rectangle-right-bottom {
    position: absolute;
    top: 74.5%; /* Adjust vertically based on the height of the box */
    right: -29px; /* Position to the right of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 14%; /* Tall height to match the Y-axis */
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid #d5cfb7; /* Solid right border for the rectangle */
    z-index: 2;
  }
  
  
  /* Hollow vertical rectangle for the left side */
  .rectangle-left1 {
    position: absolute;
    top: 20%; /* Adjust vertically based on the height of the box */
    left: -29px; /* Position to the left of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 55%; /* Tall height to match the Y-axis */
    border-left: 3px solid #d5cfb7; /* Left border line */
    border-top: 2px solid #645c53;  /* Top border line */
    border-bottom: 2px solid #645c53; /* Bottom border line */
    z-index: 2;
    background: transparent; /* Ensure no background color */
  
  }
  
  /* Hollow vertical rectangle for the right side */
  .rectangle-right1 {
    position: absolute;
    top: 20%; /* Adjust vertically based on the height of the box */
    right: -30px; /* Position to the right of the box */
    width: 9px; /* Narrow width for a vertical shape */
    height: 55%; /* Tall height to match the Y-axis */
    border-right: 3px solid #d5cfb7; /* Right border line */
    border-top: 2px solid #645c53; /* Top border line */
    border-bottom: 2px solid #645c53; /* Bottom border line */
    z-index: 2;
    background: transparent; /* Ensure no background color */
    
  }
  @font-face {
      font-family: 'Russo One';
      src: url('/Russo_One/RussoOne-Regular.ttf') format('truetype');
  
    }
  /* Hollow top right-angled triangle with hypotenuse on the top side */
  .triangle-top {
      position: absolute;
      top: 51.8px;
      left: 102%;
      transform: translateX(50%) rotate(-90deg);
      width: 15px;
      height: 11px;
      z-index: 4;
      clip-path: polygon(0% 100%, /* Bottom vertex */ 0% 0%, /* Top vertex (point) */ 100% 0% /* Bottom vertex */);
      background: #d5cfb7;
  }
  
  
  
  /* Hollow bottom right-angled triangle attached to the rectangle */
  .triangle-bottom {
      position: absolute;
      bottom: 41px;
      left: -4.8%;
      transform: translateX(-50%) rotate(180deg);
      width: 0;
      height: 0;
      border-left: 12px solid transparent;
      border-right: 9px solid transparent;
      border-top: 25px solid transparent;
      border-bottom: 15px solid #d5cfb7;
      border-left: 0px solid #645c53;
      z-index: 4;
  }
  
  /* Mirrored hollow top right-angled triangle with hypotenuse on the top side */
  .triangle-top1 {
      position: absolute; 
      top: 53px;
      right: 102.5%;
      transform: translateX(-50%) rotate(272deg);
      width: 0;
      height: 0;
      border-left: 0px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 10px solid #d5cfb7;
      border-top: 0px solid #645c53;
  
      z-index: 4;
  }
  
  /* Mirrored hollow bottom right-angled triangle attached to the rectangle */
  .triangle-bottom1 {
      position: absolute;
      bottom: 64px;
      right: -4.8%;
      transform: translateX(50%) rotate(-0deg);
      width: 11px;
      height: 15px;
      z-index: 4;
      clip-path: polygon(0% 100%, /* Bottom vertex */ 0% 0%, /* Top vertex (point) */ 100% 0% /* Bottom vertex */);
      background: #d5cfb7;
  }
  
  
  
  
  
  
  
  
  
  /* The rectangle covering the top border */
  .rectangle-bottom {
      position: absolute;
      top: 106.5%;
      left: 10%;
      width: 82%;
      height: 5px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 6px solid #b7eeaa;
      z-index: 2;
  
    }
  
    .rectangle-bottom1 {
      position: absolute;
      top: 106.5%; /* Adjust vertical position as needed */
      left: 17%; /* Adjust horizontal position as needed */
      width: 69%; /* Total width to accommodate the triangle */
      height: 15px; /* Set height to match the border-top */
      z-index: 3;
      background: linear-gradient(to right,  #607744, #1e2f23);
      clip-path: polygon(0px 0%, /* Top-left indentation */ 
                      calc(100% - 0px) 0%, /* Top-right indentation */ 
                      96% 100%, /* Bottom-right corner */ 
                      4% 100% /* Bottom-left corner */
                  );
  }
  
  
  
    .input-container {
      position: absolute;
      top: 10%;
      width: 80%;
    display: flex;
    align-items: center; /* Vertically align the label and input */
    gap: 0px; /* Optional: Adjust space between label and input */
    flex-wrap: wrap;
  }
  
  label {
    width: 150px; /* Adjust width based on your preference */
    color: #fbb444;
    font-family: Inter, sans-serif;
      font-weight: 400;
      line-height: normal;
      font-size: 25px;
  }
  
  input {
    flex: 1;
    padding: 5px;
    font-size: 18px;
    border: 2px solid #000000;
    border-radius: 4px;
    outline: none;
    color: white;
    background-color: #272727;
    box-sizing: border-box;
    z-index: 2; /* Ensures the input is above other elements */
    box-shadow: 0 4px 16px rgba(242, 182, 71, 0.3);
  }
  
  input:focus {
    border-color: #fbb444; /* Add focus border color */
    color: white;
  }
  
  .input-container1 {
    position: absolute;
    top: 30%;
    width: 80%;
    display: flex;
    align-items: center;
    gap: 0px; /* Space between label and input */
    z-index: 1; /* Ensure it stays above other elements */
    margin-bottom: 15px; /* Add margin between input rows */
  }
  
  .input-container2 {
    position: absolute;
    top: 50%;
    width: 80%;
    display: flex;
    align-items: center;
    gap: 0px; /* Space between label and input */
    z-index: 1; /* Ensure it stays above other elements */
    margin-bottom: 15px; /* Add margin between input rows */
  }
  
  .g-recaptcha{
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    color: white;
  }
  
  
  
  
  
   /* CSS styles for the tab button */
  
  .btn-container {
      display: flex;
      justify-content: center;
      gap: 0px;
      position: relative;
      top: 30%;
      /* left: 0px; */
      width: 60%; /* Adjust the width as needed */
      cursor: pointer;
  }
  
  /* Updated .btn1 */
  .btn1 {
      position: relative; /* Changed from absolute to relative */
      width: auto; /* Let the button take its own width */
  }
  
  /* Existing .tab-button styles remain the same */
  .tab-button {
    position: relative;
    z-index: 3;
    border: 3px solid #2d2c2bb1;
    /* outline: 1px solid white; */
    width: 207px;
    height: 50px;
    background: rgb(53,167,196,0.5);
    color: #fbb444;
    
    font-family: Inter, sans-serif;
      font-weight: 600;
      line-height: normal;
      font-size: 22px;
  }
  
  .tab-button:hover {
    background: #111728;
    color: #35a7c4;
  }
  
  /* Existing hollow-rectangle styles */
  .hollow-rectangle {
      width: 217px;
      height: 63px;
      position: absolute;
      top: -7px;
      left: -5px;
      border: 2px solid #35a7c4;
      background: none;
      box-sizing: border-box;
      box-shadow: 0 4px 36px rgba(242, 182, 71, 0.3);
      z-index: 2;
      pointer-events: none;
  }
  
  .hollow-rectangle-right, .hollow-rectangle-left {
      position: absolute;
      top: 11%;
      width: 0px;
      height: 83%;
      pointer-events: none;
  }
  
  .hollow-rectangle-right {
      left: 212px;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 4px solid #d5cfb7;
      z-index: 2;
  }
  
  .hollow-rectangle-left {
      left: -9px;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 4px solid #d5cfb7;
      z-index: 2;
  }
  
  @media (min-width: 1921px) and (max-width: 2560px) {
    /* Add your styles here to increase font size */
    .text-grid .grid-item1 {
      font-size: 2.5rem; /* Increase text size for larger screens */
    }
  
    .text-grid .grid-item2 {
      font-size: 3rem; /* Adjust the size of the text in grid-item2 */
    }
  
    .centered-heading {
      font-size: 8rem; /* Increase font size for larger screens */
    }
  
    .line1{
      height: 4px;
      left: 8%;
    }
    
    .line2{
      height: 4px;
      left: 15%;
    }
  
    .dot{
      width: 12px;
      height: 7px;
      top: -2px;
    }
  
  
      .waviy span{
        font-size: 5rem;
      }
      #leftfooter {
  
      font-size: 1.5rem;
    }
  
    #rightfooter {
  
  font-size: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) and (max-width: 1439px) {
    /* Add your styles here to increase font size */
    .text-grid .grid-item1 {
      font-size: 1.3rem; /* Increase text size for larger screens */
      font-weight: 100;
    }
  
    .text-grid .grid-item2 {
      font-size: 1rem; /* Adjust the size of the text in grid-item2 */
      font-weight: 100;
    }
  
    .centered-heading {
      font-size: 3rem; /* Increase font size for larger screens */
      
    }
  
    .line1 {
  
  left: 5%;
  
  }
  
  .line2 {
  
  top: 30%;
  left: 12%;
  }
  
  #leftfooter {
  
  font-size: 0.3rem;
  }
  
  #rightfooter {
  
  font-size: 0.3rem;
  }
  }
  
  
  @media (max-width: 768px) {
          .text-grid {
              grid-template-columns: 1fr;
              gap: 10px;
              
              text-align: center;
          align-items: center;
          display: flex;
          justify-content: center;
          }
  
          .centered-heading {
      /* Apply different styles here, e.g. */
      font-size: 3.5rem;
    }
  
          .line-container{
            display: none;
          }
  
          .text-grid .grid-item1 {
              font-size: 2.5vw; /* Increase text size for smaller screens */
          }
  
          .text-grid .grid-item2 {
              font-size: 2.5vw; /* Adjust the size of the text in grid-item2 */
          }
  
          #leftfooter {
  font-size: 0.3rem;
    }
  
    #rightfooter {
      font-size: 0.3rem;
  
    }
  
  
      }
  
     
  
      @media (max-width: 435px) {
       
        .centered-heading {
      /* Apply different styles here, e.g. */
      font-size: 3rem;
    }
        
  
          .line-container{
            display: none;
          }
  
          .text-grid{
            flex-direction: column;
            text-align: center;
          }
  
          .text-grid .grid-item1 {
              font-size: 3.3vw; /* Increase text size for smaller screens */
          }
  
          .text-grid .grid-item2 {
              font-size: 2.9vw; /* Adjust the size of the text in grid-item2 */
              display: contents;
          }
  
          #leftfooter {
      width: 40%;
      text-align: center;
      left: 0;
      right: 0;
      padding: 0px;
      font-size: 0.3rem;
    }
  
    #rightfooter {
      width: 40%;
  padding: 0px;
  text-align: center;
  font-size: 0.3rem;
    }
  
      }
  
      @media (max-width: 320px){
  
        .centered-heading {
      /* Apply different styles here, e.g. */
      font-size: 2.5rem;
    }
  
        #leftfooter {
      width: 40%;
      text-align: center;
      left: 0;
      right: 0;
      padding: 0px;
      font-size: 0.2rem;
    }
  
    #rightfooter {
      width: 40%;
  padding: 0px;
  text-align: center;
  font-size: 0.2rem;
    }
      }
  
  
  
      
  
  </style>
