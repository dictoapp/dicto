import React from 'react';

import './ReverseDropdown.scss';

const ReverseDropdown = ( {
  style,
  isActive,
  onClose,
  children
} ) => {
  return (
    <div
      style={ style }
      className={ `dicto-ReverseDropdown ${isActive ? 'is-active' : ''}` }
    >
      <div className={ 'anchor' }>
        {
                isActive && 
                <div
                  onClick={ onClose }
                  className={ 'cache' }
                />
              }
        <div className={ 'dropdown-content' }>
          {children}
        </div>
      </div>

    </div>
  );
};

export default ReverseDropdown;
