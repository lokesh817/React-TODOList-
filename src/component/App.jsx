// App.js
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/App.css';
import CustomInput from './input';
import List from './List';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
      userId: 1, // Dummy user ID
      id: items.length + 1, // Generate a unique ID (assuming IDs are sequential)
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
        setItems([...items, data]);
      })
      .catch((error) => {
        console.error('Error adding todo item:', error);
      });
  };

  const handleUpdateItem = (updatedItem) => {
    // Update the state with the modified item
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
  };
  const handleDeleteItem = (itemId) => {
    // Implement the logic to delete the item from your data source or state
    // For example, if you are using state, you can filter out the item to delete
    const updatedItems = items.filter((item) => item.id !== itemId);
  
    // Update the state with the modified items
    setItems(updatedItems);
  };
  

  return (
    <div className='App-Outer '>
      <div className='App '>
        <h1 className='App-Title'>TODO App</h1>
        <CustomInput onAdd={handleAddItem} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <List items={items} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
