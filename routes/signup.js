const router = require('express').Router();
const signupController = require('../controllers/signup');

router.post(
  '/',
  /* 
    #swagger.tags = ['Management System']
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $email: 'example@example.com',
        $name: 'Password_123456',
      }
    }
  */
  signupController.signupUser
);

module.exports = router;
