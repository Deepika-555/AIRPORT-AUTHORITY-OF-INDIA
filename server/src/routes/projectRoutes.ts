import express from 'express';
import {
  getProjects,
  getProjectActivities,
  getActivityDetails,
  updateProgress,
  getProjectProgress,
} from '../controllers/progress';

const router = express.Router();

router.get('/projects', getProjects);
router.get('/projects/:projectName/activities', getProjectActivities);
router.get('/projects/:projectName/activities/:activityName(*)/all-details', getActivityDetails);
router.post('/update-progress', updateProgress);
router.get('/projects/:projectName/progress', getProjectProgress);

export default router;