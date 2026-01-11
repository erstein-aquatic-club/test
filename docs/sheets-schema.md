# Google Sheets Schema

Create a Google Sheet with the following tabs and exact columns (row 1 headers).

## Households
`householdId,name,createdAt`

## Users
`userId,householdId,displayName,tokenHash,createdAt,lastSeenAt`

## Settings
`householdId,mealsPerDay,dietaryTags,allergies,budgetLevel,updatedAt`

## Inventory
`itemId,householdId,name,barcode,qty,unit,location,expiryDate,updatedAt`

## Recipes
`recipeId,householdId,title,servings,tags,instructions`

## RecipeIngredients
`recipeId,ingredient,qty,unit,category,optional`

## WeekPlan
`planId,householdId,weekStart,day,slot,recipeId`

## ShoppingList
`planId,ingredient,qty,unit,aisle,checked`
