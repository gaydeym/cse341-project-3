const router = require('express').Router();
const authorsController = require('../controllers/authors');

router.get(
  '/',
  /* 
    #swagger.tags = ['Authors']
  */
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
  authorsController.addAuthor
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Authors']
  */
  authorsController.validateId,
  authorsController.deleteAuthor
);

module.exports = router;
