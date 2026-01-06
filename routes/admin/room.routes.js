const express = require('express');
const uploadImage = require('../../middleware/imageUpload');
const { addRoomPage, addRoom, editRoomPage, updateRoom, deleteRoom, changeRoomStatus } = require('../../controller/admin/room.conroller');
const routes = express.Router();

routes.get("/add-room", addRoomPage);
routes.post("/add-room", uploadImage.single("roomImage"), addRoom);
routes.get("/edit-room/:id", editRoomPage);
routes.post("/update-room/:id", uploadImage.single("roomImage"), updateRoom);
routes.get("/delete-room/:id",  deleteRoom);
routes.post("/status/:id", changeRoomStatus);

module.exports = routes;