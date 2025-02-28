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
