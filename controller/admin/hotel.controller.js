const uploadImageCloudinary = require("../../config/cloudinary.config");
const Hotel = require("../../model/hotel.model");
const Room = require("../../model/room.model");
const fs = require('fs');

exports.addHotelPage = async (req, res) => {
  try {
    return res.render("hotel/addHotel");
  } catch (err) {
    console.log(err);
    return res.redirect("/dashboard");
  }
};

exports.addHotel = async (req, res) => {
  try {
    const localPaths = req.files.map((file) => file.path);
    let hotelImagesPaths =
      localPaths.length > 0
        ? await Promise.all(
            localPaths.map(async (filePath) => {
              const result = await uploadImageCloudinary(filePath);
              return result;
            })
          )
        : [];
    try {
      await Promise.all(
        localPaths.map(async (file) => {
          await fs.unlinkSync(file);
        })
      );
    } catch (error) {
      console.error("Error deleting files:", error);
    }
    const newHotel = await Hotel.create({
      ...req.body,
      hotelImages: hotelImagesPaths,
    });
    return res.redirect("/hotel/add-hotel");
  } catch (error) {
    console.error(error);
    return res.redirect("/dashboard");
  }
};

exports.viewHotelsPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;

    const search = req.query.search ? req.query.search.trim() : "";
    const status = req.query.status || "";
    const sort = req.query.sort || "newest";

    const filter = {};

    // Search (name or location)
    if (search) {
      filter.$or = [
        { hotelName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    // Sorting
    let sortObj = {};
    switch (sort) {
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "name_asc":
        sortObj = { hotelName: 1 };
        break;
      case "name_desc":
        sortObj = { hotelName: -1 };
        break;
      case "newest":
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const totalHotels = await Hotel.countDocuments(filter);

    const hotels = await Hotel.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(totalHotels / limit);

    return res.render("hotel/viewHotels", {
      hotels,
      search,
      status,
      sort,
      currentPage: page,
      totalPages,
      totalHotels,
    });
  } catch (error) {
    console.error(error);
    return res.redirect("/dashboard");
  }
};

exports.singleHotelPage = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    const rooms = await Room.find({ hotel: hotelId });
    return res.render("hotel/singleHotel", { hotel, rooms });
  } catch (error) {
    console.error(error);
    return res.redirect("/dashboard");
  }
};

exports.editHotelPage = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    return res.render("hotel/editHotel", { hotel });
  } catch (error) {
    console.error(error);
    return res.redirect("/dashboard");
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    let hotel = await Hotel.findById(hotelId);

    const localPaths = req.files.map((file) => file.path);
    let hotelImagesPaths =
      localPaths.length > 0
        ? await Promise.all(
            localPaths.map(async (filePath) => {
              const result = await uploadImageCloudinary(filePath);
              return result;
            })
          )
        : hotel.hotelImages;
    try {
      await Promise.all(
        localPaths.map(async (file) => {
          await fs.unlinkSync(file);
        })
      );
    } catch (error) {
      console.error("Error deleting files:", error);
    }
    await Hotel.findByIdAndUpdate(
      hotelId,
      {
        ...req.body,
        hotelImages: hotelImagesPaths,
      },
      { new: true }
    );
    return res.redirect(`/hotel/view-hotels`);
  } catch (error) {
    console.error(error);
    return res.redirect("/dashboard");
  }
};


exports.changeStatus = async(req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId);
        if(!hotel) {
            return res.json({success: false, message: 'Hotel not found'});
        } 
        const newStatus = hotel.isActive ? false : true;
        await Hotel.findByIdAndUpdate(hotelId, { isActive: newStatus }, {new: true});
        return res.json({
      success: true,
      message: 'Hotel status updated',
      isActive: hotel.isActive,
    });
    } catch (error) {
        console.error(error);
        return res.redirect("/dashboard");
    }   
};