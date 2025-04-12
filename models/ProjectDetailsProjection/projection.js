const mongoose = require('mongoose');

const ProjectionSchema = new mongoose.Schema(
  {
    projectid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Project',
      required:true,
    },
    transportation_access:{
        type: Boolean,
        default: false,
    },
    land_price:{
        type: Boolean,
        default: false,
    },
    job_impact:{
        type: Boolean,
        default: false,
    },
    population:{
        type: Boolean,
        default: false,
    },
    social_impact:{
        type: Boolean,
        default: false,
    },
    nearest_infra:{
        type: Boolean,
        default: false,
    },
    
       
   
  },
 
  { timestamps: true }
);

const Projection = mongoose.model('Projection', ProjectionSchema);
module.exports = Projection;
