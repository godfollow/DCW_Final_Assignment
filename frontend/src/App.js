import Navbar from './Components/Navbar'
import Blogpost from './Components/Blogpost'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import * as React from 'react'
import "./App.css"

function App() {
  const [authenticated, setAuthenticated] = React.useState(false);
  React.useEffect(() => {
    if(localStorage.getItem('authentication')){
        setAuthenticated(true)
    }
}, [authenticated])

React.useEffect(() => {
    if(authenticated){
      window.location.reload(false);
    }
}, [])
  return (
    <>
    
     <Navbar /> 
     {authenticated?
      <Blogpost />
     :<><Container maxWidth="lg" style = {{justifyContent: "center", alignItems: "center", display: "flex", height: '93vh'}}>
       {/* <Box sx={{ bgcolor: '#cfe8fc', height: '93vh' }} /> */}
          <Typography variant="h3" gutterBottom component="div">
            Please Login
          </Typography> 
      </Container></>
     }
     
    </>
  );
}

export default App;
