const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
      unique: true,
    },
    company_expiry: {
      type: Date,
    },
    company_email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {  // Fixed typo from "passowrd"
      type: String,
      required: true,
    },
    isMaster:{
      type:Boolean,
      default:false
    },
    permission_location:[{
      country: {
        type: String,
        required: true,  
      },
      state: {
        type: String,
        required: true,   
      },
      city: {
        type: String,
        required: true, 
      },
    }],
    
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
