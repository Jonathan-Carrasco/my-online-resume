function WordleCell({ text, color, onTextChange, onClick})
{
  return (
        <input 
          type="text"
          maxLength="1"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onClick={(e) => onClick(e.target.value)}
          style={{ backgroundColor: color }}
        />
  );
};

export default WordleCell;