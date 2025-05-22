// const Joi = require("joi");
// const { logInfo, logError } = require("./logger");
// const { saveToCache, saveToDatabase } = require("./dataService");

// let storedCityDetail = null;

// const cityDetailSchema = Joi.object({
//   city: Joi.object({
//     cityname: Joi.string().required(),
//     country: Joi.string().required(),
//     state: Joi.string().required(),
//     latitude: Joi.number().required(),
//     longitude: Joi.number().required(),
//     imageUrl: Joi.string().uri().allow(""),
//     description: Joi.string().allow(""),
//   }).required(),
//   history: Joi.array().items(
//     Joi.object({
//       title: Joi.string().required(),
//       content: Joi.string().required(),
//       imageUrl: Joi.string().uri().allow(""),
//     })
//   ).required(),
//   transport: Joi.array().items(
//     Joi.object({
//       type: Joi.string().required(),
//       details: Joi.string().required(),
//       imageUrl: Joi.string().uri().allow(""),
//     })
//   ).required(),
//   socialImpact: Joi.array().items(
//     Joi.object({
//       aspect: Joi.string().required(),
//       impact: Joi.string().required(),
//       imageUrl: Joi.string().uri().allow(""),
//     })
//   ).required(),
//   population: Joi.array().items(
//     Joi.object({
//       year: Joi.number().integer().required(),
//       count: Joi.number().integer().required(),
//       notes: Joi.string().allow(""),
//       imageUrl: Joi.string().uri().allow(""),
//     })
//   ).required(),
//   culture: Joi.array().items(
//     Joi.object({
//       aspect: Joi.string().required(),
//       details: Joi.string().required(),
//       imageUrl: Joi.string().uri().allow(""),
//     })
//   ).required(),
//   economy: Joi.array().items(
//     Joi.object({
//       sector: Joi.string().required(),
//       info: Joi.string().required(),
//       imageUrl: Joi.string().uri().allow(""),
//     })
//   ).required(),
//   technology: Joi.array().items(
//     Joi.object({
//       field: Joi.string().required(),
//       description: Joi.string().required(),
//       imageUrl: Joi.string().uri().allow(""),
//     })
//   ).required(),
// });

// async function validatePayload(payload) {
//   try {
//     return await cityDetailSchema.validateAsync(payload, { abortEarly: false });
//   } catch (validationError) {
//     const errorDetails = validationError.details.map(d => ({
//       message: d.message,
//       path: d.path.join("."),
//     }));
//     throw { validationErrors: errorDetails };
//   }
// }

// async function preprocessData(data) {
//   logInfo("Preprocessing city data...");
//   Object.keys(data.city).forEach((key) => {
//     if (typeof data.city[key] === "string") {
//       data.city[key] = data.city[key].trim();
//     }
//   });
//   data.meta = { receivedAt: new Date().toISOString() };
//   return data;
// }

// async function saveData(data) {
//   logInfo("Saving data to cache and database...");
//   await saveToCache(data);
//   await saveToDatabase(data);
//   logInfo("Data saved successfully");
// }

// module.exports.HandleAddCitydetail = async (req, res) => {
//   try {
//     logInfo("Received API request to add city detail");
//     const validPayload = await validatePayload(req.body);
//     const processedData = await preprocessData(validPayload);
//     storedCityDetail = processedData;
//     await saveData(processedData);
//     return res.status(201).json({
//       message: "City detail processed, validated, and stored successfully",
//       meta: processedData.meta,
//       storedDataPreview: {
//         cityname: processedData.city.cityname,
//         country: processedData.city.country,
//         state: processedData.city.state,
//         transportCount: processedData.transport.length,
//         historyCount: processedData.history.length,
//       },
//     });
//   } catch (error) {
//     if (error.validationErrors) {
//       logError("Validation errors:", error.validationErrors);
//       return res.status(400).json({
//         message: "Payload validation failed",
//         errors: error.validationErrors,
//       });
//     }
//     logError("Unexpected error:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message || error,
//     });
//   }
// };








const citydetail = require('../models/CityDetail/citydetail');

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
// module.exports.HandleDeleteCitydetail = async (req, res) =>{
//   try {
//     const id = req.headers['x-cityDetail-id'];
//     const cityDetail = await citydetail.findByIdAndDelete(id);
//     if (!cityDetail) {
//       return res.status(404).json({
//         message: "City detail not found",
//       })
//     }
//     return res.status(200).json({
//       message: "City detail deleted successfully",
//     })
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//     })
//   }
// }



const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Assuming you have a logger utility

module.exports.HandleDeleteCitydetail = async (req, res) => {
  try {
    const id = req.headers['x-cityDetail-id'];

    // Validate presence of ID
    if (!id) {
      logger.warn('No city detail ID provided in headers.');
      return res.status(400).json({
        success: false,
        errorCode: 'MISSING_ID',
        message: 'City detail ID is required in request headers.',
      });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn(`Invalid city detail ID format: ${id}`);
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_ID',
        message: 'Provided city detail ID is not a valid MongoDB ObjectId.',
      });
    }

    // Attempt to delete city detail
    const cityDetail = await citydetail.findByIdAndDelete(id);

    if (!cityDetail) {
      logger.info(`City detail not found for ID: ${id}`);
      return res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message: 'City detail with the specified ID was not found.',
      });
    }

    // Optionally log deleted document details
    logger.info(`City detail deleted: ${JSON.stringify(cityDetail)}`);

    return res.status(200).json({
      success: true,
      message: 'City detail deleted successfully.',
      deletedCityDetailId: cityDetail._id,
    });

  } catch (error) {
    logger.error('Error deleting city detail', error);
    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error while deleting city detail.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
