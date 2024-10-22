import React, { useState, useEffect, useRef } from 'react';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const options = [
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grapes',
    'Honeydew',
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    setSearchTerm(search);
    setFilteredOptions(
      options.filter((option) => option.toLowerCase().includes(search))
    );
  };

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{ position: 'relative', width: '200px' }}
      ref={dropdownRef}
      className='z-50'
    >
      <div
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={handleToggleDropdown}
      >
        {selectedValue || 'Select an option'}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff',
            zIndex: 10,
          }}
        >
          <input
            type='text'
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder='Search...'
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: 'none',
              borderBottom: '1px solid #ccc',
            }}
          />
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              maxHeight: '150px',
              overflowY: 'auto',
            }}
            className='z-50'
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #ccc',
                  }}
                  className='z-50'
                >
                  {option}
                </li>
              ))
            ) : (
              <li style={{ padding: '8px' }}>No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
