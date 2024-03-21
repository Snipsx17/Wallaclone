"use strict";
const readLine = require("node:readline");
const bcrypt = require('bcrypt');
const initData = require("./initialData.json");
const dbConnection = require("./lib/connect-mongoose");
const User = require('./models/user');
const Advert = require("./models/advert");
const Tag = require("./models/tag");

loadData();

async function loadData() {
  await new Promise((resolve) => dbConnection.once("open", resolve));

  const confirmDeletion = await confirmDelete(
    "You will delete the entire DB, do you want to continue? (Y/N)"
  );

  if (!confirmDeletion) {
    process.exit();
  }

  const usersIds = await initUsers();
  await initAdverts(usersIds);
  await initTags();
  dbConnection.close();
}

async function initTags() {
  const deleted = await Tag.deleteMany();
  console.log(`${deleted.deletedCount} tags were deleted`);

  const inserted = await Tag.insertMany(initData.tags);
  console.log(`${inserted.length} tags created.`);
}

async function initUsers() {
  const deleted = await User.deleteMany();
  console.log(`${deleted.deletedCount} user were deleted`);
  const users = initData.users;
  users[0].password = await bcrypt.hash(users[0].password, 10);
  users[1].password = await bcrypt.hash(users[1].password, 10);
  
  const inserted = await User.insertMany(initData.users);
  const usersIds = inserted.map(user => user._id.toString());
  console.log(`${inserted.length} user created.`);
  return usersIds;
}

async function initAdverts(usersIds) {
  const deleted = await Advert.deleteMany();
  console.log(`${deleted.deletedCount} adverts were deleted`);
  const adverts = initData.adverts;
  const advertsWithOwner = initData.adverts.map(advert => {
    adverts.indexOf(advert) % 2 ? advert.owner = usersIds[0] : advert.owner = usersIds[1]
    return advert;
  });

  const inserted = await Advert.insertMany(advertsWithOwner);
  console.log(`${inserted.length} adverts created.`);
}

async function confirmDelete(text) {
  return new Promise((resolve, reject) => {
    const interf = readLine.Interface({
      input: process.stdin,
      output: process.stdout,
    });

    interf.question(text, (respuesta) => {
      interf.close();
      resolve(respuesta.toLowerCase() === "y");
    });
  });
}
