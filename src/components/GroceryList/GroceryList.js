import React, { useState, useEffect } from 'react';
import { supabase, HOUSEHOLD_ID } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './GroceryList.css';

export default function GroceryList() {
  const { userProfile } = useAuth();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('other');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();

    // Realtime subscription
    const channel = supabase
      .channel('grocery-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grocery_items',
          filter: `household_id=eq.${HOUSEHOLD_ID}`,
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('grocery_items')
      .select(`
        *,
        added_by_user:added_by(display_name),
        checked_by_user:checked_by(display_name)
      `)
      .eq('household_id', HOUSEHOLD_ID)
      .order('is_checked', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching grocery items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  async function handleAddItem(e) {
    e.preventDefault();
    if (!newItem.trim()) return;

    const { error } = await supabase.from('grocery_items').insert({
      household_id: HOUSEHOLD_ID,
      item_name: newItem.trim(),
      category,
      added_by: userProfile.id,
    });

    if (error) {
      console.error('Error adding item:', error);
    } else {
      setNewItem('');
      setCategory('other');
    }
  }

  async function handleToggleCheck(item) {
    const isChecked = !item.is_checked;

    const { error } = await supabase
      .from('grocery_items')
      .update({
        is_checked: isChecked,
        checked_at: isChecked ? new Date().toISOString() : null,
        checked_by: isChecked ? userProfile.id : null,
      })
      .eq('id', item.id);

    if (error) {
      console.error('Error updating item:', error);
    }
  }

  async function handleDeleteItem(itemId) {
    const { error } = await supabase
      .from('grocery_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
    }
  }

  async function handleClearChecked() {
    if (!window.confirm('Remove all checked items?')) return;

    const checkedIds = items.filter((i) => i.is_checked).map((i) => i.id);

    const { error } = await supabase
      .from('grocery_items')
      .delete()
      .in('id', checkedIds);

    if (error) {
      console.error('Error clearing checked items:', error);
    }
  }

  const uncheckedItems = items.filter((i) => !i.is_checked);
  const checkedItems = items.filter((i) => i.is_checked);

  const categoryEmoji = {
    produce: '🥬',
    dairy: '🥛',
    pantry: '🥫',
    meat: '🍖',
    frozen: '🧊',
    other: '🛒',
  };

  if (loading) {
    return <div className="loading">Loading grocery list...</div>;
  }

  return (
    <div className="grocery-list">
      <div className="section-header">
        <h2>Grocery List</h2>
        {checkedItems.length > 0 && (
          <button onClick={handleClearChecked} className="btn-secondary btn-small">
            Clear Checked ({checkedItems.length})
          </button>
        )}
      </div>

      <p className="section-description text-secondary">
        Quick add. Quick check. No tracking, no guilt.
      </p>

      <form onSubmit={handleAddItem} className="grocery-add-form">
        <div className="add-form-row">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add item..."
            className="grocery-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="produce">🥬 Produce</option>
            <option value="dairy">🥛 Dairy</option>
            <option value="pantry">🥫 Pantry</option>
            <option value="meat">🍖 Meat</option>
            <option value="frozen">🧊 Frozen</option>
            <option value="other">🛒 Other</option>
          </select>
          <button type="submit" className="btn-primary">
            Add
          </button>
        </div>
      </form>

      <div className="grocery-items">
        {uncheckedItems.length === 0 && checkedItems.length === 0 && (
          <p className="empty-state">
            Your list is empty. Add items as you think of them!
          </p>
        )}

        {uncheckedItems.map((item) => (
          <div key={item.id} className="grocery-item">
            <input
              type="checkbox"
              checked={false}
              onChange={() => handleToggleCheck(item)}
              className="grocery-checkbox"
            />
            <div className="grocery-content">
              <div className="grocery-name">
                <span className="category-emoji">{categoryEmoji[item.category]}</span>
                <span>{item.item_name}</span>
              </div>
            </div>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="grocery-delete"
              aria-label="Delete item"
            >
              ×
            </button>
          </div>
        ))}

        {checkedItems.length > 0 && (
          <div className="checked-section">
            <h3 className="text-secondary text-small">In cart</h3>
            {checkedItems.map((item) => (
              <div key={item.id} className="grocery-item checked">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => handleToggleCheck(item)}
                  className="grocery-checkbox"
                />
                <div className="grocery-content">
                  <div className="grocery-name">
                    <span className="category-emoji">{categoryEmoji[item.category]}</span>
                    <span>{item.item_name}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="grocery-delete"
                  aria-label="Delete item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
