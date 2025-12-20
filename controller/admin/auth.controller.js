exports.dashboardPage = async (req, res) => {
    try {
        return res.render("dashboard");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.loginPage = async (req, res) => {
    try {
        return res.render("login");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}