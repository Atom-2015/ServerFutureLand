const express = require('express');
const router = express.Router();
const MainControler =require('../controler/Main_Controler'); 
const ProjectControler = require('../controler/Project_Crontroler')
const isAuthenticated = require('../middleware/isAuth')
const ProjectionControler = require('../controler/ProjectionControler')


 







// Health Route for ECR and ECS
 

router.post('/createProject', isAuthenticated , ProjectControler.HandleStoreProjects);


router.get('/allProjects' , isAuthenticated , ProjectControler.HandleAllProjects)


// route to add more data in projet 
router.post('/addAdditionalData' , ProjectControler.HandleAdditionalData)


// speedo meter api 
router.get('/getspeedometerData',isAuthenticated , ProjectControler.HandleSpeedoMeterData);



// to delete the project
router.delete('/deleteProject' , ProjectControler.HandleDeleteProject);



// to update project
router.put('/updateProject' , ProjectControler.HandleUpdateProject);



// api to get kml 
router.get('/getkml' , ProjectControler.HandleGetKml);


router.get('/chartdata' , isAuthenticated , ProjectControler.HandleChartData);

 



 
// ******************************************* Projection Route *******************************************
router.post('/addTraskportProjection' , isAuthenticated , ProjectionControler.HandleAddTransportAccess);


// get transport data 
router.get('/getTransportProjection' , isAuthenticated , ProjectionControler.HandleGetProjectionDetails);

// post api to store the data of transport projection
router.post('/addNearestLocation'  ,ProjectionControler.HandleAddNearestInfra);


 module.exports = router; 



 