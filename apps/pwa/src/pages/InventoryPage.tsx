import { useMemo, useState } from 'react';

type InventoryItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  location: string;
  expiryDate: string;
};

const initialItems: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Yaourt nature',
    qty: 4,
    unit: 'pcs',
    location: 'Frigo',
    expiryDate: '2024-07-08',
  },
  {
    id: 'item-2',
    name: 'Pâtes complètes',
    qty: 1,
    unit: 'kg',
    location: 'Placard',
    expiryDate: '2024-09-01',
  },
];

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [form, setForm] = useState<InventoryItem>({
    id: 'new',
    name: '',
    qty: 1,
    unit: 'pcs',
    location: 'Frigo',
    expiryDate: '',
  });

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));
  }, [items]);

  const onChange = (field: keyof InventoryItem, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextItem = { ...form, id: `item-${Date.now()}` };
    setItems((prev) => [nextItem, ...prev]);
    setForm({ id: 'new', name: '', qty: 1, unit: 'pcs', location: 'Frigo', expiryDate: '' });
  };

  return (
    <section className="grid two">
      <div className="card">
        <h2>Inventaire</h2>
        <div className="list">
          {sortedItems.map((item) => (
            <div className="list-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <div>
                  {item.qty} {item.unit} • {item.location}
                </div>
              </div>
              <span className="badge">{item.expiryDate}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Ajouter / éditer</h2>
        <form className="grid" onSubmit={onSubmit}>
          <label>
            Nom
            <input value={form.name} onChange={(event) => onChange('name', event.target.value)} required />
          </label>
          <label>
            Quantité
            <input
              value={form.qty}
              onChange={(event) => onChange('qty', Number(event.target.value))}
              type="number"
              min={0}
              step={0.1}
              required
            />
          </label>
          <label>
            Unité
            <input value={form.unit} onChange={(event) => onChange('unit', event.target.value)} />
          </label>
          <label>
            Emplacement
            <select value={form.location} onChange={(event) => onChange('location', event.target.value)}>
              <option>Frigo</option>
              <option>Congélateur</option>
              <option>Placard</option>
            </select>
          </label>
          <label>
            Date de péremption
            <input
              value={form.expiryDate}
              onChange={(event) => onChange('expiryDate', event.target.value)}
              type="date"
              required
            />
          </label>
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </section>
  );
};

export default InventoryPage;
