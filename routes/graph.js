const express = require('express');
const router = express.Router();
const GraphControler = require('../controler/Graph_Controler');




router.post('/storegraphdata' , GraphControler.HandleAddGraphData);



router.get('/getGraphdata' , GraphControler.HandleShowGraphdata )






module.exports = router; 

