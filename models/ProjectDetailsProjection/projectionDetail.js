const mongoose = require('mongoose');

const ProjectionDetailSchema = new mongoose.Schema(
  {
    projectid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      // required:true,
    },
    transport_detail: [{
      type: {
        type: String
      },
      name: {
        type: String
      },
      distance: {
        type: Number
      },

    },
    ],
    nearest_infrastructure: [{
      type: {
        type: String
      },
      name: {
        type: String
      },
      distance: {
        type: Number
      },
    }]

    

  },

  { timestamps: true }
);

const ProjectionDetail = mongoose.model('ProjectionDetail', ProjectionDetailSchema);
module.exports = ProjectionDetail;
