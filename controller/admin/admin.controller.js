const uploadImageCloudinary = require("../../config/cloudinary.config");
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require("../../model/user.model");


exports.addAdminPage = async (req, res) => {
    try {
        return res.render("admin/addAdmin");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.viewAllUsers = async (req, res) => {
    try {
        let users = await User.find();
        return res.render("admin/viewUsers", {users});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.addNewAdmin = async (req, res) => {
    try {
        let profileImage = "";
       if(req.file){
         profileImage = await uploadImageCloudinary(req.file.path);
        try {
            await fs.unlinkSync(req.file.path);
        } catch (error) {
            console.log('File Missing: ', error);
        }
       }

       if(req.body.password == req.body.cpassword){
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            let admin = await User.create({
                ...req.body,
                password: hashPassword,
                profileImage: profileImage,
                role: 'admin'
            })
            return res.redirect("/admin/add-admin");
       }else{
        return res.redirect("/admin/add-admin");
       }

    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.editUserPage = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if(!user){
            return res.redirect('/admin/view-users');
        }
        return res.render("admin/editUser" , {user});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateUser = async (req, res) => {
    try {

        let user = await User.findById(req.params.id);
        if(!user){
            return res.redirect('/admin/view-users');
        }
        let profileImage = user.profileImage;
       if(req.file){
         profileImage = await uploadImageCloudinary(req.file.path);
        try {
            await fs.unlinkSync(req.file.path);
        } catch (error) {
            console.log('File Missing: ', error);
        }
       }

       await User.findByIdAndUpdate(user._id, {
        ...req.body,
        profileImage: profileImage
       }, {new: true})
        return res.redirect("/admin/view-users");

    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}