const express = require('express');
const router = express.Router();
const GraphControler = require('../controler/Graph_Controler');




router.post('/storegraphdata' , GraphControler.HandleAddGraphData);



router.get('/getGraphdata' , GraphControler.HandleShowGraphdata );


router.delete('/deleteGraphData' , GraphControler.HandleDeleteGraphData);


router.put('/updateGraphData/:id' , GraphControler.HandleUpdateGraphData);






module.exports = router; 

