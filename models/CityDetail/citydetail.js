const mongoose = require('mongoose');

const CityDetailSchema = new mongoose.Schema(
    {
        city: {
            cityname: {
                type: String,
                required: true
            },
            country: {
                type: String
            },
            state: {
                type: String
            },
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            },
            imageUrl: {
                type: String
            },
            description: {
                type: String,
                maxlength: 1000
            }
        },

        history: [
            {
                title: { type: String },
                content: { type: String, maxlength: 2000 },
                imageUrl: { type: String }
            }
        ],

        transport: [
            {
                type: { type: String }, // e.g., "Rail", "Metro", "Bus"
                details: { type: String, maxlength: 2000 },
                imageUrl: { type: String }
            }
        ],

        socialImpact: [
            {
                aspect: { type: String }, // e.g., "Healthcare", "Education"
                impact: { type: String, maxlength: 2000 },
                imageUrl: { type: String }
            }
        ],

        population: [
            {
                year: { type: Number },
                count: { type: Number },
                notes: { type: String },
                imageUrl: { type: String }
            }
        ],

        culture: [
            {
                aspect: { type: String }, // e.g., "Festivals", "Languages"
                details: { type: String, maxlength: 2000 },
                imageUrl: { type: String }
            }
        ],

        economy: [
            {
                sector: { type: String }, // e.g., "Agriculture", "IT"
                info: { type: String, maxlength: 2000 },
                imageUrl: { type: String }
            }
        ],

        technology: [
            {
                field: { type: String }, // e.g., "Smart City Initiatives"
                description: { type: String, maxlength: 2000 },
                imageUrl: { type: String }
            }
        ]
    },
    { timestamps: true }
);

const CityDetail = mongoose.model('CityDetail', CityDetailSchema);
module.exports = CityDetail;
