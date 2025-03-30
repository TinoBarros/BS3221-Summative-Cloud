import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import { BrowserRouter as Router, Routes, Route, Link,} from 'react-router-dom';
import Popup from 'reactjs-popup';
import Dashboard from './Dashboard';
import Locations from './Locations';
import Edit from './Edit';


function App() {

  const [staffNumber, setStaffNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [workingLocation, setWorkingLocation] = useState('')
  const [picklistOptions, setPicklistOptions] = useState([])
  const [formSubmitted, setFormSubmitted] = useState(false);
  

  useEffect(() => {
    axios
      .get("http://localhost:8080/locations")
      .then((response) => {

        const options = response.data.map((item) => ({
          value: item.Name,
          label: item.Name,
        }));

        const uniqueOptions = Array.from(new Map(options.map(item => [item.value, item])).values());


        setPicklistOptions(uniqueOptions);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  

  const submitHandler = e => {
    e.preventDefault();
    if (!staffNumber.trim() || !firstName.trim() || !lastName.trim() || !workingLocation.trim()) {
      alert("Please fill in all required fields.");
      setFormSubmitted(false);
      return;
    }

    if (!/^\d+$/.test(staffNumber)) {
      alert("Staff Number must be numerical")
      setFormSubmitted(false);
      return;
    }

    axios.post('http://localhost:8080/clocking', {staffNumber: staffNumber, firstName: firstName, lastName: lastName, workingLocation: workingLocation})
    .then((data) => {
      console.log(data)
      setStaffNumber('')
      setFirstName('')
      setLastName('')
      setWorkingLocation('') 
      setFormSubmitted(true)
    })
  }

  const LocationPicklist = () => (
    <Select isSearchable='true' options={picklistOptions} value={picklistOptions.find(option => option.value === workingLocation)} 
    onChange={(selectedOption) => setWorkingLocation(selectedOption.value)} 
    styles={{
      control: (base) => ({
        ...base,
        border: '1px solid black',
        borderRadius: '4px', 
        padding: '2px', 
        '&:hover': {
          backgroundColor: '#f3f3f3' 
        }
      })
    }} />
  )

  const Sidebar = () => {
    return (
      <div className="w-64 border border-black bg-[#552d67] text-white p-4 h-screen">
        <h2 className="text-xl font-bold">Fire Warden System</h2>
        <ul className="mt-4 space-y-2">
          <Link className="block p-2 hover:bg-[#452354] rounded" to="/dashboard">Dashboard</Link>
          <Link className="block p-2 hover:bg-[#452354] rounded" to="/">Clock In</Link>
          <Link className="block p-2 hover:bg-[#452354] rounded" to="/locations">Locations</Link>
        </ul>
      </div>
    );
  };
  
  const SubmitButton = () => {
    return (
      <div className='flex, py-10'>
        <button className='px-10 py-1 rounded-sm bg-[#552d67] hover:bg-[#452354] text-white'type='submit'>
          Submit
        </button>
      </div>
    )
  }
  return (
    <>
    <Popup open={formSubmitted} modal nested onClose={() => setFormSubmitted(false)}>
      {(close) => (
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-300 relative flex flex-col items-center">
          <div className="text-lg font-semibold mb-3 text-black text-center">
            Clocking Success
          </div>
          <div className="py-3 content text-black text-center">
            Clocking has been successfully registered.
          </div>
          <div className="actions">
            <button 
              className="px-5 py-1 rounded-sm bg-[#552d67] hover:bg-[#452354] text-white"
              onClick={() => { close(); setFormSubmitted(false); }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </Popup>


    <Router>
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 bg-gray-100 p-8'>
        <Routes>
          <Route path="/" element={
            <form onSubmit={submitHandler}>
              <h3 className='pb-6 text-5xl text-center text-black'>Clock In</h3>
              <div className='mx-auto p-9 md:p-12 w-full max-w-md border-purple-400 mt-0'>
                <label className='block mb-1 text-xl text-black' htmlFor='staffNumber'>Staff Number</label>
                <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='staffNumber' type='text'value={staffNumber} onChange={(e) => setStaffNumber(e.target.value.replace(/\D/g, ''))} />
                <label className='block mb-1 text-xl text-black' htmlFor='firstName'> First Name</label>
                <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='firstName' type='text'value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <label className='block mb-1 text-xl text-black' htmlFor='lastName'>Last Name</label>
                <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='lastName' type='text'value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label className='block mb-1 text-xl text-black' htmlFor='workingLocation'>Working Location</label>
                <LocationPicklist></LocationPicklist>
                <SubmitButton />
            </div>  
        </form>
          } />
        <Route path="/dashboard" element={ <Dashboard />} />
        <Route path="/locations" element={ <Locations />} />
        <Route path="edit/:clockingId" element={ <Edit />} />
        </Routes>
      </div>
    </div>                 
  </Router>
  </>
  );
}


export default App;
