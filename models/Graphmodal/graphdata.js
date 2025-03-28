const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
    sector: { type: String, required: true },
    cost: { type: Number, required: true },
    // action: { type: String, default: "" } // Optional field
});

const Sector = mongoose.model('Sector', sectorSchema);

module.exports = Sector;
