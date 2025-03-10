const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    master_company:{
      type:String,
      required:true
    },
    company_name: {
      type: String,
      required: true,
      unique: true,
    },
    company_expiry: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
    PlansId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plans', // Reference to Credit schema
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Pending'], // Enum for predefined values
      default: 'Pending', // Default status
    },
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
