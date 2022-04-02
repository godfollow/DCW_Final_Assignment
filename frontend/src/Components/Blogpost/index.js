import * as React from 'react';
import { makeStyles } from '@mui/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';


const Index = (props) => {

    


    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [fileCover, setFileCover] = React.useState({});
    const [coverPreviewUrl, setCoverPreviewUrl] = React.useState(null);
    const [blogList, setBlogList] = React.useState([])

    const handleTitleChange = (e) => {
        setTitle(e.target.value)

    }

    const handleContentOnchange = (e) => {
        setContent(e.target.value)
    }

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => { 
            setFileCover(file)
            setCoverPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleUploadBlog = (e) => {
        axios.post('http://localhost:8080/api/blog-post', {
            title: title,
            content: content,
            pictureCover: coverPreviewUrl
        }).then(response => {
            console.log(response)
        })
        
        
    }

    const getAllBlog = async (e) => {
        const result = await axios.get('http://localhost:8080/api/blog-list')
        setBlogList(result.data)
        
        
    }

    React.useEffect(() => {
        getAllBlog();
    }, [])

    return (
        <>

            <Container maxWidth="lg" >
                <Typography variant="h4" style={{ marginTop: 20, marginBottom: 20 }}>
                    Articles
                </Typography>

                {/* Form post */}
                <Grid container style={{ alignItems: 'center', marginBottom: 20, flexDirection: 'column' }} >
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '50ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="outlined-basic" label="Title" variant="outlined" style={{ width: '40ch' }} onChange={handleTitleChange} />

                        <input
                            accept="image/*"
                            id="icon-button-photocover"
                            style={{ display: 'none' }}
                            type="file"
                            onChange={handleUploadImage}
                        />
                        <label htmlFor="icon-button-photocover">
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={coverPreviewUrl ? coverPreviewUrl : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfFyczP09bM0dO8wMPk6ezY3eDd4uXR1tnJzdBvAX/cAAACVElEQVR4nO3b23KDIBRA0ShGU0n0//+2KmO94gWZ8Zxmr7fmwWEHJsJUHw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO1MHHdn+L3rIoK6eshsNJ8kTaJI07fERPOO1Nc1vgQm2oiBTWJ+d8+CqV1heplLzMRNonED+4mg7L6p591FC+133/xCRNCtd3nL9BlxWP++MOaXFdEXFjZ7r8D9l45C8y6aG0cWtP/SUGhs2d8dA/ZfGgrzYX+TVqcTNRRO9l+fS5eSYzQs85psUcuzk6igcLoHPz2J8gvzWaH/JLS+95RfOD8o1p5CU5R7l5LkfKEp0mQ1UX7hsVXqDpRrifILD/3S9CfmlUQFhQfuFu0STTyJ8gsP3PH7GVxN1FC4t2sbBy4TNRTu7LyHJbqaqKFw+/Q0ncFloo7CjRPwMnCWqKXQZ75El4nKC9dmcJaou9AXOE5UXbi+RGeJygrz8Uf+GewSn9uXuplnWDZJ7d8f24F/s6iq0LYf9olbS3Q8i5oKrRu4S9ybwaQ/aCkqtP3I28QDgeoK7TBya/aXqL5COx67PTCD2grtdOwH+pQV2r0a7YVBgZoKwwIVFQYG6ikMDVRTGByopjD8ATcKb0UhhRTe77sKs2DV7FKSjId18TUEBYVyLhUThWfILHTDqmI85/2RWWjcE/bhP6OD7maT3h20MHsA47JC3PsW0wcwLhv9t0OOPOIkCn21y2bXXwlyylxiYMPk1SuCSmpfK8bNQvIrpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwNX4BCbAju9/X67UAAAAASUVORK5CYII="}
                                    alt="Paella dish"
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        upload cover
                                    </Typography>
                                </CardContent>
                            </Card>
                        </label>


                    </Box>

                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Minimum 3 rows"
                        style={{ width: '50ch', height: '50ch' }}
                        onChange={handleContentOnchange}
                    />

                    <Button variant="contained" style={{ marginTop: 20 }} onClick={handleUploadBlog}>Post</Button>
                </Grid>

           
                        
                <Grid container spacing={3}>
                    {blogList.map((blog) => (
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={blog.PictureCover}
                                    
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {blog.Title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {blog.Content}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    ))}
                </Grid>


            </Container>

        </>
    )
}
export default Index
