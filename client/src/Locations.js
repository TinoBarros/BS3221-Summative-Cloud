import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';




const Locations = () => {
  const [locationNames, setLocationNames] = useState([])
  


  useEffect(() => {
    axios
      .get("https://fire-warden-exbrf4d4gxe0cgc3.ukwest-01.azurewebsites.net/locations")
      .then((response) => {
  
        const options = response.data.map((item) => ({
          value: item.Name,
          label: item.Name,
          fireWardensNeeded: item.fireWardensNeeded,
          clockingCount: item.clockingCount || 0,
        }));
  
        const uniqueOptions = Array.from(new Map(options.map(item => [item.value, item])).values());
  
  
        setLocationNames(uniqueOptions);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

    return(
      <>
      <div>
        <h3 className='px-10 mb-2 pb-2 text-5xl text-center text-black'>Locations</h3>
        <div className='pb-5 text-black text-center'>View all available locations and see the number of wardens assigned to each one for today.</div>
      </div>
      <div className="py-5 flex flex-wrap gap-4 ">
        {locationNames.map((location, id) => (
          <div key={id}
           className="py-3 px-4 bg-gray-200 rounded-lg text-center border border-black flex-1 min-w-[22%] sm:min-w-[30%] md:min-w-[22%] lg:min-w-[22%] flex justify-between items-center">
            <span>{location.label} | {location.clockingCount}</span>
            <span className={` w-3 h-3 rounded-full ${
              location.clockingCount === 0 ? 'bg-red-500' : 'bg-green-500'
            }`}>
            </span>
             </div>
        ))}
      </div>
    </>
    );
  };

  export default Locations;