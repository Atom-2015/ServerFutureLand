const Project = require('../models/reports/project');

 
module.exports.HandleStoreProjects = async (req, res) => {
    try {
        // Extract company ID from headers
        const companyId = req.headers['x-company-id'];
        const { startDate, endDate, contractor, cost, stages, kml, sector, country, state, city , projectname} = req.body;

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
            project_name:projectname
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
