const Project = require('../models/reports/project');
const Projection = require('../models/ProjectDetailsProjection/projection');
const Company = require('../models/company/company');
const ProjectDetails = require('../models/ProjectDetailsProjection/projectionDetail');
const ProjectionGraphData = require('../models/ProjectDetailsProjection/projectionGraphData')





module.exports.HandleAddTransportAccess = async (req, res) => {
  // console.log(`thisisi bouy ${JSON.stringify(req.body)}`);
  const transport_detail = req.body;
  const projectid = req.headers['x-project-id'];


  if (!transport_detail || transport_detail.length <= 0 || !projectid) {
    return res.status(400).json({ message: "Fields Missing" });
  }

  try {
    let projectionDetail = await ProjectDetails.findOne({ projectid });

    if (!projectionDetail) {
      // Create new ProjectionDetail
      const newProjection = new ProjectDetails({
        projectid,
        transport_detail
      });

      await newProjection.save();
      return res.status(201).json({ message: "Transport details added", data: newProjection });
    }

    // Update existing ProjectionDetail by pushing new transport details
    projectionDetail.transport_detail.push(...transport_detail);
    await projectionDetail.save();

    return res.status(200).json({ message: "Transport details updated", data: projectionDetail });
  } catch (error) {
    console.error("Error in HandleAddTransportAccess:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};








// // api to add nearest Infra access details
module.exports.HandleAddNearestInfra = async (req, res) => {
  const nearest_infrastructure = req.body.nearest_infrastructure;
  console.log(req.body)
  const projectid = req.headers['x-project-id'];
  // console.log(`Project data ${nearest_infrastructure} , projectid ${projectid}`)
  if (!nearest_infrastructure || !Array.isArray(nearest_infrastructure) || nearest_infrastructure.length === 0 ||      !projectid) {
    console.log('thsisiiiii',projectid,nearest_infrastructure)
    return res.status(400).json({ message: "Fields Missing" });
  }

  // for (const val of nearest_infrastructure) {
  //   if (!val.value || !val.name || !val.type) {
  //     return res.status(400).json({
  //       message: "All fields must be filled out"
  //     });
  //   }
  // }

  try {
    let projectionDetail = await ProjectDetails.findOne({ projectid });

    if (!projectionDetail) {
      const newProjection = new ProjectDetails({
        projectid,
        nearest_infrastructure
      });

      await newProjection.save();
      return res.status(201).json({ message: "Transport details added", data: newProjection });
    }

    projectionDetail.nearest_infrastructure.push(...nearest_infrastructure);
    await projectionDetail.save();

    return res.status(200).json({ message: "Transport details updated", data: projectionDetail });

  } catch (error) {
    console.error("Error in HandleAddNearestInfra:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// api to get the detail of projection details 
module.exports.HandleDeleteTransportDetail = async (req, res) => {
  const projectionDetailId = req.headers['x-projection-id'];  
  const deleteDataId = req.headers['x-deletedata-id'];

  try {
    if (!projectionDetailId || !deleteDataId) {
      return res.status(400).json({ message: "Missing IDs" });
    }

    let projectionDetail = await ProjectDetails.findById(projectionDetailId);

    if (!projectionDetail) {
      return res.status(404).json({ message: "Projection details not found" });
    }

    // Use pull to remove subdocument by _id
    projectionDetail.transport_detail.pull({ _id: deleteDataId });

    await projectionDetail.save();
    console.log(projectionDetail)

    return res.status(200).json({
      message: "Transport detail deleted successfully",
      data: projectionDetail
    });
  } catch (error) {
    console.error("Error in HandleDeleteTransportDetail:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};



// api to store the vale of job impact  

module.exports.HandleSoreJobImpact = async (req, res) => {
  try {
    console.log(JSON.stringify(req.body) , "**********" , JSON.stringify( req.headers['x-project-id']))
    const projectid = req.headers['x-project-id'];
    const job_impact = req.body.job_impact;

    if (!projectid) {
      return res.status(400).json({
        message: "Project ID is missing"
      });
    }

    const projectCheck = await Project.findById(projectid);
    console.log(projectCheck)
    if(!projectCheck){
      return res.status(400).json({
        message:"Bad Requset"
      })
    }

    let response = await ProjectionGraphData.findOne({ projectid:projectid });

    if (!response) {
      const jobdata = await ProjectionGraphData.create({
        projectid,
        job_impact
      });
      return res.status(201).json({ message: "Job impact added", data: jobdata });
    }

    response.job_impact.push(...job_impact);
    await response.save();
    return res.status(201).json({ message: "Job impact updated", data: response });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



// api to get the data of Job Impact
module.exports.HandleshowGraphData = async(req , res)=>{
   try {
    const projectid = req.headers['x-project-id'];
    let response = await ProjectionGraphData.findOne({projectid});
    if(!response){
      return res.status(308).json({
        message:"Data Missing"
      })
    }
    return res.status(201).json({
      message:"Data Fetched",
      data: response
    })
   } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
   }
}





// Api to store population trend 
module.exports.HandleStorePopulationTrend = async(req , res)=>{
  try {
    const projectid = req.headers['x-project-id'];
    const population_trend = req.body.population_trend;

    if (!projectid) {
      return res.status(400).json({
        message: "Project ID is missing"
      });
    }

    const projectCheck = await Project.findById(projectid);
    if(!projectCheck){
      return res.status(400).json({
        message:"Bad Requset"
      })
    }

    let response = await ProjectionGraphData.findOne({ projectid });

    if (!response) {
      const populationData = await ProjectionGraphData.create({
        projectid,
        population_trend
      });
      return res.status(201).json({ message: "Job impact added", data: populationData });
    }

    response.population_trend.push(...population_trend);
    await response.save();
    return res.status(201).json({ message: "Job impact updated", data: response });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}





// api to store the Population Trand
module.exports.HandleStoreLandPrice = async(req , res)=>{
  try {
    const projectid = req.headers['x-project-id'];
    const land_price_predection = req.body.land_price_predection;

    if (!projectid) {
      return res.status(400).json({
        message: "Project ID is missing"
      });
    }

    const projectCheck = await Project.findById(projectid);
    if(!projectCheck){
      return res.status(400).json({
        message:"Bad Requset"
      })
    }

    let response = await ProjectionGraphData.findOne({ projectid });

    if (!response) {
      const populationData = await ProjectionGraphData.create({
        projectid,
        land_price_predection
      });
      return res.status(201).json({ message: "Job impact added", data: populationData });
    }

    response.land_price_predection.push(...land_price_predection);
    await response.save();
    return res.status(201).json({ message: "Job impact updated", data: response });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
}



// api to get the detail of projection details 
// module.exports.HandleGetProjectionDetails = async (req, res) => {
//   console.log("hitted ")
//   const projectid = req.headers['x-project-id']; // spelling fix from `heders` to
//   try {
//     if (!projectid) {
//       return res.status(400).json({ message: "Project ID is missing" })
//     }
//     // check project 
//     const projectCheck = Project.findById({projectid})
//     if(!projectCheck){
//       return res.status(400).json({ message: "No Project Found" })

//     }
//     let projectionDetail = await ProjectDetails.findOne({ projectid });
//     let projectionGraphData = await ProjectionGraphData.findOne({ projectid })
//     console.log(`project graph Data ${projectionGraphData}`)
//     // if (!projectionDetail) {
//     //   return res.status(206).json({ message: "Projection details not found" });
//     // }
//     return res.status(200).json({
//       message: "Projection details found",
//       data: projectionDetail || [],
//       graphData:projectionGraphData || []
//     })
//   } catch (error) {
//     console.error("Error in HandleAddTransportAccess:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// }
const mongoose = require('mongoose'); 

module.exports.HandleGetProjectionDetails = async (req, res) => {
  console.log("hitted");
  const projectid = req.headers['x-project-id'];

  try {
    if (!projectid) {
      return res.status(400).json({ message: "Project ID is missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(projectid)) {
      return res.status(400).json({ message: "Invalid Project ID" });
    }

    const projectCheck = await Project.findById(projectid);
    if (!projectCheck) {
      return res.status(400).json({ message: "No Project Found" });
    }

    let projectionDetail = await ProjectDetails.findOne({ projectid });
    let projectionGraphData = await ProjectionGraphData.findOne({ projectid });

    // console.log(`project graph Data`, projectionGraphData);

    return res.status(200).json({
      message: "Projection details found",
      data: projectionDetail || [],
      graphData: projectionGraphData || []
    });
  } catch (error) {
    console.error("Error in HandleGetProjectionDetails:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


// api to update projectin Graph Data
module.exports.HandleEditProjectionGraphData = async (req, res) => {
  try {
    const projectionGraphId = req.headers['x-graph-id'];
    const editElementid = req.headers['x-element-id'];
    const editElementName = req.headers['x-name-id'];
    const { year, count } = req.body;

    if (!projectionGraphId || !editElementName || !editElementid) {
      return res.status(403).json({ message: "Missing Data" });
    }

    const response = await ProjectionGraphData.findById(projectionGraphId);
    if (!response) {
      return res.status(404).json({ message: "No Projection Found" });
    }

    // Find the element to update inside the correct array
    const targetArray = response[editElementName];
    if (!Array.isArray(targetArray)) {
      return res.status(400).json({ message: "Invalid element name" });
    }

    const elementToUpdate = targetArray.find(
      (item) => item._id.toString() === editElementid
    );

    if (!elementToUpdate) {
      return res.status(404).json({ message: "Element not found in array" });
    }

    // Update values
    if (year !== undefined) elementToUpdate.year = year;
    if (count !== undefined) elementToUpdate.count = count;

    await response.save();

    return res.status(200).json({
      message: "Updation Completed",
      data: response,
    });

  } catch (error) {
    console.error("Error in HandleEditProjectionGraphData:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
