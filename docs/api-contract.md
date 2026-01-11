# API Contract (Apps Script Web App)

Base: `POST ${BACKEND_URL}` with JSON body:
```json
{
  "action": "inventory.list",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {}
}
```

The backend responds:
```json
{ "ok": true, "data": {} }
```

## Actions

### auth.ping
```json
{
  "action": "auth.ping",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {}
}
```

### inventory.list
```json
{
  "action": "inventory.list",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {}
}
```

### inventory.upsert
```json
{
  "action": "inventory.upsert",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {
    "itemId": "item_123",
    "name": "Yaourt",
    "qty": 2,
    "unit": "pcs",
    "location": "Frigo",
    "expiryDate": "2024-07-08"
  }
}
```

### inventory.delete
```json
{
  "action": "inventory.delete",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {
    "itemId": "item_123"
  }
}
```

### recipes.list
```json
{
  "action": "recipes.list",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {}
}
```

### recipes.upsert
```json
{
  "action": "recipes.upsert",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {
    "title": "Poêlée de légumes",
    "servings": 2,
    "tags": "veggie",
    "instructions": "Cuire 10 minutes."
  }
}
```

### plan.generate
```json
{
  "action": "plan.generate",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {
    "weekStart": "2024-07-08",
    "mealsPerDay": 2
  }
}
```

Note: the backend returns recipe drafts without saving them in `Recipes` when the base is missing entries.
The generated weekly plan and shopping list are persisted in `WeekPlan` and `ShoppingList`.

Expected AI response shape:
```json
{
  "weekStart": "2024-07-08",
  "mealsPerDay": 2,
  "plan": [
    {
      "day": "Lundi",
      "slots": [
        { "slot": "Déjeuner", "recipeId": "recipe_1", "recipeTitle": "Salade" }
      ]
    }
  ],
  "shoppingList": [
    { "ingredient": "Tomates", "qty": 4, "unit": "pcs", "aisle": "Fruits & légumes", "checked": false }
  ],
  "rationale": ["Priorité aux yaourts qui expirent bientôt."]
}
```

### shopping.toggleChecked
```json
{
  "action": "shopping.toggleChecked",
  "userId": "user_123",
  "token": "plaintext-token",
  "payload": {
    "planId": "plan_123",
    "ingredient": "Tomates",
    "checked": true
  }
}
```
