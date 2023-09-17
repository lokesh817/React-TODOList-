import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/App.css';
import CustomInput from './input';
import List from './List';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // Default filter is 'All'

  useEffect(() => {
    // Fetch todo items from the API
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching todo items:', error);
        setLoading(false);
      });
  }, []);

  const handleAddItem = (text) => {
    // Create a new todo item object
    const newItem = {
      userId: 1,
      id: uuidv4(),
      title: text,
      completed: false,
    };

    // Make a POST request to the API to add the new item
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the new item
        data.id = uuidv4();
        setItems([...items, data]);
      })
      .catch((error) => {
        console.error('Error adding todo item:', error);
      });
  };

  const handleUpdateItem = (updatedItem) => {
    // Create a new array with the updated items
    const updatedItems = items.map((item) => {
      // Check if the item ID matches any of the updatedItem IDs
      const foundUpdatedItem = updatedItem.find((upItem) => upItem.id === item.id);
      // If a matching updatedItem is found, return it; otherwise, return the original item
      return foundUpdatedItem ? foundUpdatedItem : item;
    });

    // Update the state with the modified items
    setItems(updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    // Filter out the item to be deleted from the state
    const updatedItems = items.filter((item) => item.id !== itemId);

    // Update the state with the modified items
    setItems(updatedItems);
  };

  const filterItems = () => {
    switch (filter) {
      case 'Completed':
        return items.filter((item) => item.completed);
      case 'Uncompleted':
        return items.filter((item) => !item.completed);
      default:
        return items;
    }
  };

  return (
    <div className='App-Outer '>
      <div className='App '>
        <h1 className='App-Title'>TODO App</h1>
        <CustomInput onAdd={handleAddItem} />
        <div className='d-flex justify-content-sm-around p-3 m-1 list-options'>
          <button
            className={`btn btn-sm btn-primary ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button
            className={`btn btn-sm btn-primary ${filter === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilter('Completed')}
          >
            Completed
          </button>
          <button
            className={`btn btn-sm btn-primary ${filter === 'Uncompleted' ? 'active' : ''}`}
            onClick={() => setFilter('Uncompleted')}
          >
            Uncompleted
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <List
              items={filterItems()} // Filtered items based on the selected filter
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
