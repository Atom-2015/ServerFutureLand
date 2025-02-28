const Project = require('../models/reports/project');

 

module.exports.HandleStoreProjects = async (req, res) => {
    try {
        // Extract company ID from headers
        const companyId = req.headers['x-company-id'];
        const { startDate, endDate, contractor, cost, stages, kml } = req.body;

        // Check if all required fields are provided
        if (!companyId || [startDate, endDate, contractor, cost, stages, kml].includes(null) || [startDate, endDate, contractor, cost, stages, kml].includes('')) {
            return res.status(400).json({ message: "Missing Data" });
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
        });

        if (response) {
            return res.status(201).json({
                message: "Project created successfully",
                project: response,
            });
        } else {
            return res.status(500).json({ message: "Failed to create project" });
        }
    } catch (error) {
        console.error("Error storing project:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
