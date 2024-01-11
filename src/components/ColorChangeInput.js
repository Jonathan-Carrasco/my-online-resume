import { useState } from 'react';
import './styles/ColorChangeInput.css';

function ColorChangeInput () {
  const [bgColor, setBgColor] = useState('white');

  const handleColorChange = (color) => {
    setBgColor(color);
  };

  return (
    <div>
      <input 
        type="text" 
        style={{ backgroundColor: bgColor, transition: 'background-color 0.5s' }} 
      />
      <div>
        <button onClick={() => handleColorChange('grey')}>Grey</button>
        <button onClick={() => handleColorChange('green')}>Green</button>
        <button onClick={() => handleColorChange('yellow')}>Yellow</button>
      </div>
    </div>
  );
};

export default ColorChangeInput;