"use strict";
const readLine = require("node:readline");
const initData = require("./initialData.json");

const dbConnection = require("./lib/connect-mongoose");
const Advert = require("./models/advert");
const { resolve } = require("node:path");

loadData();

async function loadData() {
    await new Promise((resolve) => dbConnection.once('open', resolve));

  const confirmDeletion = await confirmDelete(
    "You will delete the entire DB, do you want to continue? (Y/N)"
  );

  if (!confirmDeletion) {
    process.exit();
  }

  await initAdverts();
  dbConnection.close();
}

async function initAdverts() {
  const deleted = await Advert.deleteMany();
  console.log(`${deleted.deletedCount} adverts were deleted`);

  const inserted = await Advert.insertMany(initData.adverts);
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
