function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function authenticate(userId, token) {
  if (!userId || !token) return null;
  const sheet = getSheet_(SHEETS.USERS);
  const rows = readRows_(sheet);
  const user = rows.find((row) => row.userId === userId);
  if (!user) return null;
  const tokenHash = hashToken_(token);
  if (user.tokenHash !== tokenHash) return null;
  return {
    userId: user.userId,
    householdId: user.householdId,
    displayName: user.displayName,
  };
}

function hashToken_(token) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token);
  return Utilities.base64Encode(digest);
}

function getSheet_(name) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sheet) {
    throw new Error('Sheet manquante: ' + name);
  }
  return sheet;
}

function readRows_(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function upsertRowById_(sheet, idKey, data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIndex = headers.indexOf(idKey);
    if (idIndex === -1) throw new Error('Colonne manquante: ' + idKey);
    const rowIndex = values.findIndex((row, index) => index > 0 && row[idIndex] === data[idKey]);
    const rowValues = headers.map((header) => data[header] || '');
    if (rowIndex === -1) {
      sheet.appendRow(rowValues);
    } else {
      sheet.getRange(rowIndex + 1, 1, 1, rowValues.length).setValues([rowValues]);
    }
  } finally {
    lock.releaseLock();
  }
  return data;
}

function deleteRowById_(sheet, idKey, id) {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idIndex = headers.indexOf(idKey);
    const rowIndex = values.findIndex((row, index) => index > 0 && row[idIndex] === id);
    if (rowIndex !== -1) {
      sheet.deleteRow(rowIndex + 1);
      return true;
    }
    return false;
  } finally {
    lock.releaseLock();
  }
}

function listInventory(householdId) {
  const sheet = getSheet_(SHEETS.INVENTORY);
  return readRows_(sheet).filter((row) => row.householdId === householdId);
}

function upsertInventory(householdId, payload) {
  const sheet = getSheet_(SHEETS.INVENTORY);
  const now = new Date().toISOString();
  const item = {
    itemId: payload.itemId || Utilities.getUuid(),
    householdId: householdId,
    name: payload.name,
    barcode: payload.barcode || '',
    qty: payload.qty || 0,
    unit: payload.unit || '',
    location: payload.location || 'Frigo',
    expiryDate: payload.expiryDate || '',
    updatedAt: now,
  };
  return upsertRowById_(sheet, 'itemId', item);
}

function deleteInventory(householdId, itemId) {
  const sheet = getSheet_(SHEETS.INVENTORY);
  const existing = readRows_(sheet).find((row) => row.itemId === itemId && row.householdId === householdId);
  if (!existing) return false;
  return deleteRowById_(sheet, 'itemId', itemId);
}

function listRecipes(householdId) {
  const sheet = getSheet_(SHEETS.RECIPES);
  return readRows_(sheet).filter((row) => row.householdId === householdId);
}

function upsertRecipe(householdId, payload) {
  const sheet = getSheet_(SHEETS.RECIPES);
  const recipe = {
    recipeId: payload.recipeId || Utilities.getUuid(),
    householdId: householdId,
    title: payload.title,
    servings: payload.servings || 2,
    tags: payload.tags || '',
    instructions: payload.instructions || '',
  };
  return upsertRowById_(sheet, 'recipeId', recipe);
}

function toggleShoppingChecked(householdId, payload) {
  const sheet = getSheet_(SHEETS.SHOPPING);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const planIndex = headers.indexOf('planId');
  const ingredientIndex = headers.indexOf('ingredient');
  const checkedIndex = headers.indexOf('checked');
  if (planIndex === -1 || ingredientIndex === -1 || checkedIndex === -1) {
    throw new Error('Colonnes ShoppingList manquantes');
  }
  const rowIndex = values.findIndex(
    (row, index) =>
      index > 0 &&
      row[planIndex] === payload.planId &&
      row[ingredientIndex] === payload.ingredient
  );
  if (rowIndex === -1) return null;
  sheet.getRange(rowIndex + 1, checkedIndex + 1).setValue(payload.checked ? 'true' : 'false');
  return {
    planId: payload.planId,
    ingredient: payload.ingredient,
    checked: payload.checked ? 'true' : 'false',
  };
}
