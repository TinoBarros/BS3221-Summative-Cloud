import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const Edit = () => {
    const { clockingId } = useParams()
    const [staffNumber, setStaffNumber] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [workingLocation, setWorkingLocation] = useState('')
    const [picklistOptions, setPicklistOptions] = useState([])
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [clockingTime, setClockingTime] = useState(new Date())

    useEffect(() => {
      axios.get(`https://fire-warden-exbrf4d4gxe0cgc3.ukwest-01.azurewebsites.net/edit/${clockingId}`)
      .then(response => {
        const data = response.data[0]
        setStaffNumber(data.staffNumber)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setClockingTime(new Date(data.clockingTime))
        setWorkingLocation(data.workingLocation)
      
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
    }, [clockingId])

    useEffect(() => {
      axios
        .get("https://fire-warden-exbrf4d4gxe0cgc3.ukwest-01.azurewebsites.net/locations")
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
    if (!staffNumber.trim() || !firstName.trim() || !lastName.trim() || !workingLocation.trim() || !clockingTime) {
      alert("Please fill in all required fields.");
      setFormSubmitted(false);
      return;
    }

    if (!/^\d+$/.test(staffNumber)) {
      alert("Staff Number must be numerical")
      setFormSubmitted(false);
      return;
    }

      axios.post('https://fire-warden-exbrf4d4gxe0cgc3.ukwest-01.azurewebsites.net/update', 
        {clockingId: clockingId, 
        staffNumber: staffNumber,
        firstName: firstName,
        lastName: lastName,
        workingLocation: workingLocation,
        clockingTime: clockingTime
      })
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

    return(
      <>
          <Popup open={formSubmitted} modal nested onClose={() => setFormSubmitted(false)}>
            {(close) => (
              <div className="bg-white p-6 rounded-lg shadow-xl w-96 border border-gray-300 relative flex flex-col items-center">
                <div className="text-lg font-semibold mb-3 text-black text-center">
                  Edit Success
                </div>
                <div className="py-3 content text-black text-center">
                  Clocking record has been successfully updated.
                </div>
                <div className="actions">
                <Link className="block text-white p-2 bg-[#552d67] hover:bg-[#452354] rounded" to="/dashboard">Back To Dashboard</Link>
                </div>
              </div>
            )}
          </Popup>
          <div className='flex'>
  <div className='flex-1 bg-gray-100 p-8'>
                  <form onSubmit={submitHandler}>
                    <h3 className='text-5xl text-center text-black'>Edit</h3>
                    <div className='mx-auto p-6 md:p-12 w-full max-w-md border-purple-400 mt-0'>
                      <label className='block mb-1 text-xl text-black' htmlFor='staffNumber'>Staff Number</label>
                      <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='staffNumber' type='text' value={staffNumber} onChange={(e) => setStaffNumber(e.target.value.replace(/\D/g, ''))} />
                      <label className='block mb-1 text-xl text-black' htmlFor='firstName'> First Name</label>
                      <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='firstName' type='text'value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      <label className='block mb-1 text-xl text-black' htmlFor='lastName'>Last Name</label>
                      <input className='w-full h-8 p-1 mb-6 border border-black outline-none hover:bg-gray-100 rounded' id='lastName' type='text'value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      <label className='block mb-1 text-xl text-black' htmlFor='workingLocation'>Working Location</label>
                      <LocationPicklist></LocationPicklist>
                      <label className='block mb-1 text-xl text-black' htmlFor='lastName'>Clocking Time</label>
                      <DateTimePicker
                      className="w-full"
                      onChange={setClockingTime}
                      value={clockingTime} />
                      <div className='flex py-5 justify-between w-full'>
                      <Link className="px-12 py-1 rounded-sm bg-[#7c2181] hover:bg-[#651a69] text-white" to="/dashboard">Back</Link>
                      <button className='px-10 py-1 rounded-sm bg-[#7c2181] hover:bg-[#651a69] text-white'type='submit'>
                        Update
                      </button>

                    </div>
                  </div>  
              </form>
        </div>
        </div>
        </>)   
          };

  export default Edit;