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
    const [selected, setSelected] = useState(new Set());
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);

    useEffect(() => {
      axios
        .get("http://localhost:8080/clockings")
        .then((response) => {
          setClockings(response.data)
        })
        .catch((error) => console.error("Error Fetching Clockings:", error));
    }, []);

    const selectHandler = (clockingId) => {
      setSelected((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(clockingId)) {
          newSelected.delete(clockingId)
        } else {
          newSelected.add(clockingId)
        }
        return newSelected
      })
    };

    const pageChangeHandler = (event, newPage) => {
      setPage(newPage)
      
    }

    const EditButton = ({ selected }) => {
      return (
        <div className='flex justify-end py-10'>
          <Link
            to={selected.size === 1 ? `/edit/${Array.from(selected)[0]}` : '#'}
            style={{textDecordation: 'none'}}
          >
            <Button
              variant='contained' 
              disabled={selected.size !== 1} 
              sx={{
                backgroundColor: '#552d67',
                '&:hover' : {backgroundColor: '#452354'}
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
        <div className='flex justify-end py-10'>
            <Button
              variant='contained' 
              disabled={selected.size !== 1} 
              onClick={deleteHandler}
              sx={{
                backgroundColor: '#552d67',
                '&:hover' : {backgroundColor: '#452354'}
              }}
            >
             Delete
          </Button>
      </div>
      )
    }

    const deleteHandler = () => {

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
        <h3 className='px-10 mb-10 pb-6 text-5xl text-center text-black'>Dashboard</h3>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                    checked={selected.has(row.clockingId)} 
                    onChange={() => selectHandler(row.clockingId)}
                    sx={{
                      color: '#552d67',
                      '&.Mui-checked': {
                        color: '#552d67'
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