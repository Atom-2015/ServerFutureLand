const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,  
      required: true,
      minlength: 1,   
      maxlength: 1000, 
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    startDate: {
      type: Date,
      // required: true,
    },
    endDate: {
      type: Date,
      // required: true,
    },
    contractor: {
      type: String,
      // required: true,
      // trim: true,
    },
    cost: {
      type: Number,
      // required: true,
      min: 0,
    },
    status: {
      type: String,
      // enum: ['planning', 'in-progress', 'completed', 'on-hold'],
      // default: 'planning',
    },
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    areaUnit: {
      type: String,
      required: true,
      trim: true,
    },
    
    kml: [
      {
        url: {
          type: String,
          // required: true,
        },
      },
    ],
    documentFile: [String],
    district: {
      districtMagistrate: {
        type: String,
        // required: true,
        trim: true,
      },
      population: {
        type: Number,
        // required: true,
        min: 0,
      },
      registrarOffice: {
        type: String,
        // required: true,
        trim: true,
      },
      circleRate: {
        type: Number,
        // required: true,
        min: 0,
      },
      circleRateUnit: {
        type: String,
        required: true,
        trim: true,
      },
       
    },
  },
 
  { timestamps: true }
);

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
