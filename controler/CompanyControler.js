const Company = require('../models/company/company');


module.exports.HandleAddCompany = async (req, res) => {
  try {
    const { company_name, company_expiry, company_email, password, permission_location } = req.body;


    // console.log(JSON.stringify(req.body, null, 2)) 

    if (!company_name || !company_email || !password || !permission_location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const checkEmail = await Company.findOne({ email: company_email });
    if (checkEmail) {
      return res.status(302).json({
        message: "Email already exists",
      })
    }

    // Check if company name already exists
    const existingCompany = await Company.findOne({ company_name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company name already exists' });
    }

    // Create new company (password stored as plain text)
    const newCompany = new Company({
      company_name,
      company_expiry,
      company_email,
      password,
    });
    //   newCompany.permission_location.push(permission_location);

    const filteredLocations = permission_location
      .filter(
        (p) =>
          p.country.trim() !== "" && // Remove empty country
          p.state.trim() !== "" &&   // Remove empty state
          Array.isArray(p.cities) && p.cities.length > 0 // Ensure cities exist
      )
      .map((p) => ({
        country: p.country,
        state: p.state,
        city: p.cities.join(", ") // Convert array to string
      }));

    newCompany.permission_location = filteredLocations;

    console.log("Filtered Data:", JSON.stringify(newCompany.permission_location, null, 2));
 
    await newCompany.save();
    res.status(201).json({ message: 'Company created successfully', company: newCompany });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};





// Api to delte company
module.exports.HandleDeleteCompany =  async(req , res)=>{
  if (!req.headers['x-company-id']) {
    return res.status(400).json({ message: 'Company ID is required' });
  }
  try {
    const response = await Company.findByIdAndDelete(req.headers['x-company-id']);
    if (!response) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

