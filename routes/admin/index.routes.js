const express = require('express');
const { dashboardPage, loginPage, login, logOut, changePassword, changePasswordPage, myProfilePage } = require('../../controller/admin/auth.controller');
const routes = express.Router();
const passport = require('passport');

routes.get("/", loginPage);
routes.post("/login", passport.authenticate('local', {failureRedirect: '/'}), login );

routes.get("/dashboard", passport.isValidateUser, dashboardPage);
routes.get("/logout", logOut);
routes.get("/change-password", changePasswordPage);
routes.post("/change-password", changePassword);
routes.get("/profile", myProfilePage);

routes.use("/admin", passport.isValidateUser, require('./admin.routes'));
routes.use("/hotel", require('./hotel.routes'));
routes.use("/room", require('./room.routes'));

module.exports = routes;