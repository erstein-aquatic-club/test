const PlanPage = () => {
  return (
    <section className="card">
      <h2>Planning hebdo</h2>
      <p>Génère les menus à partir des ingrédients proches de péremption.</p>
      <div className="list">
        <div className="list-item">
          <div>
            <strong>Lundi</strong>
            <div>Déjeuner: Salade protéinée</div>
            <div>Dîner: Poêlée de légumes</div>
          </div>
        </div>
        <div className="list-item">
          <div>
            <strong>Mardi</strong>
            <div>Déjeuner: Soupe de saison</div>
            <div>Dîner: Wraps maison</div>
          </div>
        </div>
      </div>
      <button type="button">Générer la semaine</button>
    </section>
  );
};

export default PlanPage;
