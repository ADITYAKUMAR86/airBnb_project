const mongoose = require("mongoose");
const sampleData = require("./data");
const ListingSchema = require("../models/listingSchema");

main()
    .then(() => {
        console.log("connected to DB");
        initDB();
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wander_lust");
}

const initDB = async () => {
    await ListingSchema.deleteMany({});
    await ListingSchema.insertMany(sampleData);
    console.log("data was initialized");
    await mongoose.connection.close();
};