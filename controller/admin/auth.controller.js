const bcrypt = require('bcrypt');
const User = require("../../model/user.model");
const otpGenerator = require('otp-generator');
const sendEmail = require('../../config/sendEmail.config');

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


exports.forgotPasswordPage = async (req, res) => {
  try{
      return res.render("forgotPassword/forgotPassword");
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}

exports.sendOtp = async (req, res) => {
  try{
      let user = await User.findOne({email: req.body.email, isActive: true});
      if(!user){
        console.log('User is not found or inactive.');
        return res.redirect("/forgot-password");
      }

      let otp = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})

      let message = {
        from: `${process.env.USER_EMAIL}`,
        to: `${user.email}`,
        subject: 'Rest Password OTP',
        html:`
        <h2>Welcome, ${user.firstName}</h2>
        <p>Your Reset Password OTP is: ${otp}. OTP valid for 5 Minutes.</p>
        `
      }
      await sendEmail(message);
      res.cookie('email', user.email);
      res.cookie('otp', otp);
      return res.redirect("/verify-otp");
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}

exports.verfiyOtpPage = async (req, res) => {
  try{
      return res.render("forgotPassword/verifyOtp");
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}
exports.verfiyOtp = async (req, res) => {
  try{
      const otp = req.cookies.otp;

      if(otp != req.body.otp){
        console.log('OTP is not Matched!!!!');
        return res.redirect("/verify-otp");
      }
      res.clearCookie('otp');
      return res.redirect("/reset-password");
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}

exports.resetPasswordPage = async (req, res) => {
  try{
      return res.render("forgotPassword/resetPassword");
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}

exports.resetPassword = async (req, res) => {
  try{
      let email = req.cookies.email;
      if(req.body.password != req.body.cpassword){
        console.log('Password and Confirm Password is Not Matched!!!');
        return res.redirect("/reset-password");
      }
      let hashpassword = await bcrypt.hash(req.body.password, 10);
      await User.findOneAndUpdate({email: email}, {password: hashpassword}, {new: true});

      res.clearCookie('email');
      return res.redirect("/");
  }catch(err){
    console.log(err);
    return res.redirect("/");
  }
}