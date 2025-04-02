const Graph = require('../models/Graphmodal/graphdata');




// const Sector = require('../models/sectorModel'); // Import the Sector model

module.exports.HandleAddGraphData = async (req, res) => {
    try {
        const { sector, cost } = req.body;
 
        if (!sector || !cost) {
            return res.status(400).json({ message: "Sector and Cost are required." });
        } 
        const newSector = new Graph({ sector, cost });
        await newSector.save();

        res.status(201).json({ message: "Sector data saved successfully!", data: newSector });

    } catch (error) {
        res.status(500).json({ error: error.message || "Server Error" });
    }
};




// apt to show all data of Graph

module.exports.HandleShowGraphdata = async (req, res) => {
    try { 
        const graphData = await Graph.find();
 
        if (!graphData.length) {
            return res.status(404).json({ message: "No graph data found." });
        }

        res.status(200).json({ message: "Graph data fetched successfully!", data: graphData });

    } catch (error) {
        res.status(500).json({ error: error.message || "Server Error" });
    }
};


// api to delete the data of graph 
module.exports.HandleDeleteGraphData = async (req, res) => {
    try {
        const graphId = req.headers['x-graph-id'];
        if (!graphId) {
            return res.status(400).json({ message: "Graph ID is required in headers." });
        }
        const deletedData = await Graph.findByIdAndDelete(graphId);
        if (!deletedData) {
            return res.status(404).json({ message: "Graph data not found." });
        }

        res.status(200).json({ message: "Graph data deleted successfully!", deletedData });

    } catch (error) {
        res.status(500).json({ error: error.message || "Server Error" });
    }
};

