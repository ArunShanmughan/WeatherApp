import React from 'react';

function Forecast({ title, items }) { // Correct prop name to 'items'
  return (
    <div>
      <div className='flex items-center justify-start mt-6'>
        <p className='font-medium uppercase'>{title}</p>
      </div>
      <hr className='my-1' />
      <div className='flex items-center justify-between'>
        {items && items.length > 0 ? ( // Ensure 'items' is used and exists
          items.map((d, index) => (
            <div key={index} className='flex flex-col items-center justify-center'>
              <p className='font-light text-sm'>{d.title}</p>
              <img src={d.icon} alt="Weather icon" className='w-12 my-1' />
              <p className='font-medium'>{`${d.temp.toFixed()}°`}</p>
            </div>
          ))
        ) : (
          <p>No forecast data available.</p>
        )}
      </div>
    </div>
  );
}

export default Forecast;
