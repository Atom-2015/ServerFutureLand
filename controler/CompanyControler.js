const Company = require('../models/company/company')


// crete nested company 
module.exports.HandleAddCompany = async (req, res) => {
    try {
      const { master_company, company_name, company_expiry, createdBy, PlansId, status } = req.body;
  
      // Check if company name already exists
      const existingCompany = await Company.findOne({ company_name });
      if (existingCompany) {
        return res.status(400).json({ message: 'Company name already exists' });
      }
  
      // Create new company
      const newCompany = new Company({
        master_company,
        company_name,
        company_expiry,
        createdBy,
        PlansId,
        status,
      });
  
      await newCompany.save();
      res.status(201).json({ message: 'Company created successfully', company: newCompany });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  
  