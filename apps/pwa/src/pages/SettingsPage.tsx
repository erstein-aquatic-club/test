import { useState } from 'react';

const SettingsPage = () => {
  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [dietaryTags, setDietaryTags] = useState('');
  const [allergies, setAllergies] = useState('');

  return (
    <section className="card">
      <h2>Réglages</h2>
      <form className="grid">
        <label>
          Repas par jour
          <select value={mealsPerDay} onChange={(event) => setMealsPerDay(Number(event.target.value))}>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </label>
        <label>
          Tags alimentaires
          <input value={dietaryTags} onChange={(event) => setDietaryTags(event.target.value)} placeholder="veggie, low-carb" />
        </label>
        <label>
          Allergies
          <input value={allergies} onChange={(event) => setAllergies(event.target.value)} placeholder="gluten, lactose" />
        </label>
        <button type="button">Enregistrer</button>
      </form>
    </section>
  );
};

export default SettingsPage;
