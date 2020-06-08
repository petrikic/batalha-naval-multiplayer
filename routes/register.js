express = require('express');
router = express.Router();
const user = require('../controller/user');

router.get('/', (req, res) => {
    res.render('register.ejs');
});

router.post('/', (req, res) => {
    usr = {
        username: req.body.username,
        password: req.body.password
    }
    if(usr.username.length < 4){
        res.status(400).send({error: "Username is very small"});
    } else if(usr.password.length < 4) {
        res.status(400).send({error: "Password is very small"}) 
    } else if(user.findOne(usr.username)){
        res.status(400).send({error: "Username already exists"});
    } else {
        user.insert(usr);
        req.session.user = usr.username
        console.log(usr)
        res.status(200).send("OK");
    }
});

router.post('/username', (req, res) => {
    usr = req.body;
    if(user.findOne(usr.username)){
        res.status(400).send({error: "Username already exists"});
    }
})

module.exports = router;