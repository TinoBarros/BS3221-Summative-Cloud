import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Checkbox, TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';


const Dashboard = () => {
    const [clockings, setClockings] = useState([]);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);

    useEffect(() => {
      axios
        .get("https://fire-warden-exbrf4d4gxe0cgc3.ukwest-01.azurewebsites.net/clockings")
        .then((response) => {
          setClockings(response.data)
        })
        .catch((error) => console.error("Error Fetching Clockings:", error));
    }, []);

    const selectHandler = (clockingId) => {
      setSelected((prevSelected) => (prevSelected === clockingId ? null: clockingId))
    };

    const pageChangeHandler = (event, newPage) => {
      setPage(newPage)
      
    }

    const EditButton = ({ selected }) => {
      return (
        <div className='flex justify-end py-3'>
          <Link
            to={selected ? `/edit/${selected}` : '#'}
            style={{textDecordation: 'none'}}
          >
            <Button
              variant='contained' 
              disabled={!selected} 
              sx={{
                backgroundColor: '#7c2181',
                '&:hover' : {backgroundColor: '#651a69'}
              }}
            >
             Edit
            </Button>
        </Link>
      </div>
      )
    }

    const DeleteButton = ({ selected }) => {
      return (
        <div className='flex justify-end py-3'>
            <Button
              variant='contained' 
              disabled={!selected} 
              onClick={deleteHandler}
              sx={{
                backgroundColor: '#7c2181',
                '&:hover' : {backgroundColor: '#651a69'}
              }}
            >
             Delete
          </Button>
      </div>
      )
    }

    const deleteHandler = () => {
      if (selected) {
      axios.post('https://fire-warden-exbrf4d4gxe0cgc3.ukwest-01.azurewebsites.net/delete', { clockingId: selected })
      .then(() => {
        setClockings(clockings.filter(clocking => clocking.clockingId !== selected))
        setSelected(null)
      })
      .catch(error => console.error("Error Deleting Clocking:", error))
      }
    }

    const dateFormatter = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2,'0')
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2,'0')
      const mins = String(date.getMinutes()).padStart(2,'0')
      return `${hours}:${mins} ${day}/${month}/${year}`
    }

    const paginatedClockings = clockings.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return(
      <div>
        <h3 className='px-10 mb-2 pb-2 text-5xl text-center text-black'>Dashboard</h3>
        <div className='pb-10 text-black text-center'>View all warden clockings for today in one place.</div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{maxHeight: '80vh', overflow: 'auto'}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell sx={{ width: "150px"}}>Staff Number</TableCell>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">Working Location</TableCell>
                <TableCell align="center">Time</TableCell>
              </TableRow>
            </TableHead>
          <TableBody>
            {paginatedClockings.map((row) => (
              <TableRow
                key={row.clockingId} hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Checkbox 
                    checked={selected === row.clockingId} 
                    onChange={() => selectHandler(row.clockingId)}
                    sx={{
                      color: '#7c2181',
                      '&.Mui-checked': {
                        color: '#651a69'
                      }
                    }} /></TableCell>
                <TableCell component="th" scope="row">{row.staffNumber}</TableCell>
                <TableCell align="center">{row.firstName}</TableCell>
                <TableCell align="center">{row.lastName}</TableCell>
                <TableCell align="center">{row.workingLocation}</TableCell>
                <TableCell align="center">{dateFormatter(row.clockingTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={clockings.length}
          rowsPerPageOptions={rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={pageChangeHandler}
          sx={{"& .MuiTablePagination-input": { display: "none" },}}
        />
        </TableContainer>
        <div className='flex justify-end gap-x-5'>
          <DeleteButton selected={selected}/>
          <EditButton selected={selected} />
        </div>
      </div>
    </div>
    );
  };

export default Dashboard;