const express = require('express');
const router = express.Router();
const MainControler =   require('../controler/Main_Controler'); 
const ProjectControler = require('../controler/Project_Crontroler')
const BlogControler = require('../controler/BlogsContrler')
const CityDetailControler = require('../controler/CityDetailControler')


 







// Health Route for ECR and ECS
 

router.post('/addcitydetail' , CityDetailControler.HandleAddCitydetail);




router.patch('/updateCityData' , CityDetailControler.HandleUpdateData);



// api to delete city detail 
router.delete('/delete' , CityDetailControler.HandleDeleteCitydetail);


// api to get city detail
router.post('/getcitydetail' , CityDetailControler.HandleGetcityDetailData);


// api to get all cities name 
router.get('/allcities' , CityDetailControler.HandleGetAllCities);


 




 



 module.exports = router; 



 