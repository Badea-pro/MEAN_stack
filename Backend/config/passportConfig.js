const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'email' },
    // Email chack
        (username, password, done) => {
            User.findOne({ email: username.toLowerCase() },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        {
                            // The track login attempts 
                            User.findOneAndUpdate({email : username.toLowerCase()}, {$inc:{loginAttempts:1}}, {new:true}).then(a => {console.log(a); 
                                if(a?.loginAttempts > 3){
                                    return done(null, false, { message: 'Pleas contact the admin by : Badeakhalboos@gmail.com.' });
                                }
                                // If there a wrong password 
                                else{return done(null, false, { message: 'Wrong password.' });}
                            })
                    }
                    // authentication succeeded
                    else {
                        // If user has more than 3 login attempts
                        if (user?.loginAttempts > 3) {
                            return done(null, false, { message: 'Pleas contact the admin by : Badeakhalboos@gmail.com.' });
                        }
                        return done(null, user);
                    }
                        
                    
                });
        })
);