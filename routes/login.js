const router = require('express').Router();
const loginController = require('../controllers/login');

router.post(
  '/',
  /* 
    #swagger.tags = ['Management System']
     #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $email: 'email@example.com',
        $name: 'Password_123456',
      }
    }
  */
  loginController.loginUser
);

module.exports = router;
