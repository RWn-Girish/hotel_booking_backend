const bcrypt = require('bcrypt');
const User = require("../../model/user.model");

exports.dashboardPage = async (req, res) => {
  try {
    return res.render("dashboard");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.loginPage = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/dashboard");
    }
    return res.render("login");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};


exports.login = async (req, res) => {
  try {
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

exports.logOut = async (req, res) => {
  try {
    req.session.destroy((err) => {
        if(err){
            console.log(err)
            return;
        }else{
            return res.redirect("/");
        }
    })
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};


exports.changePasswordPage = async (req, res) => {
  try{
    return res.render("changePassword")
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}
exports.changePassword = async (req, res) => {
  try{
    let {oldPassword, newPassword, cpassword} = req.body;
    let user = req.user;
    let matchPass = await bcrypt.compare(oldPassword, user.password);
    if(!matchPass){
      console.log('Old Password is not matched!!!');
      return res.redirect("/change-password");
    }
    if(oldPassword == newPassword){
      console.log('Old & New Password is matched!!!');
      return res.redirect("/change-password"); 
    }
    if(newPassword != cpassword){
      console.log('New & Confirm Password is not matched!!!');
      return res.redirect("/change-password");
    }
    let hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, {password: hashPassword}, {new: true});
    return res.redirect("/dashboard");
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}

exports.myProfilePage = async (req, res) => {
  try{
      let user = req.user;
      return res.render("myProfile", {user});
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}