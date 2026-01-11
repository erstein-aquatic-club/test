const SHEETS = {
  HOUSEHOLDS: 'Households',
  USERS: 'Users',
  SETTINGS: 'Settings',
  INVENTORY: 'Inventory',
  RECIPES: 'Recipes',
  RECIPE_INGREDIENTS: 'RecipeIngredients',
  WEEK_PLAN: 'WeekPlan',
  SHOPPING: 'ShoppingList',
};

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents || '{}');
    const action = request.action;
    const userId = request.userId;
    const token = request.token;
    const payload = request.payload || {};

    if (!action) {
      return jsonResponse({ ok: false, error: 'Action manquante' });
    }

    if (action === 'auth.ping') {
      const auth = authenticate(userId, token);
      return jsonResponse({ ok: !!auth, data: auth || null, error: auth ? undefined : 'Auth invalide' });
    }

    const authContext = authenticate(userId, token);
    if (!authContext) {
      return jsonResponse({ ok: false, error: 'Auth invalide' });
    }

    switch (action) {
      case 'inventory.list':
        return jsonResponse({
          ok: true,
          data: listInventory(authContext.householdId),
        });
      case 'inventory.upsert':
        return jsonResponse({
          ok: true,
          data: upsertInventory(authContext.householdId, payload),
        });
      case 'inventory.delete':
        return jsonResponse({
          ok: true,
          data: deleteInventory(authContext.householdId, payload.itemId),
        });
      case 'recipes.list':
        return jsonResponse({
          ok: true,
          data: listRecipes(authContext.householdId),
        });
      case 'recipes.upsert':
        return jsonResponse({
          ok: true,
          data: upsertRecipe(authContext.householdId, payload),
        });
      case 'plan.generate':
        return jsonResponse({
          ok: true,
          data: generatePlan(authContext.householdId, payload),
        });
      case 'shopping.toggleChecked':
        return jsonResponse({
          ok: true,
          data: toggleShoppingChecked(authContext.householdId, payload),
        });
      default:
        return jsonResponse({ ok: false, error: 'Action inconnue' });
    }
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}
