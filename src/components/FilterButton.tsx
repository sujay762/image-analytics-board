
import React from 'react';

interface FilterButtonProps {
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="text-blue-500 font-medium ml-auto"
    >
      Expand Filter
    </button>
  );
};

export default FilterButton;
