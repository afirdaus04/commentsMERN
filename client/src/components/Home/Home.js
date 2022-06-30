import React, { useState } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input'; // the thing that causes the tags to be chips

import { getPostsBySearch } from '../../actions/posts';             
import Posts from '../Posts/Posts';           //Adding classes  
import Form from '../Form/Form';              //Adding classes
import Pagination from '../Pagination';       //Adding classes      
import useStyles from './styles';             //Adding classes

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Home = () => {
  const classes = useStyles();
  const query = useQuery(); // get page info
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]); // the use of brackets for multiple tags
  const history = useHistory();


  // Function: Search for Post button function
  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push('/');
    }
  };


  // press enter to search function where keycode 13 is the "Enter" key
  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  // Function : populate the search function with tags
  const handleAddChip = (tag) => setTags([...tags, tag]); // spread previous tags and add new tags

  // Function: delete the tags in the search function
  const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));

  return (
    <Grow in>
      {/* Post Adjusting sizes */}
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {/* Search App Bar */}
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField 
                  onKeyDown={handleKeyPress} // When user Press enter instead of clicking button
                  name="search" 
                  variant="outlined" 
                  label="Search Memories" 
                  fullWidth value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
                {/* Search by Tags */}
              <ChipInput
                  style={{ margin: '10px 0' }}
                  value={tags}
                  onAdd={(chip) => handleAddChip(chip)}
                  onDelete={(chip) => handleDeleteChip(chip)}
                  label="Search Tags"
                  variant="outlined"
              />
                {/* Button to Search */}
              <Button 
                  onClick={searchPost} 
                  className={classes.searchButton} 
                  variant="contained" // Container for the button, colorising it to blue
                  color="primary">
                  Search
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {/* Pagination Component Called here */}
            {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
