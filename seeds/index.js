const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 250; i++) {
        const random1000 = Math.floor(Math.random() * 700);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
          // your userId
            author: '66572803340a4d6398ef3643',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
            },
            images: [
                  {
                    url: 'https://res.cloudinary.com/dcbrfuldz/image/upload/v1716283418/YelpCamp/jwwyqabhtnpaigaktero.jpg',
                    filename: 'YelpCamp/jwwyqabhtnpaigaktero'
                  },
                  {
                    url: 'https://res.cloudinary.com/dcbrfuldz/image/upload/v1716283421/YelpCamp/ailtelr6vjihhsygqy1r.jpg',
                    filename: 'YelpCamp/ailtelr6vjihhsygqy1r'
                  },
                  {
                    url: 'https://res.cloudinary.com/dcbrfuldz/image/upload/v1716283422/YelpCamp/uswja3ytozgxupwrvbfv.jpg',
                    filename: 'YelpCamp/uswja3ytozgxupwrvbfv'
                  }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium voluptas unde iste voluptate dolor amet soluta. Fugiat, inventore non. Ipsam.',
            price 

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})