// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TranslationForm from './components/TranslationForm';
import TranslationTable from './components/TranslationTable'; // Make sure the import path is correct
import TableComponent from './components/TableComponent';
import { Grid } from '@mui/material';
const App = () => {

  return (
    <div >
       <center><h1 >Translation Management</h1></center>
      <Grid sx={{height:"480px"}}>
        <Grid container lg={12} >
      <TranslationTable />
      </Grid>
      </Grid>
      
    </div>
  );
};

export default App;
