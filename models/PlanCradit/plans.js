const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company', // Reference to the Company schema
      required: true,
    },
    packageDetails: {
      type: String, // Store plan details
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
    tenure: {
      type: Number, // Tenure in months or days
      required: true,
    },
    type: {
      type: String,
      enum: ['free', 'paid'], // Subscription type
      default: 'free',
    },
  },
  { timestamps: true }
);

const Plans = mongoose.model('Plan', PlanSchema);
module.exports = Plans;
