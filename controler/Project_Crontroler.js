const Project = require('../models/reports/project');


module.exports.HandleStoreProjects = async (req, res) => {
    try {
        // Extract company ID from headers
        // const companyId = req.headers['x-company-id'];
        const { startDate, endDate, contractor, cost, status, kml, sector, country, state, city, project_name ,population, districtMagistrate,registrarOffice , circleRate , documentFile } = req.body;

        console.log(`this is user data ${JSON.stringify(req.user , null , " ")}`);
        const id = req.user.company_id

        // console.log("companyId:", companyId);
        // console.log("startDate:", startDate);
        // console.log("endDate:", endDate);
        // console.log("contractor:", contractor);
        // console.log("cost:", cost);
        // console.log("status:", status);
        // console.log("kml:", kml);
        // console.log("sector:", sector);
        // console.log("country:", country);
        // console.log("state:", state);
        // console.log("city:", city);
        // console.log("project_name:", project_name);
        // console.log("population:", population);
        // console.log("districtMagistrate:", districtMagistrate);
        // console.log("registrarOffice:", registrarOffice);   
        // console.log("circleRate:", circleRate);
        console.log("sectdocumentFileor:", documentFile);
        
        // Validate required fields
        if (    !status  || !sector || !country || !state || !city) {
            return res.status(400).json({ message: "Missing Data" });
        }

        // Ensure KML is an array
        // if (!Array.isArray(kml) || kml.length === 0 || kml.some(item => !item.url)) {
        //     return res.status(400).json({ message: "Invalid KML data" });
        // }

        // Create a new project entry
        const response = await Project.create({
            companyId:id,
            startDate,
            endDate,
            contractor,
            cost,
            status,
            sector,
            country,
            state,
            city,
            documentFile,
            project_name,
            district: {   
                registrarOffice,    
                circleRate,
                population,
                districtMagistrate
            }
        });
        if (kml.length > 0) {
            response.kml.push(...kml.map(file => ({ url: file })));
            await response.save();
        }
        
        

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
// module.exports.HandleAllProjects = async (req, res) => {
//     try {
//         // Extract company ID from headers
//         // const companyId = req.headers['x-company-id'];
//         const companyId = req.user.company_id;
//         console.log("this is user data ", companyId);

//         if(companyId.toString() === "67eb7ca87d739618755ffec3"){
//             const projects2 = await Project.find();
//             console.log(`this is compant data for admin ${projects2}`);
//             return res.status(204).json({
//                 message: "Projects fetched successfully",
//                 projects2
//             })
//         }
        

//         // Validate companyId
//         if (!companyId) {
//             return res.status(400).json({ message: "Company ID is required" });
//         }

//         // Fetch projects based on companyId
//         const projects = await Project.find({ companyId });

//         return res.status(200).json({
//             message: "Projects fetched successfully",
//             projects
//         });
//     } catch (error) {
//         console.error("Error fetching projects:", error);
//         return res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };

module.exports.HandleAllProjects = async (req, res) => {
    try { 
        // console.log(req.user)
        const companyId = req.user.company_id;
        // console.log("This is user data: ", companyId);

        // Check if the company ID matches the admin ID and fetch all projects
        if (companyId.toString() === "67eb7ca87d739618755ffec3") {
            const projects = await Project.find();
            // console.log(`This is company data for admin: ${projects}`);
            
            // Change status code to 200 (OK) instead of 204
            return res.status(200).json({
                message: "Projects fetched successfully",
                projects
            });
        }

        // Validate companyId for other users
        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        // Fetch user's permission locations
        const companyPermission = await Company.findOne({ company_email: req.user.email }).select("permission_location");

        if (!companyPermission || !companyPermission.permission_location.length) {
            return res.status(403).json({ message: "You don't have permission to access any projects" });
        }

        console.log("User's permission locations:", companyPermission.permission_location);

        // Fetch all projects
        const allProjects = await Project.find();
        // console.log(allProjects);

        // Filter projects based on user's location permissions
        const filteredProjects = allProjects.filter(project => {
            return companyPermission.permission_location.some(permission => 
                permission.country === project.country &&
                permission.state === project.state &&
                permission.city.includes(project.city)
            );
        });

        // return res.status(200).json({ message: "ram ram", projects: filteredProjects });

        return res.status(200).json({
            message: "Projects fetched successfully",
            projects: filteredProjects
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
    const companyId = req.user.company_id;
    const days = parseInt(req.query.days, 10); // Get 'days' from query params

    if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
    }

    if (isNaN(days) || days <= 0) {
        return res.status(400).json({ message: "Invalid days value" });
    }

    try {

        // if(req.user.company_id === "")
    


        const companyPermission = await Company.findById(companyId).select("permission_location");

        if (!companyPermission) {
            return res.status(404).json({ message: "Company not found or no permissions" });
        }

        const allProjects = await Project.find();
        const filteredProjects = allProjects.filter(project => 
            companyPermission.permission_location.some(permission => 
                permission.country === project.country &&
                permission.state === project.state &&
                permission.city.includes(project.city)
            )
        );

        console.log("This is the filtered projects", filteredProjects);

        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);

        // Filter projects that were created within the specified days
        const recentProjects = filteredProjects.filter(project => 
            new Date(project.createdAt) >= pastDate
        );

        return res.status(200).json({
            message: "Speedometer data fetched successfully",
            data: recentProjects.length
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};





// ************************* api to store kml ******************************

module.exports.HandleAddKml = async (req, res) => {
    try {
        const companyId = req.headers['x-company-id'];
        const projectId = req.headers['x-project-id'];
        const kmlData = req.body.kmlData;

        // Validate required fields
        if (!companyId || !projectId || !kmlData || !kmlData.url) {
            return res.status(400).json({ message: "Company ID, Project ID, and KML URL are required" });
        }

        const project = await Project.findById({ projectId });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.kml.push(kmlData);
        await project.save();

        return res.status(200).json({ message: "KML data added successfully", data: project });

    } catch (error) {
        console.error("Error adding KML:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};






// Api to Delete Project
module.exports.HandleDeleteProject = async (req, res) => {
    const projectId = req.headers['x-project-id'];
    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }
    try {
        const response = await Project.findByIdAndDelete(projectId);
        if (!response) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        return res.status(404).json({
            message: "Data Deleted"
        })
    }
}



// Api to update the project

module.exports.HandleUpdateProject = async (req, res) => {
    const projectId = req.headers['x-project-id'];
    
    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,   
            req.body,    
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({ message: "Project updated successfully", project: updatedProject });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};







// api to get/retrive the data of kml 

module.exports.HandleGetKml = async(req , res)=>{
    const projectId = req.headers['x-project-id'];
    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }
    try {
        const response = await Project.findById( projectId ).select(" kml ");
// console.log(response)
        if (!response) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ message: "Project data retrieved successfully", data: response})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}




// api to retrive graph data sectors , Indian state , monetry range 

// module.exports.HandleChartData = async (req, res) => {
//     try {
//         // console.log(req.user)
//         const companyid = req.user.company_id;
//         const graphdata = await Project.find({companyId:companyid});

//         const chartData = {
//             sectors: {},
//             MonetaryRange: {
//                 "1-100": 0,
//                 "100-500": 0,
//                 "500-1000": 0,
//                 "1000-5000": 0,
//                 "5000+": 0  
//             }
//         };

//         graphdata.forEach((project) => {
//             // Count Sectors
//             if (!chartData.sectors[project.sector]) {
//                 chartData.sectors[project.sector] = 0;
//             }
//             chartData.sectors[project.sector]++;

//             // Categorize Monetary Ranges
//             const cost = project.cost;
//             if (cost >= 1 && cost < 100) chartData.MonetaryRange["1-100"]++;
//             else if (cost >= 100 && cost < 500) chartData.MonetaryRange["100-500"]++;
//             else if (cost >= 500 && cost < 1000) chartData.MonetaryRange["500-1000"]++;
//             else if (cost >= 1000 && cost <= 5000) chartData.MonetaryRange["1000-5000"]++;
//             else chartData.MonetaryRange["5000+"]++;
//         });

//         res.status(200).json({
//             message: "Graph data fetched successfully",
//             data:chartData, // Now everything is inside one object
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Internal Server Error", error: error.message });
//     }
// };


module.exports.HandleChartData = async (req, res) => {
    try {
        const companyid = req.user.company_id;
        const graphdata = await Project.find({ companyId: companyid });

        const chartData = {
            sectors: {},
            MonetaryRange: {
                "1-100": 0,
                "100-500": 0,
                "500-1000": 0,
                "1000-5000": 0,
                "5000+": 0  
            },
            countryData: {} // New country-wise data structure
        };

        graphdata.forEach((project) => {
            const { country, state, sector, cost } = project;

            // Count Sectors
            if (!chartData.sectors[sector]) {
                chartData.sectors[sector] = 0;
            }
            chartData.sectors[sector]++;

            // Categorize Monetary Ranges
            if (cost >= 1 && cost < 100) chartData.MonetaryRange["1-100"]++;
            else if (cost >= 100 && cost < 500) chartData.MonetaryRange["100-500"]++;
            else if (cost >= 500 && cost < 1000) chartData.MonetaryRange["500-1000"]++;
            else if (cost >= 1000 && cost <= 5000) chartData.MonetaryRange["1000-5000"]++;
            else chartData.MonetaryRange["5000+"]++;

            // Country-wise State Data
            if (!chartData.countryData[country]) {
                chartData.countryData[country] = {
                    states: new Set() // Using Set to avoid duplicate states
                };
            }
            chartData.countryData[country].states.add(state);
        });

        // Convert Set to Array
        Object.keys(chartData.countryData).forEach(country => {
            chartData.countryData[country].states = [...chartData.countryData[country].states];
        });

        res.status(200).json({
            message: "Chart data fetched successfully",
            data: chartData
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



  



const axios = require("axios");      // For making HTTP requests
const cheerio = require("cheerio");  // For web scraping
const Company = require('../models/company/company');
  
module.exports.HandleGetDMdata = async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }

        // Construct the Wikipedia URL for the city district
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(city)}_district`;

        const { data } = await axios.get(wikiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const $ = cheerio.load(data);
        let dmInfo = "";

        // Try to extract the DM name from Wikipedia's infobox
        $("table.infobox tr").each((index, element) => {
            const key = $(element).find("th").text().trim();
            const value = $(element).find("td").text().trim();

            if (key.includes("District magistrate") || key.includes("DM") || key.includes("Collector")) {
                dmInfo = value;
                return false; // Stop loop once we find the DM
            }
        });

        // If Wikipedia fails, fetch DM name from ChatGPT's internal tool
        if (!dmInfo) {
            dmInfo = await getDMFromChatGPT(city);
        }

        return res.json({ city, dm_name: dmInfo || "Not Found" });

    } catch (error) {
        return res.status(500).json({ error: "Error fetching data", details: error.message });
    }
};

// Function to fetch DM details from ChatGPT's internal tool
async function getDMFromChatGPT(city) {
    // I will fetch the latest DM name for you
    const dm_name = await fetchDMFromInternalTool(city);
    return dm_name || "Not Found";
}










