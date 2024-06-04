import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
const TranslationForm = ({ addTranslation }) => {
  const [key, setKey] = useState('');
  const [english, setEnglish] = useState('');
  const [japanese, setJapanese] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTranslation = { [key]: { en: english, ja: japanese } };
    addTranslation(newTranslation);
    setKey('');
    setEnglish('');
    setJapanese('');
  };

  return (
    <>     
     <Grid 
     container
     direction="row"
     justifyContent="left"
     alignItems="center"
     sx={{padding:"12px 0px 12px 12px"}}>
      <div>
        <TextField
          sx={{paddingRight:"40px"}}
          label="Key"
          placeholder="Key"
          variant="outlined"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      <div>
        <TextField
        sx={{paddingRight:"40px"}}
          label="English"
          variant="outlined"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
        />
      </div>
      <div>
        <TextField
        sx={{paddingRight:"40px"}}
          label="Japanese"
          variant="outlined"
          value={japanese}
          onChange={(e) => setJapanese(e.target.value)}
        />
      </div>
      <div>
      <Button   sx={{paddingRight:"40px"}} type="submit" variant="contained" color="primary">Save</Button>
      </div>
      </Grid>
      <Grid container justifyContent="center">
        <Button type="submit" variant="contained" color="primary">Submit</Button>
      </Grid>
      </>

  );
};

export default TranslationForm;
