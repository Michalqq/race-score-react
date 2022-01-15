import React from 'react';

export const LoadingTable = () => {
  return (
    <>
      <div
        id='table-loader'
        className='flex justify-content-center align-items-center flex-col-reverse u-padding-top-xxl u-padding-xxl'
      >
        <div className='loader-text'>Pobieranie danych ...</div>
        <div className='loader-container'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};
