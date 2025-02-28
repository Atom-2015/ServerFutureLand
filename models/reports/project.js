const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Reference to Company schema
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    contractor: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    stages: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold'], // Enum for project stages
      default: 'planning',
    },
    kml: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;
