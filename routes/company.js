const express = require('express');
const router = express.Router();
const MainControler =require('../controler/Main_Controler'); 
const ProjectControler = require('../controler/Project_Crontroler')
const CompanyControler = require('../controler/CompanyControler')


 







// Health Route for ECR and ECS
 

router.post('/addcompany' , CompanyControler.HandleAddCompany);


// delete company
router.delete('/deletecompany', CompanyControler.HandleDeleteCompany);



// update company
router.put('/updatecompany'  , CompanyControler.HandleUpdateCompany);


router.get('/getallCompany' , CompanyControler.HandleGetAllCompany);



 



 module.exports = router; 



 