function generatePlan(householdId, payload) {
  const settings = getSettings_(householdId);
  const mealsPerDay = payload.mealsPerDay || settings.mealsPerDay || 2;
  const weekStart = payload.weekStart || new Date().toISOString().slice(0, 10);
  const inventory = listInventory(householdId);
  const recipes = listRecipes(householdId);

  const aiResponse = callOpenAI_(householdId, {
    weekStart: weekStart,
    mealsPerDay: mealsPerDay,
    inventory: inventory,
    recipes: recipes,
    preferences: settings,
  });

  const planId = Utilities.getUuid();
  storePlan_(planId, householdId, weekStart, aiResponse.plan);
  storeShopping_(planId, aiResponse.shoppingList);

  return {
    planId: planId,
    weekStart: weekStart,
    mealsPerDay: mealsPerDay,
    plan: aiResponse.plan,
    shoppingList: aiResponse.shoppingList,
    rationale: aiResponse.rationale,
  };
}

function callOpenAI_(householdId, context) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY manquante');
  }

  const prompt = [
    'Tu es un assistant qui génère un menu hebdo JSON strict.',
    'Priorise les ingrédients proches de péremption.',
    'Si une recette manque, propose un draft sans l\'enregistrer.',
    'Réponds uniquement avec du JSON valide.',
    JSON.stringify(context),
  ].join('\n');

  const response = UrlFetchApp.fetch('https://api.openai.com/v1/responses', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + apiKey,
    },
    payload: JSON.stringify({
      model: 'gpt-4o-mini',
      input: prompt,
    }),
    muteHttpExceptions: true,
  });

  const payload = JSON.parse(response.getContentText());
  const outputText = extractResponseText_(payload);
  return JSON.parse(outputText);
}

function extractResponseText_(payload) {
  if (!payload.output || !payload.output.length) {
    throw new Error('Réponse OpenAI vide');
  }
  const message = payload.output[0];
  if (!message.content || !message.content.length) {
    throw new Error('Réponse OpenAI sans contenu');
  }
  return message.content[0].text;
}

function getSettings_(householdId) {
  const sheet = getSheet_(SHEETS.SETTINGS);
  const rows = readRows_(sheet);
  const settings = rows.find((row) => row.householdId === householdId) || {};
  return {
    mealsPerDay: settings.mealsPerDay ? Number(settings.mealsPerDay) : 2,
    dietaryTags: settings.dietaryTags || '',
    allergies: settings.allergies || '',
    budgetLevel: settings.budgetLevel || '',
  };
}

function storePlan_(planId, householdId, weekStart, plan) {
  const sheet = getSheet_(SHEETS.WEEK_PLAN);
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    plan.forEach((dayPlan) => {
      dayPlan.slots.forEach((slot) => {
        sheet.appendRow([
          planId,
          householdId,
          weekStart,
          dayPlan.day,
          slot.slot,
          slot.recipeId || slot.recipeTitle || 'draft',
        ]);
      });
    });
  } finally {
    lock.releaseLock();
  }
}

function storeShopping_(planId, shoppingList) {
  const sheet = getSheet_(SHEETS.SHOPPING);
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    shoppingList.forEach((item) => {
      sheet.appendRow([
        planId,
        item.ingredient,
        item.qty || '',
        item.unit || '',
        item.aisle || '',
        item.checked ? 'true' : 'false',
      ]);
    });
  } finally {
    lock.releaseLock();
  }
}
