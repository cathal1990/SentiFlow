const db = require("./database");
const User = require("./User");
const axios = require("axios");

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });

    //use this area to sync your database - example
    // await Promise.all(seed.map((user) => {User.create(user)}));

    console.log("🌱🌱 Seeding Successful 🌱🌱");
  } catch (err) {
    console.log(err);
  }
};

// syncAndSeed();

//Model relationships go here

module.exports = {
  // Include your models in this exports object as well!
  db,
  syncAndSeed
};


//Delay function

// let myPromise = () =>
//   new Promise((resolve, reject) => {
//     setTimeout(function () {
//       resolve("Count");
//     }, 100);
// });