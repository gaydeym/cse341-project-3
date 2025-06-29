const router = require('express').Router();
const recipesController = require('../controllers/recipes');

router.get(
  '/',
  /* 
    #swagger.tags = ['Recipes']
  */
  recipesController.fetchRecipes
);

router.get(
  '/:id',
  /* 
    #swagger.tags = ['Recipes']
  */
  recipesController.validateId,
  recipesController.fetchRecipeById
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Recipes']
    #swagger.description = 'Add a new recipe'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Recipe object',
      required: true,
      schema: {
        $imgUrl: 'https://i.blogs.es/887e09/1366_2000-7/1366_2000.jpg',
        $name: 'Dulce de Leche Ice Cream',
        rating: '4.92 from 58 votes',
        description: 'A rich and creamy Argentine-style ice cream made by gently heating dulce de leche with milk, folding into whipped cream, and freezing until perfectly set.',
        author: {
          name: 'Inés Vazquez Noya',
          url: 'https://www.directoalpaladar.com/autor/ines-vazquez-noya'
        },
        cookTime: '15 minutes',
        ingredients: [
          '400 g dulce de leche',
          '350 ml whole milk',
          '200 ml heavy cream'
        ],
        instructions: [
          'In a saucepan over low heat, combine the dulce de leche and milk. Stir until fully integrated and the mixture is smooth.',
          'Remove from heat and let cool to room temperature, then transfer to the refrigerator until completely chilled.',
          'Meanwhile, chill your mixing bowl and beaters in the freezer for about 15 minutes so the cream whips up better.',
          'Pour the heavy cream into the chilled bowl and whip with an electric mixer until soft peaks form.',
          'Gently fold the cooled dulce de leche mixture into the whipped cream until homogeneous, taking care not to deflate the cream.',
          'Transfer the blend into a freezer-safe container, cover, and freeze for at least 5-6 hours (or overnight) before serving.'
        ],
        equipment: [
          'Saucepan',
          'Mixing bowl',
          'Electric mixer',
          'Freezer-safe container'
        ],
        nutrition: {
          protein: '5g',
          fiber: '0g',
          calories: '560kcal',
          fat: '32g',
          carbohydrates: '65g',
          sodium: '120mg'
        }
      }
    }
  */
  recipesController.addRecipe
);

router.put(
  '/:id',
  /* 
    #swagger.tags = ['Recipes']
  */
  recipesController.validateId,
  recipesController.updateRecipe
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Recipes']
  */
  recipesController.validateId,
  recipesController.deleteRecipe
);

module.exports = router;
