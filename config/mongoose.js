 

require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const response = await mongoose.connect('mongodb+srv://aditya:ZQ9jPtfvnvqsWJ7X@hub.18kar.mongodb.net/HubDashboard');
    console.log("***************connected to database***************", response.connection.host);
  } catch (error) {
    console.error("*************error in connecting to database********************", error);
  }
})();