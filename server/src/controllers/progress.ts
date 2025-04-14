import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { ProjectActivity } from '../entities/ProjectActivity';
import { ProjectActivityProgress } from '../entities/ProjectActivityProgress';

const progressThresholds = {
  'Input & processing of Survey Data': 2,
  'Data Validation & Processing': 19,
  'Line Work & AGA Surface Generation': 10,
  'Obstacle data Analysis': 5,
  'Aeronautical E-Charting': 63,
  'Print / Export': 1,
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectRepository = AppDataSource.getRepository(ProjectActivity);
    const projects = await projectRepository
      .createQueryBuilder('project')
      .select('DISTINCT project.project_name', 'project_name')
      .getRawMany();
    res.json(projects);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProjectActivities = async (req: Request, res: Response): Promise<void> => {
  const { projectName } = req.params;

  try {
    const projectRepository = AppDataSource.getRepository(ProjectActivity);
    const activities = await projectRepository
      .createQueryBuilder('project')
      .select('project.activity_name', 'activity_name')
      .where('project.project_name = :projectName', { projectName })
      .groupBy('project.activity_name')
      .orderBy('MIN(project.id)')
      .getRawMany();
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivityDetails = async (req: Request, res: Response): Promise<void> => {
  const { projectName, activityName } = req.params;

  try {
    const projectRepository = AppDataSource.getRepository(ProjectActivity);
    const subactivities = await projectRepository
      .createQueryBuilder('project')
      .select([
        'project.subactivity_name',
        'project.percentage',
        'project.maker_status',
        'project.checker_status',
        'project.approver_status',
      ])
      .where('project.project_name = :projectName AND project.activity_name = :activityName', {
        projectName,
        activityName,
      })
      .orderBy('project.subactivity_name')
      .getMany();

    if (subactivities.length === 0) {
      res.status(404).json({ message: 'No subactivities found.' });
      return;
    }

    res.json({ project_name: projectName, activity_name: activityName, subactivities });
  } catch (err) {
    console.error('Error fetching activity details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProgress = async (req: Request, res: Response): Promise<void> => {
  const project = req.body.projectName?.name || req.body.projectName;
  const { activityName, progress } = req.body;

  if (!project || !activityName || progress === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const threshold = progressThresholds[activityName as keyof typeof progressThresholds] || 0;
  const activityStatus = progress >= threshold;

  try {
    const progressRepository = AppDataSource.getRepository(ProjectActivityProgress);
    const existingProgress = await progressRepository.findOne({
      where: { project_name: project, activity_name: activityName },
    });

    if (existingProgress) {
      existingProgress.progress = progress;
      existingProgress.activity_status = activityStatus;
      existingProgress.updated_at = new Date();
      await progressRepository.save(existingProgress);
    } else {
      const newProgress = progressRepository.create({
        project_name: project,
        activity_name: activityName,
        progress,
        activity_status: activityStatus,
        updated_at: new Date(),
      });
      await progressRepository.save(newProgress);
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProjectProgress = async (req: Request, res: Response): Promise<void> => {
  const { projectName } = req.params;

  try {
    const progressRepository = AppDataSource.getRepository(ProjectActivityProgress);
    const progressData = await progressRepository.find({
      where: { project_name: projectName },
    });
    res.json(progressData);
  } catch (error) {
    console.error('Error fetching project progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};