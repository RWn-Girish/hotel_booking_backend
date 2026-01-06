const express = require('express');
const { addHotelPage, addHotel, viewHotelsPage, singleHotelPage, editHotelPage, updateHotel, changeStatus } = require('../../controller/admin/hotel.controller');
const uploadImage = require('../../middleware/imageUpload');
const routes = express.Router();

routes.get("/add-hotel", addHotelPage);
routes.post("/add-hotel", uploadImage.array("hotelImages"), addHotel);
routes.get("/view-hotels", viewHotelsPage);
routes.get("/:id", singleHotelPage);
routes.get("/edit-hotel/:id", editHotelPage);
routes.post("/update-hotel/:id", uploadImage.array("hotelImages"), updateHotel);
routes.post("/status/:id", changeStatus);

module.exports = routes;