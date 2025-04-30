const mongoose = require('mongoose');

const ProjectionGraphDataSchema = new mongoose.Schema(
  {
    projectid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      // required:true,
    },
     job_impact:[{
        year:{
            type:Number
        },
        count:{
            type:Number
        }
     }],
     population_trend:[{
        year:{
            type:Number
        },
        count:{
            type:Number
        }
     }],
     land_price_predection:[{
        year:{
            type:Number
        },
        count:{
            type:Number
        }
     }]
 

  },

  { timestamps: true }
);

const ProjectionGraphData = mongoose.model('ProjectionGraphData', ProjectionGraphDataSchema);
module.exports = ProjectionGraphData;
