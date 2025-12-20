const express = require('express');
const { addAdminPage, addNewAdmin, viewAllUsers, editUserPage, updateUser } = require('../../controller/admin/admin.controller');
const uploadImage = require('../../middleware/imageUpload');
const routes = express.Router();

routes.get("/add-admin", addAdminPage);
routes.get("/view-users", viewAllUsers);

routes.post("/add-admin", uploadImage.single('profileImage'), addNewAdmin);

routes.get("/edit-user/:id", editUserPage);
routes.post("/update-user/:id", uploadImage.single('profileImage'), updateUser);

module.exports = routes;