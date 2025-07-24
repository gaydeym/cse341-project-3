const router = require('express').Router();
const categoriesController = require('../controllers/categories');
const verifyToken = require('../middlewares/auth');

router.get(
  '/',
  /*
    #swagger.tags = ['Categories']
  */
  verifyToken,
  categoriesController.fetchCategories
);

router.get(
  '/:id',
  /*
    #swagger.tags = ['Categories']
  */
  verifyToken,
  categoriesController.validateId,
  categoriesController.fetchCategoryById
);

router.post(
  '/',
  /*
    #swagger.tags = ['Categories']
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $name: 'Desserts',
        $description: 'Sweet treats and dessert recipes'
      }
    }
  */
  verifyToken,
  categoriesController.addCategory
);

router.put(
  '/:id',
  /*
    #swagger.tags = ['Categories']
  */
  verifyToken,
  categoriesController.validateId,
  categoriesController.updateCategory
);

router.delete(
  '/:id',
  /*
    #swagger.tags = ['Categories']
  */
  verifyToken,
  categoriesController.validateId,
  categoriesController.deleteCategory
);

module.exports = router;
