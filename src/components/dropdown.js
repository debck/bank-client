import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import BankListTable from './table.js'


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop: 90
  },
  margin: {
    margin: theme.spacing(1),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      marginTop: 90,
      marginBottom: 30
    }
  }
}));


const WAIT_INTERVAL = 1000;


export default function DropDownBank() {
  const classes = useStyles();
  const [bank, setBank] = React.useState('BANGALORE');
  const [search,setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [timer,setTimer] = React.useState(null);

  const handleChange = (event) => {
    setBank(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSearchText = (event) => {
    const timer = setTimeout(() => setSearch(event.target.value), 1000);
    return () => clearTimeout(timer);
  }


  return (
    <div>
     <form className={classes.root} noValidate autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Cities</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={bank}
          onChange={handleChange}
        >
          <MenuItem value={'CHENNAI'}>CHENNAI</MenuItem>
          <MenuItem value={'BANGALORE'}>BANGALORE</MenuItem>
          <MenuItem value={'DELHI'}>DELHI</MenuItem>
          <MenuItem value={'MUMBAI'}>MUMBAI</MenuItem>
          <MenuItem value={'AHMEDABAD'}> AHMEDABAD </MenuItem>
        </Select>
      </FormControl>
      <TextField id="standard-search" label="🔍 Search anything" type="search"
        onChange={handleSearchText} style={{float: "right"}}/>
    </form>
    <BankListTable bank={bank} searchText={search}/>
    </div>
  );
}
