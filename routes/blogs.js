const express = require('express');
const router = express.Router();
const MainControler =require('../controler/Main_Controler'); 
const ProjectControler = require('../controler/Project_Crontroler')
const BlogControler = require('../controler/BlogsContrler')


 







// Health Route for ECR and ECS
 

router.post('/addBlog' , BlogControler.HandleAddBlog);




 



 module.exports = router; 



 