import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const CustomInput = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddClick = () => {
    if (inputValue.trim() !== '') {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  return (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Enter text..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button variant="primary" onClick={handleAddClick}>
        <FontAwesomeIcon icon={faPlus} /> Add
      </Button>
    </InputGroup>
  );
};

export default CustomInput;
