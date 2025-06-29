const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/recipes', require('./recipes'));
router.use('/authors', require('./authors'));
router.use('/signup', require('./signup'));
router.use('/login', require('./login'));

module.exports = router;
