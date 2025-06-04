const citydetail = require('../models/CityDetail/citydetail');


// api to add city detail 
module.exports.HandleAddCitydetail = async (req, res) => {
  try {
    const cityData = req.body;

    const newCityDetail = new citydetail(cityData);
    const savedCityDetail = await newCityDetail.save();

    return res.status(201).json({
      message: "City detail stored successfully",
      data: savedCityDetail,
    });
  } catch (error) {
    console.error("Error storing city detail:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};




// api to delete the data of city detail 
module.exports.HandleDeleteCitydetail = async (req, res) => {
  try {
    const id = req.headers['x-cityDetail-id'];
    const cityDetail = await citydetail.findByIdAndDelete(id);
    if (!cityDetail) {
      return res.status(404).json({
        message: "City detail not found",
      })
    }
    return res.status(200).json({
      message: "City detail deleted successfully",
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    })
  }
}



// const mongoose = require('mongoose');
// const logger = require('../utils/logger'); // Assuming you have a logger utility

// module.exports.HandleDeleteCitydetail = async (req, res) => {
//   try {
//     const id = req.headers['x-cityDetail-id'];

//     // Validate presence of ID
//     if (!id) {
//       logger.warn('No city detail ID provided in headers.');
//       return res.status(400).json({
//         success: false,
//         errorCode: 'MISSING_ID',
//         message: 'City detail ID is required in request headers.',
//       });
//     }

//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       logger.warn(`Invalid city detail ID format: ${id}`);
//       return res.status(400).json({
//         success: false,
//         errorCode: 'INVALID_ID',
//         message: 'Provided city detail ID is not a valid MongoDB ObjectId.',
//       });
//     }

//     // Attempt to delete city detail
//     const cityDetail = await citydetail.findByIdAndDelete(id);

//     if (!cityDetail) {
//       logger.info(`City detail not found for ID: ${id}`);
//       return res.status(404).json({
//         success: false,
//         errorCode: 'NOT_FOUND',
//         message: 'City detail with the specified ID was not found.',
//       });
//     }

//     // Optionally log deleted document details
//     logger.info(`City detail deleted: ${JSON.stringify(cityDetail)}`);

//     return res.status(200).json({
//       success: true,
//       message: 'City detail deleted successfully.',
//       deletedCityDetailId: cityDetail._id,
//     });

//   } catch (error) {
//     logger.error('Error deleting city detail', error);
//     return res.status(500).json({
//       success: false,
//       errorCode: 'SERVER_ERROR',
//       message: 'Internal Server Error while deleting city detail.',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };




// api to update the data of city detail


module.exports.HandleUpdateData = async (req, res) => {
  try {
    const projectionId = req.headers['x-projection-id'];
    const target = req.body.target;
    const itemId = req.body._id;

    if (!projectionId || !target || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: projection ID, target, or item ID',
      });
    }

    const updateFields = {};

    // Set dynamic field mappings based on target
    switch (target) {
      case 'transport':
        updateFields.type = req.body.type;
        updateFields.details = req.body.details;
        updateFields.imageUrl = req.body.imageUrl;
        break;
      case 'history':
        updateFields.title = req.body.title;
        updateFields.content = req.body.content;
        updateFields.imageUrl = req.body.imageUrl;
        break;
      case 'socialImpact':
        updateFields.aspect = req.body.aspect;
        updateFields.impact = req.body.impact;
        updateFields.imageUrl = req.body.imageUrl;
        break;
      case 'population':
        updateFields.year = req.body.year;
        updateFields.count = req.body.count;
        updateFields.notes = req.body.notes;
        updateFields.imageUrl = req.body.imageUrl;
        break;
      case 'culture':
        updateFields.aspect = req.body.aspect;
        updateFields.details = req.body.details;
        updateFields.imageUrl = req.body.imageUrl;
        break;
      case 'economy':
        updateFields.sector = req.body.sector;
        updateFields.info = req.body.info;
        updateFields.imageUrl = req.body.imageUrl;
        break;
      case 'technology':
        updateFields.field = req.body.field;
        updateFields.description = req.body.description;
        updateFields.imageUrl = req.body.imageUrl;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Invalid target: ${target}`,
        });
    }

    // Construct the dynamic update query
    const result = await citydetail.updateOne(
      { _id: projectionId, [`${target}._id`]: itemId },
      {
        $set: Object.entries(updateFields).reduce((acc, [key, value]) => {
          acc[`${target}.$.${key}`] = value;
          return acc;
        }, {}),
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found or no changes made.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `${target} data updated successfully.`,
      data: result
    });

  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};





// api to get all the data of cities 


module.exports.HandleGetcityDetailData = async (req, res) => {
  try {
    const { cityname, state, country } = req.body;
    console.log(req.body)

    // Validation
    if ([cityname, state, country].some(val => !val)) {
      return res.status(400).json({
        message: "Missing Data"
      });
    }

    // DB Query
    const cityData = await citydetail.findOne({
      "city.cityname": { $regex: `^${cityname}$`, $options: "i" },
      "city.state": { $regex: `^${state}$`, $options: "i" },
      "city.country": { $regex: `^${country}$`, $options: "i" }
    });


    if (!cityData) {
      return res.status(404).json({
        message: "City Not Found"
      });
    }

    // Success
    return res.status(200).json({
      message: "City Found",
      data: cityData
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message
    });
  }
};



// api to get all the city state country name 
module.exports.HandleGetAllCities = async (req, res) => {
  try {
    const cityData = await citydetail.find().select("city").lean();
    
    if (!cityData || cityData.length === 0) {
      return res.status(404).json({
        message: "No cities found"
      });
    }

    return res.status(200).json({
      message: "Cities found",
      data: cityData
    });
  } catch (error) {
    console.error("Error fetching city data:", error);
    return res.status(500).json({
      message: "An error occurred while fetching cities"
    });
  }
};



