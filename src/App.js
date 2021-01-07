import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import DropDownBank from './components/dropdown.js'

function App() {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">Bank Branches</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <DropDownBank />
      </Container>
    </>
  );
}

export default App;
