const Project = require('../models/reports/project');


module.exports.HandleStoreProjects = async (req, res) => {
    try {
        // Extract company ID from headers
        const companyId = req.headers['x-company-id'];
        const { startDate, endDate, contractor, cost, stages, kml, sector, country, state, city, projectname } = req.body;

        // Validate required fields
        if (!companyId || !startDate || !endDate || !contractor || !cost || !stages || !kml || !sector || !country || !state || !city) {
            return res.status(400).json({ message: "Missing Data" });
        }

        // Ensure KML is an array
        if (!Array.isArray(kml) || kml.length === 0 || kml.some(item => !item.url)) {
            return res.status(400).json({ message: "Invalid KML data" });
        }

        // Create a new project entry
        const response = await Project.create({
            companyId,
            startDate,
            endDate,
            contractor,
            cost,
            stages,
            kml,
            sector,
            country,
            state,
            city,
            project_name: projectname
        });

        return res.status(201).json({
            message: "Project created successfully",
            project: response,
        });
    } catch (error) {
        console.error("Error storing project:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




// LIst of all company 
module.exports.HandleAllProjects = async (req, res) => {
    try {
        // Extract company ID from headers
        const companyId = req.headers['x-company-id'];

        // Validate companyId
        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        // Fetch projects based on companyId
        const projects = await Project.find({ companyId });

        return res.status(200).json({
            message: "Projects fetched successfully",
            projects
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};





// Add Additional Value in project  


module.exports.HandleAdditionalData = async (req, res) => {
    try {
        const { districtMagistrate, population, registrarOffice, circleRate } = req.body;
        const projectId = req.headers["x-project-id"];

        // Validate input fields
        if ([districtMagistrate, population, registrarOffice, circleRate].some(val => !val || val === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Ensure population is a valid number
        if (isNaN(population) || population <= 0) {
            return res.status(400).json({ message: "Population must be a valid positive number" });
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Update project with district details
        project.district = {
            districtMagistrate,
            population,
            registrarOffice,
            circleRate
        };

        await project.save();
        res.status(200).json({ message: "District details added successfully", data: project });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};






// Api for speedometer
module.exports.HandleSpeedoMeterData = async (req, res) => {
    const companyId = req.headers['x-company-id'];
    const days = parseInt(req.query.days, 10); // Get 'days' from query params

    console.log(req.headers['x-Company-id'])

    if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
    }
    if (isNaN(days) || days <= 0) {
        return res.status(400).json({ message: "Invalid days value" });
    }

    try {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);

        const response = await Project.find({
            companyId,
            startDate: { 
                $gte: pastDate,  
                $lte: new Date()
            }
        }) ;

        if (!response || response.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }

        return res.status(200).json({
            message: "Speedometer data fetched successfully",
            data: response.length
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};






// Api to Delete Project
module.exports.DeleteProject = async (req, res) => {
    const projectId = req.headers['x-project-id'];
    if(!projectId){
        return res.status(400).json({message: "Project ID is required"});
    }
    try {
        const response = await Project.findByIdAndDelete(projectId);
        if(!response){
            return res.status(404).json({message: "Project not found"});
        }
        return res.status(200).json({message: "Project deleted successfully"});
    } catch (error) {
        return res.status(404).json({
            message:"Data Deleted"
        })
    }
}
