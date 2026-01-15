const express = require('express');
const { dashboardPage, loginPage, login, logOut, changePassword, changePasswordPage, myProfilePage, forgotPasswordPage, sendOtp, verfiyOtpPage, verfiyOtp, resetPasswordPage, resetPassword } = require('../../controller/admin/auth.controller');
const routes = express.Router();
const passport = require('passport');

routes.get("/", loginPage);
routes.post("/login", passport.authenticate('local', {failureRedirect: '/'}), login );

routes.get("/dashboard", passport.isValidateUser, dashboardPage);
routes.get("/logout", logOut);
routes.get("/change-password", changePasswordPage);
routes.post("/change-password", changePassword);
routes.get("/profile", myProfilePage);

routes.get("/forgot-password", forgotPasswordPage);
routes.post("/forgot-password", sendOtp);
routes.get("/verify-otp", verfiyOtpPage);
routes.post("/verify-otp", verfiyOtp);
routes.get("/reset-password", resetPasswordPage);
routes.post("/reset-password", resetPassword);


routes.use("/admin", passport.isValidateUser, require('./admin.routes'));
routes.use("/hotel", require('./hotel.routes'));
routes.use("/room", require('./room.routes'));

module.exports = routes;