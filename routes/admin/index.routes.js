const express = require('express');
const { dashboardPage, loginPage } = require('../../controller/admin/auth.controller');
const routes = express.Router();


routes.get("/", loginPage);

routes.get("/dashboard", dashboardPage);


routes.use("/admin", require('./admin.routes'));

module.exports = routes;