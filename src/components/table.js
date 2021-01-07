import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import _ from 'lodash';
import StarIcon from '@material-ui/icons/Star';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import Switch from '@material-ui/core/Switch';


const columns = [
  { id: 'bank_name', label: 'Bank Name', minWidth: 170 },
  { id: 'branch', label: 'Branch', minWidth: 100 },
  { id: 'ifsc', label: 'IFSC', minWidth: 100 },
  { id: 'state', label: 'State', minWidth: 170 },
  {id: 'address', label: 'Address', minWidth: 100}
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function BankListTable({bank, searchText}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [responseData, setResponseData] = React.useState([]);
  const [fav, setfav] = React.useState([]);
  const [check, setCheck] = React.useState({checked: false});
  const [loading,setloading] = React.useState(false);
  const [resultLength, setResultLength] = React.useState(11);


  const fetchData = React.useCallback(() => {
    setloading(true)
    axios({
      "method": "GET",
      "url": `https://bank-server-api.herokuapp.com/api/branches/autocomplete?q=${bank}`,
    })
    .then((response) => {
      setResultLength(response.data.length)
      setResponseData(response.data)
      setloading(false)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [bank])


  const fetchSearchResult = React.useCallback(() => {
    setloading(true)
    axios({
      "method": "GET",
      "url": `https://bank-server-api.herokuapp.com/api/branches?q=${searchText}`,
    })
    .then((response) => {
      setResultLength(response.data.length)
      setResponseData(response.data)
      setloading(false)
    })
    .catch((error) => {
      console.log(error)
    })
  },[searchText])



const isfound = (row) => {
  const favorites = JSON.parse(localStorage.getItem("allEntries"))|| [];
  let flag = 0;
  if(favorites != null) {
    for(let i = 0; i<favorites.length; i++) {
      let value = favorites[i];
      if( _.isEqual(value, row) )
        flag = 1;
    }
    if(flag==1)
      return true;
    else
      return false;
  } else {
    return false;
  }
}


const handleChangeIcon = (row) => {
  const allEntries = JSON.parse(localStorage.getItem("allEntries"))|| [];
  const c = allEntries.length
  let flag = 0;
    for(var i = 0; i<=c; i++) {
      let value = allEntries[i] || '';
      if( _.isEqual(value, row) ){
        flag=1;
        break;
      }
    }

  if(flag==0) {
      allEntries.push(row)
      localStorage.setItem("allEntries", JSON.stringify(allEntries));
  } else {
      allEntries.splice(i, 1);
      localStorage.setItem('allEntries',JSON.stringify(allEntries));
  }
  setfav(allEntries);
}



  React.useEffect(() => {
    fetchData();
  }, [bank])


  React.useEffect(() => {
    if(searchText == '') 
      fetchData();
    else
      fetchSearchResult();
  }, [searchText])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCheck = (event) => {
    setCheck({ ...check, [event.target.name]: event.target.checked });
    if(check.checked==false){
      var allEntries = JSON.parse(localStorage.getItem("allEntries")) || [];
      setResponseData(allEntries);
      setResultLength(allEntries.length)
    } else {
      fetchData();
    }
  };

  return (
    <Paper className={classes.root}>
      <FormControlLabel
        control={<Switch checked={check.checked} onChange={handleCheck} name="checked" color="primary" />}
        label="Only Favorites"
      />
  
      {loading &&  (<div className={classes.loader} style={{'margin-left': '50%'}}>
        <CircularProgress />
      </div>)}

      { !resultLength && (<h2 style={{'text-align': 'center'}}>No results</h2>)}

      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key='13' align='left'>
                        Favorites
                  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {responseData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell key='13' align='left'>
                  {isfound(row) ? <StarIcon onClick={() => handleChangeIcon(row)} /> : <StarBorderOutlinedIcon onClick={() => handleChangeIcon(row)} />}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={responseData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}