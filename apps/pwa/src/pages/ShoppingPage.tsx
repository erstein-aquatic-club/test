import { useState } from 'react';
import { apiPost } from '../services/api';

type ShoppingItem = {
  id: string;
  label: string;
  checked: boolean;
  planId: string;
  ingredient: string;
};

const initialItems: ShoppingItem[] = [
  { id: 'shop-1', label: 'Tomates (4)', ingredient: 'Tomates', planId: 'plan-demo', checked: false },
  { id: 'shop-2', label: 'Lentilles (500g)', ingredient: 'Lentilles', planId: 'plan-demo', checked: true },
  { id: 'shop-3', label: 'Feta (200g)', ingredient: 'Feta', planId: 'plan-demo', checked: false },
];

const ShoppingPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);

  const toggleItem = async (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
    const item = items.find((entry) => entry.id === id);
    if (item) {
      await apiPost('shopping.toggleChecked', {
        planId: item.planId,
        ingredient: item.ingredient,
        checked: !item.checked,
      });
    }
  };

  return (
    <section className="card">
      <h2>Liste de courses</h2>
      <div className="list">
        {items.map((item) => (
          <label className="list-item checkbox" key={item.id}>
            <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default ShoppingPage;
