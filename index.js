// // app.js
// const express = require('express');
// const app = express();
// const port = 3002;

// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Basic route
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// // Starting the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });



 
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./config/mongoose');
const helmet = require('helmet');
const cors = require('cors'); // Import CORS

const app = express();

// Middleware
app.use(express.json({ limit: '20mb' })); 
app.use(helmet());

// const whitelist = ['http://localhost:3000']; // Add the front-end domain here
// const corsOptions = {
//   // origin: (origin, callback) => {
//   //   if (!origin || whitelist.includes(origin)) {
//   //     callback(null, true); // Allow request from the frontend
//   //   } else {
//   //     callback(new Error('Not allowed by CORS')); // Deny the request if not from the whitelist
//   //   }
//   // },
//   origin: '*',
// };

app.use(cors({origin:'*'})); // Apply the CORS middleware


// Routes
app.use('/api', require('./routes'));

// Server setup
const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server is running at http://localhost:${PORT}`);
});