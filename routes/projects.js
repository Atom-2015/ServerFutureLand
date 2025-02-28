const express = require('express');
const router = express.Router();
const MainControler =require('../controler/Main_Controler'); 
const ProjectControler = require('../controler/Project_Crontroler')


 







// Health Route for ECR and ECS
 

router.post('/createProject' , ProjectControler.HandleStoreProjects);




 



 module.exports = router; 



 