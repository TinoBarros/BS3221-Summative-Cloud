import { useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { create } from '@mui/material/styles/createTransitions';


function App() {

  const [staffNumber, setStaffNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [workingLocation, setWorkingLocation] = useState('')
  const [picklistOptions, setPicklistOptions] = useState([])
  

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
  
  const Dashboard = () => {
    const [clockings, setClockings] = useState([]);

    useEffect(() => {
      axios
        .get("http://localhost:8080/clockings")
        .then((response) => {
          setClockings(response.data)
        })
        .catch((error) => console.error("Error Fetching Clockings:", error));
    }, []);

    return(
      <div>
        <h3 className='px-10 mb-10 pb-6 text-5xl text-center text-black'>Dashboard</h3>
      <div>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "150px"}}>Staff Number</TableCell>
            <TableCell align="center">First Name</TableCell>
            <TableCell align="center">Last Name</TableCell>
            <TableCell align="center">Working Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clockings.map((row) => (
            <TableRow
              key={row.staffNumber}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.staffNumber}</TableCell>
              <TableCell align="center">{row.firstName}</TableCell>
              <TableCell align="center">{row.lastName}</TableCell>
              <TableCell align="center">{row.workingLocation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
    );
  };



  const Locations = () => {
    return(
      <div>
        <h3 className='pb-6 text-5xl text-center text-black'>Locations</h3>
      </div>
    );
  };

  const submitHandler = e => {
    e.preventDefault();
    axios.post('http://localhost:8080/clocking', {staffNumber: staffNumber, firstName: firstName, lastName: lastName, workingLocation: workingLocation})
    .then((data) => {
      console.log(data)
      setStaffNumber('')
      setFirstName('')
      setLastName('')
      setWorkingLocation('')
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
      <div className="w-64 border border-black bg-purple-600 text-white p-4 h-screen">
        <h2 className="text-xl font-bold">Fire Warden System</h2>
        <ul className="mt-4 space-y-2">
          <Link className="block p-2 hover:bg-purple-700 rounded" to="/dashboard">Dashboard</Link>
          <Link className="block p-2 hover:bg-purple-700 rounded" to="/">Clock In</Link>
          <Link className="block p-2 hover:bg-purple-700 rounded" to="/locations">Locations</Link>
        </ul>
      </div>
    );
  };
  
  return (
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
                <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='staffNumber' type='text'value={staffNumber} onChange={(e) => setStaffNumber(e.target.value)} />
                <label className='block mb-1 text-xl text-black' htmlFor='firstName'> First Name</label>
                <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='firstName' type='text'value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <label className='block mb-1 text-xl text-black' htmlFor='lastName'>Last Name</label>
                <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='lastName' type='text'value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <label className='block mb-1 text-xl text-black' htmlFor='workingLocation'>Working Location</label>
                <LocationPicklist></LocationPicklist>
              </div>
              <div className='flex justify-end'>
              <button className='px-10 py-1 rounded-sm bg-purple-600 hover:bg-purple-700 text-white'type='submit'>Submit</button> 
          </div>
        </form>
          } />
        <Route path="/dashboard" element={ <Dashboard />} />
        <Route path="/locations" element={ <Locations />} />
        </Routes>
      </div>
    </div>                 
  </Router>
  );
}


export default App;
