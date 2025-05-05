const compony = require('../models/company/company')
const User = require('../models/user/user')
const report = require('../models/reports/reports');
const Company = require('../models/company/company');

module.exports.main = async (req, res) => {
    try {
        // const data = {name: "Aditya" , title:"panday"};
        const data = await compony.find();
        if (!data) {
            return res.status(402).json({
                message: "Error"
            })
        }
        return res.status(200).json({
            data: data
        })
        // return res.send(data);
    } catch (error) {
        return res.send(`**************This is error*********** ${error}`);
    }
}



module.exports.healthchecker = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Every Thing Good"
        })
    } catch (error) {
        return res.status(404).json({
            message: "Error in Container Health"
        })
    }
}



// api to get all user
module.exports.UserList = async (req, res) => {
    if (!req.headers['x-company-id']) {
        return res.status(402).json({
            message: "Company id is missing"
        })
    }
    try {
        const response = await User.find({ company_name: req.headers['x-company-id'] });


        if (!response) {
            return res.status(402).json({
                message: "No user found"
            })
        }
        return res.status(200).json({
            data: response,
            message: "User List"
        })

    } catch (error) {
        return res.status(402).json({
            message: "Internal Server Error"
        })
    }
}


// Api to get all report for perticular company

module.exports.HandleAllReport = async (req, res) => {
    if (!req.headers['x-company-id']) {
        return res.status(402).json({
            message: "Company id is missing"
        })
    }
    try {
        const companyname = await Company.findById(req.headers['x-company-id']).select('company_name');
        console.log(companyname)


        const response = await report.find({ inspaction_company_owner: companyname.company_name });
        console.log(`this is resposne ${response}`)

        if (!response) {
            return res.status(402).json({
                message: "No user found"
            })
        }
        return res.status(200).json({
            data: response,
            message: "User List"
        })

    } catch (error) {
        return res.status(402).json({
            message: "Internal Server Error"
        })
    }
}



// project detail project name , state , country , date , contractor , start , end , cost , sector  *********** Done *************8
// project get 
// user add 
// user list 




// task mail api G mail logic

module.exports.TaskEmail = async (req, res) => {
    try {
      console.log(`body hai ye ${req.body.email}`)
      const  email  = req.body.email; // User's email from request
  
      // Generate a 6-digit OTP
      const otp = crypto.randomInt(100000, 999999);
  
      // Configure Gmail SMTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER || "atom.data.01@gmail.com", // Your Gmail
          pass: process.env.GMAIL_PASS || "qijd sukq smib uzav", // App Password (Not actual Gmail password)
        },
      });
      const tasktitle = req.body.tasktitle;
  
      // Email content
      const mailOptions = {
        from: "atom.data.01@gmail.com",
        to: email ,
        subject: "You Have Been Assigned New Task",
        text: `Hii   
         
        ${tasktitle}
        
        `,
      };
  
      // Send Email
      const info = await transporter.sendMail(mailOptions);
  
      console.log("Email sent: " + info.response);
      // return res.status(200).json({ message: "OTP sent successfully", otp }); 
      return res.status(200).json({ message: "Message Email Sent" }); 
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return res.status(500).json({ error: "Failed to send OTP email" });
    }
};
  

