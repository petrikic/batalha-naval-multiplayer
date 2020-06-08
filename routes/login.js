express = require('express');
router = express.Router();
const user = require('../controller/user');

router.get('/', (req, res) => {
    if(req.session.user){
        return res.redirect('/');
    }
    res.render('login.ejs');
});

router.post('/', (req, res) => {
    usr = req.body;
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
});

module.exports = router;