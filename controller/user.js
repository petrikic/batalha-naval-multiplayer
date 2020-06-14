const user = require('../models/userModel')

module.exports = {
    login(req, res) {
        let usr = req.body;
        if(req.session.user){
            res.redirect('/');
        } else if(!user.findOne(usr.username)){
            res.status(401).send({error: 'User not found'});
        } else if(user.find(usr)){
            req.session.user = usr.username
            res.status(200).send("OK");
        } else {
            res.status(403).send({error: 'Not authorized'});
        }
    },
    create (req, res){
        let usr = {
            username: req.body.username,
            password: req.body.password
        }
        if(usr.username.length < 4){
            res.status(400).send({error: "Username is too small"});
        } else if(usr.password.length < 4) {
            res.status(400).send({error: "Password is too small"})
        } else if(user.findOne(usr.username)){
            res.status(400).send({error: "Username already exists"});
        } else {
            user.insert(usr);
            req.session.user = usr.username
            res.status(200).send("OK");
        }
    },
    verifyUsername(req, res){
        usr = req.body;
        if(user.findOne(usr.username)){
            res.status(400).send({error: "Username already exists"});
        }
    }
}
