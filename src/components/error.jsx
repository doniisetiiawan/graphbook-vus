import React from 'react';

export default function Error(props) {
  const { children } = props;

  return (
    <div className="error message">
      {children}
    </div>
  );
}
