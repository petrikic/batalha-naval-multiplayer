express = require('express');
router = express.Router();
const user = require('../controller/user');

router.get('/', (req, res) => {
    res.render('register.ejs');
});

router.post('/', user.create);

router.post('/username', user.verifyUsername)

module.exports = router;
