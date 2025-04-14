const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const router = express.Router();


const app = express();


app.use(cors());
app.use(express.json()); 



const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Dashboard',
  password: 'postgres',
  port: 5432,
});


app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT project_name FROM project_activities');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/projects/:projectName/activities', async (req, res) => {
    const { projectName } = req.params;
  
    try {
      const result = await pool.query(
      
        'SELECT activity_name FROM project_activities WHERE project_name = $1 GROUP BY activity_name ORDER BY MIN(id)',
        [projectName]
      );

      console.log(result)
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.get('/api/projects/:projectName/activities/:activityName(*)/all-details', async (req, res) => {
    const { projectName, activityName } = req.params;
    console.log("Received request:");

    console.log("project-name",projectName);
    console.log("activity-name",activityName);

    if (!activityName) {
      console.error("Error: Activity name is missing in request.");
      return res.status(400).json({ error: "Activity name is missing." });
      }
 

    try {
        const result = await pool.query(
            `SELECT 
                subactivity_name,
                percentage,
                maker_status,
                checker_status,
                approver_status
            FROM project_activities
            WHERE project_name = $1 AND activity_name = $2
            ORDER BY subactivity_name`,
            [projectName, activityName]
        );
        

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No subactivities found." });
        }

        res.json({ project_name: projectName, activity_name: activityName, subactivities: result.rows });
    } catch (err) {
        console.error("Error fetching activity details:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/update-progress", async (req, res) => {
  console.log("Received request body:", req.body); 

  const project = req.body.projectName?.name || req.body.projectName;
  const { activityName, progress } = req.body;
  console.log("Processed data:", project, activityName, progress); 

  if (!project || !activityName || progress === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }


  const progressThresholds = {
    "Input & processing of Survey Data": 2,
    "Data Validation & Processing": 19,
    "Line Work & AGA Surface Generation": 10,
    "Obstacle data Analysis": 5,
    "Aeronautical E-Charting": 63,
    "Print / Export": 1,
  };

 
  const threshold = progressThresholds[activityName] || 0;

 
  const activityStatus = progress >= threshold;

  try {
  
    const checkResult = await pool.query(
      `SELECT 1 FROM project_activity_progress WHERE project_name = $1 AND activity_name = $2`,
      [project, activityName]
    );

    if (checkResult.rowCount > 0) {
     
      await pool.query(
        `UPDATE project_activity_progress 
         SET progress = $3, updated_at = CURRENT_TIMESTAMP, activity_status = $4
         WHERE project_name = $1 AND activity_name = $2`,
        [project, activityName, progress, activityStatus]
      );
    } else {
      
      await pool.query(
        `INSERT INTO project_activity_progress (project_name, activity_name, progress, activity_status) 
         VALUES ($1, $2, $3, $4)`,
        [project, activityName, progress, activityStatus]
      );
    }

    res.json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get("/api/projects/:projectName/progress", async (req, res) => {
  const projectName = req.params.projectName;
  console.log("Fetching progress for project:", projectName);

  try {
    const progressResult = await pool.query(
      `SELECT activity_name, progress, activity_status, updated_at 
       FROM project_activity_progress 
       WHERE project_name = $1`,
      [projectName]
    );
      
    res.json(progressResult.rows);
  } catch (error) {
    console.error("Error fetching project progress:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
