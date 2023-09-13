import React, { useEffect, useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import '../style/List.css';

function List({ items,onUpdateItem ,onDeleteItem}) {
  // const [items, setItems]=useState({items});
  const [checkedItems, setCheckedItems] = useState({});
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [editableItem, setEditableItem] = useState(null);

  // Use useEffect to monitor changes in checkedItems
  useEffect(() => {
    // Check if at least one item is checked
    const isAtLeastOneChecked = Object.values(checkedItems).some(
      (value) => value === true
    );
    setShowCompleteButton(isAtLeastOneChecked);
  }, [items]);

  const toggleItemSelection = (itemId) => {
    const updatedCheckedItems = { ...checkedItems };
    updatedCheckedItems[itemId] = !updatedCheckedItems[itemId];
    setCheckedItems(updatedCheckedItems);

    // Check if at least one item is checked
    const isAtLeastOneChecked = Object.values(updatedCheckedItems).some(
      (value) => value === true
    );
    setShowCompleteButton(isAtLeastOneChecked);
  };

  const handleEditClick = (itemId) => {
    setEditableItem(itemId);

  };
  const handleCancelEdit = () => {
    setEditableItem(null);
  };
  const markSelectedItemsAsComplete = () => {
    const updatedItems = items.map((item) => ({
      ...item,
      completed: checkedItems[item.id] ? true : item.completed,
    }));
    setCheckedItems({}); // Clear the checked items
    setShowCompleteButton(false);
    // Update the state with the modified items
    // setItems(updatedItems);
  };
  const handleSaveClick = (itemId, newTitle) => {
    // Update the title of the item in the state
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, title: newTitle };
      }
      return item;
    });
  
    // Clear the editable item state
    setEditableItem(null);
  
    
    // Simulate a PUT request to update the item title
    fetch(`https://jsonplaceholder.typicode.com/todos/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the parent component with the modified items
        onUpdateItem(updatedItems.find((item) => item.id === itemId));
      })
      .catch((error) => {
        console.error(`Error updating item with ID ${itemId}: ${error}`);
      });
  };
  
  const handleDeleteClick = (itemId) => {
    // Filter out the item to be deleted from the state
    const updatedItems = items.filter((item) => item.id !== itemId);
  
    // Clear the editable item state
    setEditableItem(null);
  
    // Update the parent component with the modified items
    onUpdateItem(updatedItems);
  
    // Simulate a DELETE request to delete the item
    fetch(`https://jsonplaceholder.typicode.com/todos/${itemId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Update the parent component with the modified items
          onUpdateItem(updatedItems);

          // Call the onDeleteItem callback (if provided)
          if (onDeleteItem) {
            onDeleteItem(itemId);
          }
        } else {
          console.error(`Error deleting item with ID ${itemId}`);
        }
      })
      .catch((error) => {
        console.error(`Error deleting item with ID ${itemId}: ${error}`);
      });
  };
  
  let totalCount=items.length;

  return (
    <div>
      <ListGroup>
        {items.map((item) => (
          <ListGroup.Item
            key={item.id}
            className={`${checkedItems[item.id] ? 'checked' : ''} ${
              item.completed ? 'completed' : ''
            } ${editableItem === item.id ? 'editable' : ''}`}
          >
            <div className='innerdiv'>
              <div className="checkbox ">
                <FormCheckInput
                  checked={checkedItems[item.id] || false}
                  onChange={() => toggleItemSelection(item.id)}
                />
              </div>
              <div className={`list-title ${editableItem === item.id ? 'edit-mode' : ''}`} >
                {editableItem === item.id ? (
                  <>
                    <input type="text" defaultValue={item.title} />
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSaveClick(item.id, document.querySelector('.list-title input').value)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <span className={`${checkedItems[item.id] ? 'checked' : ''} ${
                    item.completed ? 'completed line-through' : ''}`}>{item.title}</span>
                )}
              </div>
              <div className='buttons'>
                {editableItem !== item.id && (
                  <Button variant="link" className="mr-2" onClick={() => handleEditClick(item.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                )}
                <Button variant="link" className="mr-2" onClick={() => handleDeleteClick(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className='d-flex bottom-buttons'>
        <p className='btn btn-secondary mt-1'>{`Total Task: ${totalCount}`}</p>
        {showCompleteButton && (
          <Button
            variant="primary"
            onClick={markSelectedItemsAsComplete}
            className="mt-3"
          >
            Mark Complete
          </Button>
        )}
      </div>
      
    </div>
  );
}

export default List;
