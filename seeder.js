const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env'});

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${ __dirname }/_data/bootcamps.json`));
const courses = JSON.parse(fs.readFileSync(`${ __dirname }/_data/courses.json`));
const users = JSON.parse(fs.readFileSync(`${ __dirname }/_data/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${ __dirname }/_data/reviews.json`));

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch(error) {
        console.error(error);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data deleted...'.red.inverse);
        process.exit();
    } catch(error) {
        console.error(error);
    }
};

if (process.argv[2] === '-import') {
    importData();
} else if (process.argv[2] === '-delete') {
    deleteData();
}
