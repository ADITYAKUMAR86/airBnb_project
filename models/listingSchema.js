const mongoose = require("mongoose");
const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema); //! model kaa naam then collection then schema kaa 

module.exports = Listing;
