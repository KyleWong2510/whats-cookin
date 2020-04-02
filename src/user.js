class User {
  constructor(name, id, pantry) {
    this.name = name;
    this.id = id;
    this.pantry = pantry; 
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }

  getRecipeIngredients(recipe) {
    return recipe.ingredients.map(({
      id,
      quantity
    }) => {
      let amount = quantity.amount
      return {
        id,
        amount
      }
    })
  }

  getRecipeIds(recipe) {
    return recipe.ingredients.map(ingredient => ingredient.id)
  }

  getPantryIds() {
    return this.pantry.map(pantryItem => pantryItem.ingredient)
  }

  compareIngredients(recipe) {
    let recipeIds = this.getRecipeIds(recipe);
    let pantryIds = this.getPantryIds();

    return pantryIds.reduce((acc, pantryItem) => {
      recipeIds.includes(pantryItem) ? acc.push(pantryItem) : null;
      return acc
    }, [])
  }

  getNeededIngredients(recipe) {
    let recipeIds = this.getRecipeIds(recipe)
    let ingredientsOnHand = this.compareIngredients(recipe);

    return recipeIds.reduce((acc, recId) => {
      !ingredientsOnHand.includes(recId) ? acc.push(recId) : null;
      return acc
    }, [])
  }

  compareIngredientsAmounts(recipe) {
    let recipeIngs = this.getRecipeIngredients(recipe);
    let pantryIngs = this.pantry;
    let neededIng = this.getNeededIngredients(recipe)
    recipeIngs.forEach(rIng => {
      return pantryIngs.find(pIng => {
        if (rIng.id === pIng.ingredient) {
          if (pIng.amount <= rIng.amount) {
            return neededIng.push(rIng.id)
          }
        }
      })
    })
    return neededIng
  }

  getShoppingList(recipe) {
    let neededIds = this.compareIngredientsAmounts(recipe);
    let shoppingList = [];
    neededIds.map(neededId => {
      return recipe.ingredients.forEach(ing => {
        if (neededId === ing.id) {
          let id = neededId
          let amount = ing.quantity.amount;
          let unit = ing.quantity.unit
          let quantity = {amount, unit}
          let ingredient = {id, quantity}
          shoppingList.push(ingredient)
        }
      })
    })
    return shoppingList
  }

  addFavoriteRecipe(recipe) {
    recipe.toggleFavorite();
    if (!this.favoriteRecipes.includes(recipe)) {
      this.favoriteRecipes.push(recipe)
    }
  }

  removeFavoriteRecipe(recipe) {
    if (this.favoriteRecipes.includes(recipe)) {
      let updatedFavorite = this.favoriteRecipes.filter((foods) => foods.id != recipe.id);
      this.favoriteRecipes = updatedFavorite;
    }
    recipe.toggleFavorite();
  }

  addRecipeToCook(recipe) {
    recipe.toggleCookNext();
    this.recipesToCook.push(recipe)
  }

  removeRecipeToCook(recipe) {
    recipe.toggleCookNext();
    let index = this.recipesToCook.indexOf(recipe)
    this.recipesToCook.splice(index, 1)
  }
}

if (typeof module !== 'undefined') {
  module.exports = User;
}
