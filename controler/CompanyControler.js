const Company = require('../models/company/company');


module.exports.HandleAddCompany = async (req, res) => {
  try {
    const { company_name, company_expiry, company_email, password, permission_location } = req.body;


    // console.log(JSON.stringify(req.body, null, 2)) 

    if (!company_name || !company_email || !password   ) {
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









// api to update the company
 

module.exports.HandleUpdateCompany = async (req, res) => {
  try {
    // Validate Company ID in headers
    const companyId = req.headers["x-company-id"];
    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    let { company_name, company_expiry, company_email, password, permission_location } = req.body;

    // Filter out undefined fields dynamically
    let updateFields = Object.fromEntries(
      Object.entries({ company_name, company_expiry, company_email, password }).filter(([_, v]) => v !== undefined)
    );

    // Process permission_location if provided
    if (Array.isArray(permission_location)) {
      updateFields.permission_location = permission_location
        .filter((p) => p.country && p.state && Array.isArray(p.cities) && p.cities.length > 0)
        .map((p) => ({
          country: p.country,
          state: p.state,
          city: p.cities.join(", "),
        }));
    }

    // Find and update company in one step
    const updatedCompany = await Company.findByIdAndUpdate(companyId, updateFields, { new: true });

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company updated successfully", company: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};






// This is the api to get all the Company list 

module.exports.HandleGetAllCompany = async(req , res) => {
  try {
    const response = await Company.find().select("-password -createdAt -updatedAt ");
    if(!response){
      return res.status(404).json({ message: "Company not found" });
    }
    // console.log("this is response of comopant data" , response);
    return  res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}







const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.HandleCreateSession = async (req, res) => {
  const privated = process.env.SECRET_KEY
  try {    
      console.log("This is body " ,req.body);
          
      const company = await Company.findOne({ company_email: req.body.email });
      console.log("this is company data in db " , company)
      if (!company) {
          return res.status(400).json({ message: 'company not found' });
      }        
      if (company.password !== req.body.password) {
          return res.status(400).json({ message: 'Invalid password' });
      }
      // if(company.isMaster){
      //   console.log("master company")
      // } 
      const master = company.isMaster;  
      console.log(master , "This is master")     
      const token = jwt.sign({
          email: company.company_email,
          name: company.company_name,
          company_id:company._id,
      },privated, { expiresIn: '1d' });
      // return res.status(200).json({ token });
      // console.log("************" , company.body.email);
      if(master === true ){
        console.log("ye master hai")
        return res.json({status:200 , company:token , company_id:company.company_name , isMaster:true})
        // return res.status(200).json({ token , isMaster: true });
      }
      return res.json({status:200 , company:token , company_id:company.company_name})

  } catch (error) {
      console.log(`***************************error in Sign In**************************** ${error}`);
      return res.status(500).json({ message: 'Internal server error', error });
  }  
};

