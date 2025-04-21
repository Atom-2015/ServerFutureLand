const Project = require('../models/reports/project');
const Projection = require('../models/ProjectDetailsProjection/projection');
const Company = require('../models/company/company');
const ProjectDetails = require('../models/ProjectDetailsProjection/projectionDetail');





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





// api to get the detail of projection details 
module.exports.HandleGetProjectionDetails = async (req, res) => {
  const projectid = req.headers['x-project-id']; // spelling fix from `heders` to
  try {
    if (!projectid) {
      return res.status(400).json({ message: "Project ID is missing" })
    }
    let projectionDetail = await ProjectDetails.findOne({ projectid });
    if (!projectionDetail) {
      return res.status(206).json({ message: "Projection details not found" });
    }
    return res.status(200).json({
      message: "Projection details found",
      data: projectionDetail
    })
  } catch (error) {
    console.error("Error in HandleAddTransportAccess:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}


// // api to add nearest Infra access details
module.exports.HandleAddNearestInfra = async (req, res) => {
  const nearest_infrastructure = req.body;
  const projectid = req.headers['x-project-id'];
  // console.log(`Project data ${nearest_infrastructure} , projectid ${projectid}`)
  if (!nearest_infrastructure || !Array.isArray(nearest_infrastructure) || nearest_infrastructure.length === 0 || !projectid) {
    return res.status(400).json({ message: "Fields Missing" });
  }

  for (const val of nearest_infrastructure) {
    if (!val.value || !val.name || !val.type) {
      return res.status(400).json({
        message: "All fields must be filled out"
      });
    }
  }

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
module.exports.HandleGetNearest_infrastructure = async (req, res) => {
  const projectid = req.headers['x-project-id']; // spelling fix from `heders` to
  try {
    if (!projectid) {
      return res.status(400).json({ message: "Project ID is missing" })
    }
    let projectionDetail = await ProjectDetails.findOne({ projectid });
    if (!projectionDetail) {
      return res.status(206).json({ message: "Projection details not found" });
    }
    return res.status(200).json({
      message: "Projection details found",
      data: projectionDetail
    })
  } catch (error) {
    console.error("Error in HandleAddTransportAccess:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}

