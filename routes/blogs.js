const express = require('express');
const router = express.Router();
const MainControler =   require('../controler/Main_Controler'); 
const ProjectControler = require('../controler/Project_Crontroler')
const BlogControler = require('../controler/BlogsContrler')


 







// Health Route for ECR and ECS
 

router.post('/createBlog' , BlogControler.HandleAddBlog);


// GET API 
router.get('/getblog' , BlogControler.HandleGetAllBlogs);



// DELETE Api 
router.delete('/deleteblogdata' , BlogControler.HandleDeleteBlog);


// 

// Update API 
router.put('/updateBlogData/:id' , BlogControler.HandleUpdateBlog);




 



 module.exports = router; 



 