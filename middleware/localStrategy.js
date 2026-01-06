const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user.model');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
    let user = await User.findOne({email: email}); 
    if(!user || !user.isActive){
       return done(null, false);
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
       return done(null, false);
    }
    return done(null, user);
}));

passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser(async(id, done)=> {
    let user = await User.findById(id);
    if(user){
        done(null, user);
    }
});

passport.isValidateUser = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        return res.redirect("/");
    }
};

passport.setLocalUser = (req, res, next) => {
    if(req.isAuthenticated()){
        res.locals.user = req.user
    }
    next();
};

module.exports = passport;