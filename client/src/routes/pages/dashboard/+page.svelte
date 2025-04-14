<script>
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  let chart;
  let projects = [];
  let selectedProject = null;
  let selectedActivity = null;
  let activeCatalog = "default";
  let showDropdown = false;
  let stages = [];
  let SurveyData = [];
  let Processing = [];
  let SurfaceGeneration = [];
  let ObstacleData = [];
  let Echarting = [];
  let Print = [];
  let skipUpdate = false; 


  
  function updateChart(stages, totalProgress) {
  
  if (chart) {
    chart.destroy();
  }

  
  const labels = stages.map((stage) => stage.name);
  const data = stages.map((stage) => stage.progress);


  labels.push("Total Progress");
  data.push(totalProgress);

  const ctx = document.getElementById("progressChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Completion (%)",
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Completion (%)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Activities",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });

  
  document.getElementById("totalProgress").textContent = `Total Progress: ${totalProgress}%`;
}

  async function fetchActivityDetails(project, activityName) {
    selectedProject = project;
    selectedActivity = activityName;

    try {
      const response = await fetch(
        `http://localhost:3000/api/projects/${project.name}/activities/${activityName}/all-details`
      );
      const data = await response.json();

      if (data.subactivities.length > 0) {
        const updatedData = data.subactivities.map((sub) => ({
          name: sub.subactivity_name,
          percentage: sub.percentage,
          maker: sub.maker_status === 1,
          checker: sub.checker_status === 1,
          approver: sub.approver_status === 1,
        }));

        switch (activityName) {
          case "Input & processing of Survey Data":
            SurveyData = updatedData;
            break;
          case "Data Validation & Processing":
            Processing = updatedData;
            break;
          case "Line Work & AGA Surface Generation":
            SurfaceGeneration = updatedData;
            break;
          case "Obstacle data Analysis":
            ObstacleData = updatedData;
            break;
          case "Aeronautical E-Charting":
            Echarting = updatedData;
            break;
          case "Print / Export":
            Print = updatedData;
            break;
          default:
            console.warn(`Unknown activity: ${activityName}`);
        }
      }

      // Update the chart after fetching new data
      updateChart();
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
  }

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/projects");
      const data = await response.json();
      projects = data.map((row) => ({ name: row.project_name }));
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  });


  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  async function selectProject(project) {
  skipUpdate = true; 
  selectedProject = project;
  activeCatalog = "default";
  lastUpdatedProject = null;


  stages = [];
  SurveyData = [];
  Processing = [];
  SurfaceGeneration = [];
  ObstacleData = [];
  Echarting = [];
  Print = [];
  let totalProgress = 0;


  try {
    const activitiesResponse = await fetch(
      `http://localhost:3000/api/projects/${project.name}/activities`
    );
    const activitiesData = await activitiesResponse.json();

    const progressResponse = await fetch(
      `http://localhost:3000/api/projects/${project.name}/progress`
    );
    const progressData = await progressResponse.json();

stages = activitiesData.map((activity) => {
  const activityName = activity.activity_name;

 
  const progressEntries = progressData.filter((p) => p.activity_name === activityName);


  const latestProgress = progressEntries.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];


  const completed = latestProgress ? latestProgress.activity_status : false;
  const progress = latestProgress ? latestProgress.progress : 0;

  console.log(`Activity: ${activityName}, Progress: ${progress}%, Status: ${completed ? 'Completed' : 'Pending'}`);

  return {
    name: activityName,
    completed,
    progress,
  };
});


    console.log("Fetched activities with status:", stages);

    await Promise.all([
      calculateSurveyPercentage(true),
      calculateEchartingPercentage(true),
      calculateObstaclePercentage(true),
      calculatePrintPercentage(true),
      calculateProcessingPercentage(true),
      calculateSurfaceGenerationPercentage(true)
    ]);


const totalProgress = stages.reduce((acc, stage) => acc + Number(stage.progress), 0);

console.log("Total Progress:", totalProgress.toFixed(2) + "%");


    updateChart(stages, totalProgress);
    console.trace("Function trace when selecting project");
  } catch (error) {
    console.error("Failed to fetch project activities or progress:", error);
  } finally {
  
    setTimeout(() => {
      skipUpdate = false;
    }, 500);
  }
}

  $: console.log("🔄 selectedProject changed:", selectedProject);

  async function selectActivity(activityName, catalogType) {
  if (!selectedProject) {
    console.error("No project selected!");
    return;
  }

  selectedActivity = activityName;
  
  activeCatalog = catalogType;


  await fetchActivityDetails(selectedProject, activityName);

  // Update the database with the progress for the selected activity
  switch (activityName) {
    case "Input & processing of Survey Data":
      updateProjectActivityProgress(selectedProject, activityName, calculateSurveyPercentage());
      break;
    case "Data Validation & Processing":
      updateProjectActivityProgress(selectedProject, activityName, calculateProcessingPercentage());
      break;
    case "Line Work & AGA Surface Generation":
      updateProjectActivityProgress(selectedProject, activityName, calculateSurfaceGenerationPercentage());
      break;
    case "Obstacle data Analysis":
      updateProjectActivityProgress(selectedProject, activityName, calculateObstaclePercentage());
      break;
    case "Aeronautical E-Charting":
      updateProjectActivityProgress(selectedProject, activityName, calculateEchartingPercentage());
      break;
    case "Print / Export":
      updateProjectActivityProgress(selectedProject, activityName, calculatePrintPercentage());
      break;
    default:
      console.warn(`Unknown activity: ${activityName}`);
  }
}


  function hasActivity(activityName) {
    return stages.some((stage) => stage.name === activityName);
  }

  let lastUpdatedProject = null; 


  async function updateProjectActivityProgress(project, activityName, progress) {
  if (skipUpdate) {
    console.log(" Skipping DB update during project selection.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/update-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectName: project.name, activityName, progress }),
    });

    const data = await response.json();
    console.log("Progress update response:", data);
  } catch (error) {
    console.error("Failed to update progress:", error);
  }
}
  // Calculate completion percentages for each activity
  function calculateSurveyPercentage(skipUpdate = false) {
    let progress = SurveyData.reduce((total, surdata) => {
      if (surdata.maker && surdata.checker && surdata.approver) {
        return total + Number(surdata.percentage || 0);
      }
      return total;
    }, 0).toFixed(2);

    if (!skipUpdate && selectedProject) {
    updateProjectActivityProgress(
      selectedProject,
      "Input & processing of Survey Data",
      progress
    );
  }
    return progress; 
   
  }

  function calculateProcessingPercentage(skipUpdate = false) {
    let progress = Processing.reduce((total, process) => {
      if (process.maker && process.checker && process.approver) {
        return total + Number(process.percentage || 0);
      }
      return total;
    }, 0).toFixed(2);


    if (!skipUpdate && selectedProject ){
      updateProjectActivityProgress(
      selectedProject,
      "Data Validation & Processing",
      progress
    );
    }
  
    return progress;
  }

  function calculateSurfaceGenerationPercentage(skipUpdate = false) {
    let progress = SurfaceGeneration.reduce((total, surface) => {
      if (surface.maker && surface.checker && surface.approver) {
        return total + Number(surface.percentage || 0);
      }
      return total;
    }, 0).toFixed(2);
    if (!skipUpdate && selectedProject){
      updateProjectActivityProgress(
      selectedProject,
      "Line Work & AGA Surface Generation",
      progress
    );
    }
    return progress;
  }

  function calculateObstaclePercentage(skipUpdate = false) {
    let progress = ObstacleData.reduce((total, obs) => {
      if (obs.maker && obs.checker && obs.approver) {
        return total + Number(obs.percentage || 0);
      }
      return total;
    }, 0).toFixed(2);
    if (!skipUpdate && selectedProject){
      updateProjectActivityProgress(
      selectedProject,
      "Obstacle data Analysis",
      progress
    );
    }
   
    
    return progress;
  }

  function calculateEchartingPercentage(skipUpdate = false) {
    let progress = Echarting.reduce((total, echart) => {
      if (echart.maker && echart.checker && echart.approver) {
        return total + Number(echart.percentage || 0);
      }
      return total;
    }, 0).toFixed(2);
    if (!skipUpdate && selectedProject){
      updateProjectActivityProgress(
      selectedProject,
      "Aeronautical E-Charting",
      progress
    );
    }
    return progress;
  }

  function calculatePrintPercentage(skipUpdate = false) {
    let progress = Print.reduce((total, pri) => {
      if (pri.maker && pri.checker && pri.approver) {
        return total + Number(pri.percentage || 0);
      }
      return total;
    }, 0).toFixed(2);

    if (!skipUpdate && selectedProject){

      updateProjectActivityProgress(selectedProject, "Print / Export", progress);

     }
    return progress;
    
  }

</script>

<!-- UI Code (unchanged) -->
<div>
  {#if selectedProject}
    {#if stages.length > 0}
      <header
        class="Explore_Header"
        style="display: flex; flex-direction: row; justify-content: space-between"
      >
        <div class="Explore_Header_button">
          {#if hasActivity("Input & processing of Survey Data")}
            <button
              class="explore-button"
              class:selected={activeCatalog === "survey"}
              on:click={() =>
                selectActivity("Input & processing of Survey Data", "survey")}
            >
              Input & Processing of Survey Data
            </button>
          {/if}
          {#if hasActivity("Data Validation & Processing")}
            <button
              class="explore-button"
              class:selected={activeCatalog === "process"}
              on:click={() =>
                selectActivity("Data Validation & Processing", "process")}
            >
              Data Validation & Processing
            </button>
          {/if}
          {#if hasActivity("Line Work & AGA Surface Generation")}
            <button
              class="explore-button"
              class:selected={activeCatalog === "surface"}
              on:click={() =>
                selectActivity("Line Work & AGA Surface Generation", "surface")}
            >
              Line Work & AGA Surface Generation
            </button>
          {/if}
          {#if hasActivity("Obstacle data Analysis")}
            <button
              class="explore-button"
              class:selected={activeCatalog === "obstacle"}
              on:click={() =>
                selectActivity("Obstacle data Analysis", "obstacle")}
            >
              Obstacle Data Analysis
            </button>
          {/if}
          {#if hasActivity("Aeronautical E-Charting")}
            <button
              class="explore-button"
              class:selected={activeCatalog === "e-chart"}
              on:click={() =>
                selectActivity("Aeronautical E-Charting", "e-chart")}
            >
              Aeronautical E-Charting
            </button>
          {/if}
          {#if hasActivity("Print / Export")}
            <button
              class="explore-button"
              class:selected={activeCatalog === "print"}
              on:click={() => selectActivity("Print / Export", "print")}
            >
              Print/Export
            </button>
          {/if}
        </div>
      </header>
    {/if}
  {/if}

  <div class="flex h-[70vh]">
    <aside class="sidebar" style="overflow-y: auto;">
      <div
        style="display:flex;justify-content:center; cursor:pointer; background-color:rgb(246, 246, 247); color:black; gap:10px; font-size:16px;"
        on:click={toggleDropdown}
      >
        <span
          class="dropdown-toggle"
          style="font-weight: bold; display: flex; justify-content: center; "
        >
         Projects
        </span>
        <span class="icon">{showDropdown ? "▲" : "▼"}</span>
      </div>
      {#if showDropdown}
        <div class="dropdown">
          <ul>
            {#each projects as project}
              <li
                on:click={() => selectProject(project)}
                class:selected={selectedProject === project}
                class:has-activity={selectedProject === project}
              >
                {project.name}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </aside>

    <main class="w-[70%] flex-2 p-2">
      {#if selectedProject}
        <div
          style="font-weight: 600; padding: 10px; display:flex; justify-content:center;"
        >
          <div style="font-size: 20px; font-weight: 700px; margin-top: 2px">
            <h2>{selectedProject.name}</h2>
          </div>
        </div>

        {#if activeCatalog === "default"}
          <div class="tree-container">
            {#if selectedProject}
              {#each stages as stage, index}
                <div class="stage {stage.completed ? 'completed' : ''}">
                  <div class="stage-radio">
                    <input type="radio" checked={stage.completed} disabled />
                  </div>
                  <label for="">{stage.name}</label>
                </div>
              {/each}
            {/if}
          </div>

          <div class="survey-container" style="height:300px;">
      
            <div id="totalProgress" style="font-size: 16px; font-weight:600; margin-top: 10px;"></div>

            <canvas id="progressChart"></canvas>
          </div>
        {:else if activeCatalog === "survey"}
          <div class="survey-container">
            <h1>Input & processing of Survey Data</h1>
            <table class="survey-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Maker</th>
                  <th>Checker</th>
                  <th>Approver</th>
                </tr>
              </thead>
              <tbody>
                {#each SurveyData as surdata, index}
                  <tr>
                    <td>{surdata.name}</td>
                    <td class="actions">
                      <button
                        class="button {surdata.maker ? 'green' : 'red'}"
                        disabled
                      >
                        {surdata.maker ? "Marked " : "Pending"}
                      </button>
                    </td>
                    <td class="actions">
                      <button
                        class="button {surdata.checker ? 'green' : 'red'}"
                        disabled
                      >
                        {surdata.checker ? "Checked " : "Pending"}
                      </button>
                    </td>
                    <td class="actions">
                      <button
                        class="button {surdata.approver ? 'green' : 'red'}"
                        disabled
                      >
                        {surdata.approver ? "Approved " : "Pending"}
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            <div class="survey-progress">
              <h2>
                Total Survey Completion: {calculateSurveyPercentage()}% out of
                2%
              </h2>
            </div>
          </div>
        {:else if activeCatalog === "process"}
          <div class="survey-container">
            <h1>Data Validation & Processing</h1>
            <div style="height: 220px; overflow-y:auto;">
              <table class="survey-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Maker</th>
                    <th>Checker</th>
                    <th>Approver</th>
                  </tr>
                </thead>
                <tbody>
                  {#each Processing as process, index}
                    <tr>
                      <td>{process.name}</td>
                      <td class="actions">
                        <button
                          class="button {process.maker ? 'green' : 'red'}"
                          disabled
                        >
                          {process.maker ? "Marked " : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {process.checker ? 'green' : 'red'}"
                          disabled
                        >
                          {process.checker ? "Checked " : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {process.approver ? 'green' : 'red'}"
                          disabled
                        >
                          {process.approver ? "Approved " : "Pending"}
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="survey-progress">
              <h2>
                Total Data Validation Completion: {calculateProcessingPercentage()}%
                out of 19%
              </h2>
            </div>
          </div>
        {:else if activeCatalog === "surface"}
          <div class="survey-container">
            <h1>Line Work & AGA Surface Generation</h1>
            <div style="height: 220px; overflow-y:auto;">
              <table class="survey-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Maker</th>
                    <th>Checker</th>
                    <th>Approver</th>
                  </tr>
                </thead>
                <tbody>
                  {#each SurfaceGeneration as surface, index}
                    <tr>
                      <td>{surface.name}</td>
                      <td class="actions">
                        <button
                          class="button {surface.maker ? 'green' : 'red'}"
                          disabled
                        >
                          {surface.maker ? "Marked " : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {surface.checker ? 'green' : 'red'}"
                          disabled
                        >
                          {surface.checker ? "Checked " : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {surface.approver ? 'green' : 'red'}"
                          disabled
                        >
                          {surface.approver ? "Approved " : "Pending"}
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="survey-progress">
              <h2>
                Total Line Work & AGA Surface Generation Completion: {calculateSurfaceGenerationPercentage()}%
                out of 10%
              </h2>
            </div>
          </div>
        {:else if activeCatalog === "obstacle"}
          <div class="survey-container">
            <h1>Obstacle data Analysis</h1>
            <div style="height: 220px; overflow-y:auto;">
              <table class="survey-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Maker</th>
                    <th>Checker</th>
                    <th>Approver</th>
                  </tr>
                </thead>
                <tbody>
                  {#each ObstacleData as obs, index}
                    <tr>
                      <td>{obs.name}</td>
                      <td class="actions">
                        <button
                          class="button {obs.maker ? 'green' : 'red'}"
                          disabled
                        >
                          {obs.maker ? "Marked " : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {obs.checker ? 'green' : 'red'}"
                          disabled
                        >
                          {obs.checker ? "Checked " : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {obs.approver ? 'green' : 'red'}"
                          disabled
                        >
                          {obs.approver ? "Approved " : "Pending"}
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="survey-progress">
              <h2>
                Total Obstacle data Analysis Completion: {calculateObstaclePercentage()}%
                out of 5%
              </h2>
            </div>
          </div>
        {:else if activeCatalog === "e-chart"}
          <div class="survey-container">
            <h1>Aeronautical E-Charting</h1>
            <div style="height: 220px; overflow-y:auto;">
              <table class="survey-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Maker</th>
                    <th>Checker</th>
                    <th>Approver</th>
                  </tr>
                </thead>
                <tbody>
                  {#each Echarting as echart, index}
                    <tr>
                      <td>{echart.name}</td>
                      <td class="actions">
                        <button
                          class="button {echart.maker ? 'green' : 'red'}"
                          disabled
                        >
                          {echart.maker ? "Marked" : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {echart.checker ? 'green' : 'red'}"
                          disabled
                        >
                          {echart.checker ? "Checked" : "Pending"}
                        </button>
                      </td>
                      <td class="actions">
                        <button
                          class="button {echart.approver ? 'green' : 'red'}"
                          disabled
                        >
                          {echart.approver ? "Approved" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            <div class="survey-progress">
              <h2>
                Total Aeronautical E-Charting Completion: {calculateEchartingPercentage()}%
                out of 63%
              </h2>
            </div>
          </div>
        {:else if activeCatalog === "print"}
          <div class="survey-container">
            <h1>Print / Export</h1>
            <table class="survey-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Maker</th>
                  <th>Checker</th>
                  <th>Approver</th>
                </tr>
              </thead>
              <tbody>
                {#each Print as pri, index}
                  <tr>
                    <td>{pri.name}</td>
                    <td class="actions">
                      <button
                        class="button {pri.maker ? 'green' : 'red'}"
                        disabled
                      >
                        {pri.maker ? "Marked" : "Pending"}
                      </button>
                    </td>
                    <td class="actions">
                      <button
                        class="button {pri.checker ? 'green' : 'red'}"
                        disabled
                      >
                        {pri.checker ? "Checked" : "Pending"}
                      </button>
                    </td>
                    <td class="actions">
                      <button
                        class="button {pri.approver ? 'green' : 'red'}"
                        disabled
                      >
                        {pri.approver ? "Approved" : "Pending"}
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            <div class="survey-progress">
              <h2>
                Total Print / Export Completion: {calculatePrintPercentage()}%
                out of 1%
              </h2>
            </div>
          </div>
        {/if}
      {/if}
    </main>
  </div>
</div>

<style>
  .Explore_Header {
    display: flex;
    gap: 10px;
    justify-content: start; /* This will space out the items */
    align-items: center; /* This ensures that the items are aligned vertically in the center */
    padding: 0px 12px 10px 12px; /* Add some padding to the header */
    border-bottom: 2px solid gray;
  }

  .Explore_Header .explore-button {
    padding: 8px 4px; /* Adds some padding to the button */
    cursor: pointer; /* Changes the cursor to a pointer when hovered */
    font-size: 12px; /* Sets a font size for the button */
    color: rgb(17, 24, 39);
    background: rgb(255, 255, 255);
    border: 2px solid rgb(209, 213, 219);
    outline: none;
    border-radius: 3px;
    /* margin-bottom: 3px; */
  }

  .Explore_Header .explore-button:focus,
  .Explore_Header .explore-button:active {
    border: 2px solid rgb(53, 167, 196); /* Change the border color when clicked */
  }
  .explore-button.selected {
    color: rgb(1, 1, 1);
    background: rgb(255, 255, 255);
    border: 2px solid rgb(53, 167, 196); /* Darker blue border */
    border-radius: 3px; /* Optional: rounded corners */
  }
  .explore-button.selected:hover {
    border: 2px solid rgb(53, 167, 196);
  }

  .button.green {
    border: 1px solid rgba(0, 128, 0, 0.62);
    background-color: #ccffcc;
    color: rgba(0, 128, 0, 0.62);
  }

  .button {
    padding: 3px 8px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
  }

  .button.red {
    border: 1px solid rgba(255, 0, 0, 0.361);
    background-color: #ffccccc2;
    color: rgba(255, 0, 0, 0.433);
  }

  /* Centering the list */
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  
    width: 100%;
  }

  /* Styling list items */
  li {
    background-color: #f5f5f5; /* Light gray background */
    padding: 3px 3px;
    margin: 3px 0;
    
   
    border-radius: 5px;
    cursor: pointer;
    transition:
      background 0.3s,
      color 0.3s;
    font-weight: 400;
    font-size:14px;
    display: flex;
    justify-content: left;
  }

  /* Hover effect */
  li:hover {
    background-color: #35a7c4;
    color: white;
  }

  /* Selected item */
  li.selected {
    background-color: #35a7c4;
    color: white;
  }

  .sidebar {
    width: 30%; /* This is equivalent to w-64 */
    background-color: rgb(
      246,
      246,
      247
    ); /* Set the background color using RGB */
    padding: 10px; /* Equivalent to p-4 */
    color: black; /* Set the text color to white */
    border: 1px solid rgba(0, 0, 0, 0.1); /* Add a light border around the box */
    box-sizing: border-box; /* Ensures padding and border are included in the width/height calculation */
  }
  .tree-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 15px; /* Reduce gap to bring elements closer */
    padding: 10px;
    width: 100%; /* Ensure it fits within the main content */
    max-width: 100%; /* Limits the width to avoid affecting layout */
    margin: 0 auto; /* Centering */
    position: relative;
    overflow: hidden;
    /* flex-wrap:nowrap; */
  }

  .stage {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 10px; /* Reduce text size for compactness */
    white-space: nowrap; /* Prevents text wrapping */
    width: 90px;
  }

  .stage-radio {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    /* height:20px; */
  }

  .stage input[type="radio"] {
    appearance: none;
    width: 5px; /* Reduced size */
    height: 0px; /* Reduced size */
    border: 2px solid #000;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
  }

  .stage input[type="radio"]:checked {
    background-color: #4caf50;
    border-color: #4caf50;
  }

  /* Connecting Lines */
  .stage::before {
    content: "";
    position: absolute;
    top: 23%;
    left: -50px; /* Adjusts to align with previous radio button */
    width: 85px; /* Shorter line to ensure proper connection */
    height: 2px;
    background-color: #000;
  }

  .stage:first-child::before {
    display: none; /* No line before the first stage */
  }

  .stage.completed::before {
    background-color: #4caf50; /* Green line for completed stages */
  }
  .stage label {
    width: 80px; /* Ensures labels do not stretch */
    text-align: center;
    font-size: 10px;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 12px; /* Keeps label height uniform */
    min-height: 30px; /* Ensures all labels have equal space */
    max-height: 40px;
    margin-top: 5px;
    display: flex;
    align-items: center; /* Centers text vertically */
    justify-content: center;
  }

  .survey-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
    padding: 20px;
    justify-content: center;
  }

  .survey-container h1 {
    text-align: center;
    font-size: 16px;
    /* font-weight: bold; */
    /* margin-bottom: px; */
  }
  .survey-table {
    width: 450px;
    /* border-collapse: collapse; */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.383);
    border: none;
    border-radius: 5px;
  }

  .survey-table th,
  .survey-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
    font-size: 12px;
  }

  .survey-table th {
    background-color: #f4f4f4;
    font-weight: bold;
    position: sticky;
    top: 0;
  }
  .actions {
    justify-content: center;
    align-items: center;
  }

  /* .button {
    padding: 3px 8px;
    border: 1px solid rgba(255, 0, 0, 0.361);
    background-color: #ffccccc2;
    color: rgba(255, 0, 0, 0.433);
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
  } */
  /* .button:hover {
    background-color: #ffaaaa;
  } */

  /* .button.active {
    border: 1px solid rgba(0, 128, 0, 0.62);
    background-color: #ccffcc;
    color: rgba(0, 128, 0, 0.62);
  } */

  /* Media Queries for Tablet Screens (768px - 1024px) */
  @media (min-width: 768px) and (max-width: 1024px) {
    .Explore_Header {
      justify-content: center; /* Center buttons on tablet screens */
    }

    .Explore_Header .explore-button {
      flex: 1 1 30%; /* Three buttons per row on tablet screens */
      font-size: 14px; /* Slightly larger font size for tablets */
    }

    .sidebar {
      width: 40%; /* Adjust sidebar width for tablets */
    }

    .tree-container {
      gap: 10px; /* Reduce gap between stages for tablets */
    }

    .stage {
      width: 80px; /* Adjust stage width for tablets */
    }

    .stage label {
      font-size: 12px; /* Increase font size for better readability */
    }

    .survey-container h1 {
      font-size: 18px; /* Increase heading size for tablets */
    }

    .survey-table {
      max-width: 600px; /* Increase table width for tablets */
    }

    .survey-table th,
    .survey-table td {
      padding: 10px; /* Increase padding for tablets */
      font-size: 14px; /* Increase font size for tablets */
    }
  }

  /* Media Queries for Mobile Screens (max-width: 768px) */
  @media (max-width: 768px) {
    .Explore_Header {
      justify-content: center; /* Center buttons on smaller screens */
    }

    .Explore_Header .explore-button {
      flex: 1 1 45%; /* Two buttons per row on smaller screens */
    }

    .sidebar {
      width: 100%; /* Full width on smaller screens */
    }

    .tree-container {
      flex-direction: column; /* Stack stages vertically on smaller screens */
      align-items: center;
    }

    .stage {
      width: 100%; /* Full width for stages on smaller screens */
    }

    .stage::before {
      display: none; /* Hide connecting lines on smaller screens */
    }

    .survey-table {
      width: 100%; /* Full width for tables on smaller screens */
    }
  }

  /* Media Queries for Very Small Screens (max-width: 480px) */
  @media (max-width: 480px) {
    .Explore_Header .explore-button {
      flex: 1 1 100%; /* One button per row on very small screens */
    }

    .stage label {
      font-size: 12px; /* Increase font size for better readability */
    }

    .survey-container h1 {
      font-size: 14px; /* Adjust heading size for smaller screens */
    }

    .survey-table th,
    .survey-table td {
      padding: 6px; /* Reduce padding for smaller screens */
      font-size: 10px; /* Reduce font size for smaller screens */
    }
  }
</style>
