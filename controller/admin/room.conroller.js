const uploadImageCloudinary = require("../../config/cloudinary.config");
const Hotel = require("../../model/hotel.model");
const Room = require("../../model/room.model");
const fs = require("fs");

exports.addRoomPage = async (req, res) => {
  try {
    let hotels = await Hotel.find({ isActive: true });
    return res.render("room/addRoom", { hotels });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.addRoom = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.body.hotel);
    if (!hotel) {
      return res.redirect("/admin/dashboard");
    }
    let roomImage = "";
    if (req.file) {
      roomImage = await uploadImageCloudinary(req.file.path);
      try {
        await fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log("File Missing: ", error);
      }
    }
    const amenitiesArray = req.body.amenities
      ? req.body.amenities.split(",").map((item) => item.trim())
      : [];
    await Room.create({
      ...req.body,
      amenities: amenitiesArray,
      roomImage: roomImage,
    });
    return res.redirect("/room/add-room");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.editRoomPage = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    let hotels = await Hotel.find({ isActive: true });
    return res.render("room/editRoom", { hotels, room });
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    let roomImage = room.roomImage;
    if (req.file) {
      roomImage = await uploadImageCloudinary(req.file.path);
      try {
        await fs.unlinkSync(req.file.path);
      } catch (error) {
        console.log("File Missing: ", error);
      }
    }
    const amenitiesArray = req.body.amenities
      ? req.body.amenities.split(",").map((item) => item.trim())
      : room.amenities;
    await Room.findByIdAndUpdate(
      room._id,
      { ...req.body, amenities: amenitiesArray, roomImage: roomImage },
      { new: true }
    );
    return res.redirect("/hotel/view-hotels");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.redirect("/hotel/view-hotels");
    }
    await Room.findByIdAndDelete(room._id);
    return res.redirect("/hotel/view-hotels");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.changeRoomStatus = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }
    const newStatus = room.isActive ? false : true;
    await Room.findByIdAndUpdate(
      roomId,
      { isActive: newStatus },
      { new: true }
    );
    return res.json({
      success: true,
      message: "Room status updated",
      isActive: room.isActive,
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/dashboard");
  }
};
