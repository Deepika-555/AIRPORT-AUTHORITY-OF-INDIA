## AAI eCharting System – Survey Charting & Management Platform
This project is developed for the Airport Authority of India (AAI) to manage and generate aeronautical survey charts in a more automated and scalable way. The system focuses on digitizing the entire charting process using spatial data from field surveys, integrating technologies like PostgreSQL with PostGIS, QGIS, SvelteKit, and Node.js.
 
## Objective
The main goal of this system is to provide a platform where survey data collected from various airports can be:

Organized and stored spatially,

Visualized through QGIS,

Converted into official e-charts,

Reviewed and managed from a modern web interface.

This significantly reduces manual work and ensures consistency and accuracy in chart creation.

# Key Modules & Features
Survey Data Ingestion: Upload and manage survey coordinates and related attributes through API endpoints.
PostGIS Integration: Store and process spatial/geographical data with PostgreSQL + PostGIS.
QGIS Chart Preparation: QGIS is used to fetch real-time data from the database and prepare chart layers for verification and export.
Modern Frontend: Built with SvelteKit, enabling fast rendering and a responsive UI for administrators and surveyors.
Role-Based Access: Admins, Survey Engineers, and Viewers have different permissions for accessing and modifying the data.
Backend Services: Developed with Node.js & Express, powering the API layer for CRUD operations and authentication.

# Technologies Used
Purpose	Stack
Frontend	SvelteKit (SPA with routing, stores, and component-driven UI)
Backend	Node.js, Express.js
Database	PostgreSQL + PostGIS
Charting Tool	QGIS (connected via DB layers)
Authentication	JWT & role-based middleware
Map Handling	QGIS + PostGIS integration
Deployment	(Environment specific – not publicly hosted)

# How the System Works
Survey Data Entry – Data is collected by surveyors and uploaded via APIs or forms.

Database Storage – The data is stored in PostgreSQL with geospatial indexing via PostGIS.

QGIS Charting – QGIS connects directly to the PostGIS database to render real-time chart layers.

Frontend Access – Users log in via the SvelteKit app to view, edit, or verify the survey objects and charts.

Export – Final charts are exported from QGIS and verified before being submitted.

💡 Key Learning & Contributions
As part of this project, I:

Worked closely with GIS engineers to integrate QGIS with PostgreSQL spatial layers.

Built RESTful APIs using Node.js for user management and data operations.

Designed a reactive frontend in SvelteKit with form handling, stores, and conditional routing.

Learned how to structure spatial data using PostGIS and connected it to QGIS for real-time chart rendering.

Contributed to chart export workflows and validation steps for official e-chart generation.


This project is currently used internally by the Airport Authority of India. All survey chart data and mapping layers are confidential and not publicly accessible.

Developed By
Deepika Jaiswal
MERN Stack & GIS-based Web Developer












