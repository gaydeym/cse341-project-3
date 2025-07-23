const router = require('express').Router();
const authorsController = require('../controllers/authors');
const verifyToken = require('../middlewares/auth');

router.get(
  '/',
  /* 
    #swagger.tags = ['Authors']
  */
  verifyToken,
  authorsController.fetchAuthors
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Authors']
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $name: '',
        companyName: '',
        description: '',
        photo: ''
      }
    }
  */
  verifyToken,
  authorsController.addAuthor
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Authors']
  */
  verifyToken,
  authorsController.validateId,
  authorsController.deleteAuthor
);

module.exports = router;
