const express = require('express');
const router = express.Router();
const MainControler =   require('../controler/Main_Controler'); 
const ProjectControler = require('../controler/Project_Crontroler')
const BlogControler = require('../controler/BlogsContrler')
const CityDetailControler = require('../controler/CityDetailControler')


 







// Health Route for ECR and ECS
 

router.post('/addcitydetail' , CityDetailControler.HandleAddCitydetail);


 




 



 module.exports = router; 



 