import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import config from '../../config';


// const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Logout'];

const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [authenticated, setAuthenticated] = React.useState(false);
    const [profile, setProfile] = React.useState({'name': '', 
                                                  'email': '',
                                                  'picture': ''});
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    axios.interceptors.request.use(function (config) {
        const token = sessionStorage.getItem('access_token')
        if (token)
            config.headers['Authorization'] = `Bearer ${token}`
        return config
    }, function (err) {
        return Promise.reject(err)
    })

    const getUserProfile = async () => {
        console.log(profile)
    }

    const responseGoogle = async (response) => {
        if(response.accessToken) {
            let result = await axios.post(`${config.apiUrlPrefix}/login_with_google`, {
              token: response.tokenId
            })

            // console.log(result.data);
            // sessionStorage.setItem('access_token', result.data.accessToken)
        

            const data = result.data;
            sessionStorage.setItem('access_token', data.access_token)
            sessionStorage.setItem('refresh_token', data.refresh_token)
            localStorage.setItem('authentication', true)
            setAuthenticated(true)
            console.log(data);
            
          }


    }

    const logout = () => {
        localStorage.removeItem('authentication')
        setAuthenticated(false)
    }


    // const getNewToken = async (response) => { 
    //     let result = await axios.post('http://localhost:8080/api/get_token', {  
    //             refresh_token: sessionStorage.getItem('refresh_token')
    //         })
    // }

    React.useEffect(() => {
        if(localStorage.getItem('authentication')){
            setAuthenticated(true)
        }
    }, [authenticated])
    
    
   React.useEffect(() => {
        async function fetchDataProfile(){
            let result = await axios.get(`${config.apiUrlPrefix}/info`)
            setProfile({
                'name': `${result.data.user.name}`, 
                'email': `${result.data.user.email}`,
                'picture': `${result.data.user.picture}`
            })
        }
        fetchDataProfile()
   }, [])


    
    return (
        <AppBar position="static" style = {{height: "7vh"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        Traveling Log
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {/* {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))} */}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        Traveling log
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {/* {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))} */}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {authenticated ?
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src={profile.picture} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography textAlign="center" onClick={() => {
                                                if(setting === 'Profile'){
                                                    getUserProfile()
                                                }else if(setting === 'Logout') {
                                                    logout()
                                                }
                                            }}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                    
                                </Menu>
                                {/* <button onClick={getNewToken}>New access_token</button> */}
                                
                                

                            </>
                            :
                            <>
                                <GoogleLogin
                                    clientId="750038332989-5j4trdigj503v8fksq85aq6p20qklm2o.apps.googleusercontent.com"
                                    buttonText="Login"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    
                                />

                                
                            </>

                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;