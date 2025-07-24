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
        $password: 'Password_123456',
      }
    }
  */
  loginController.loginUser
);

router.delete(
  "/",
  /*
    #swagger.tags = ['Management System']
    #swagger.description = 'Delete user account using email and password'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $email: 'email@example.com',
        $password: 'Password_123456',
      }
    }
  */
  loginController.deleteUser
)

module.exports = router;
