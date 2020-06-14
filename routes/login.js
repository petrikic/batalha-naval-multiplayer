express = require('express');
router = express.Router();
const user = require('../controller/user');

router.get('/', (req, res) => {
    if(req.session.user){
        return res.redirect('/');
    }
    return res.render('login.ejs');
});

router.post('/', user.login);

module.exports = router;
