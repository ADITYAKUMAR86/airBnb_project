const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listingSchema");
const sampleListings = require("./init/data");
const methodOverride = require('method-override');
const errorhandler = require("./errorhandler");


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

main()
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wander_lust");
}

const checkToken = (req, res, next) => {
    let {token } = req.query;
    if(token === "giveaccess"){
        next();
    }
    throw new errorhandler(404,"accesss denied")
}

app.get('/',checkToken,  (req,res) => {
    res.send('data')
})

app.get('error', (req, res) => {
    abc = abc;
})


app.get("/", (req, res) => {
    res.redirect("/listing");
});

// app.get('/list', (req, res) =>{
//     const newListing = new Listing({
//         title : 'goa',
//         description : 'nice house',
//         price : 7000,
//         location : 'south',
//         country : 'india'
//     })
//     newListing.save();
//     res.send('listing')
// })

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
};

// initDB();


app.get('/listing' , async (req, res) => {
    const allList =  await Listing.find({});
    res.render("listing/listing.ejs" , { allList });
});

app.get('/listing/new', (req, res) => {
    res.render('listing/listingForm.ejs');
});

app.get('/listing/:id', async (req, res) => {
    const {id} = req.params;
    const deatailedData = await Listing.findById(id);
    if (!deatailedData) {
        return res.redirect('/listing');
    }
    // console.log(deatailedData);
    res.render('listing/showingList.ejs', {deatailedData});
});


app.post('/listing/new', async (req, res, next) => {
    try {
        // const {title, description , price , loaction, country} = req.body;
        const data = req.body;
        const newData = new Listing(data);
        await newData.save();
        res.redirect('/listing');
    } catch (error) {
        next(error);
    }
});

app.post('/listing', async (req, res) => {
    const data = req.body;
    const newData = new Listing(data);
    await newData.save();
    res.redirect('/listing');
});

app.get('/listing/:id/edit' , async (req,res) => {
    const {id} = req.params;   
    const dataToBeEdit = await Listing.findById(id); 
    if (!dataToBeEdit) {
        return res.redirect('/listing');
    }
    res.render('listing/edit.ejs', {dataToBeEdit});
});

app.put('/listing/:id', async (req ,res) =>{
    const {id} = req.params;
    // const {title, description,price , location  , country} = req.body;
    const updatedData = await Listing.findByIdAndUpdate(id, req.body, {runValidators : true});
    res.redirect('/listing');
});

app.delete('/listing/:id' , async (req,res) => {
    const {id}= req.params;
    await Listing.findByIdAndDelete(id);
    console.log(id);
    res.redirect('/listing');   
});

app.listen(8080, () => {
    console.log("server is running at port 8080");
});
