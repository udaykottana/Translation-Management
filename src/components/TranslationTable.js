import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, 
  IconButton, Grid 
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Height } from '@mui/icons-material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CommonPagination from '../common/reusable/CommonPagination'; // Adjust the import path accordingly

const TranslationTable = () => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedTranslations, setEditedTranslations] = useState({});
 
  const [open, setOpen] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [newTranslation, setNewTranslation] = useState({ key: '', en: '', ja: '' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjQ3NDAxMDk0MjI5YTI0OGNiN2YyMjAiLCJpYXQiOjE3MTc1MDYzMzMsImV4cCI6MTcxNzUwODEzMywidHlwZU9mVXNlciI6IlVzZXIiLCJ0eXBlIjoiYWNjZXNzIn0.LerP1l64kX73JYvzPLBVgdzVofNsW5cZKKVt-Urhg-M';

  const fetchTranslations = async () => {
    try {
      const response = await fetch('http://localhost:5000/v1/users/translations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTranslations(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const handleEdit = (key) => {
    setCurrentKey(key);
   
    setEditedTranslations({
      en: translations[0]?.en[key] || '',
      ja: translations[0]?.ja[key] || ''
    });
    setOpen(true);
  };

  const handleAdd = () => {
    setOpenAddDialog(true);
  };

  const handleNewTranslationChange = (field, value) => {
    setNewTranslation((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAdd = async () => {
    try {
      await fetch('http://localhost:5000/v1/users/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [newTranslation.key]: { en: newTranslation.en, ja: newTranslation.ja } })
      });
      fetchTranslations();
      setOpenAddDialog(false);
    } catch (error) {
      console.error('Error adding new translation:', error);
    }
  };

  const handleDelete = async (key) => {
    try {
      await fetch(`http://localhost:5000/v1/users/translations/${key}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
    }
  };

  const handleChange = (language, newValue) => {
    setEditedTranslations((prevTranslations) => ({
      ...prevTranslations,
      [language]: newValue
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setEditedTranslations({});
    //setOriginalTranslations({});
  };

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:5000/v1/users/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [currentKey]: editedTranslations })
      });
      setEditedTranslations({});
     // setOriginalTranslations({});
      fetchTranslations();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting translations:', error);
    }
  };

  const handlePageChange = (newPage, newRowsPerPage, keyOfAction) => {
    setPage(newPage);
    setRowsPerPage(newRowsPerPage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const enKeys = Object.keys(translations[0]?.en || {});
  const jaKeys = Object.keys(translations[0]?.ja || {});
  const allKeys = Array.from(new Set([...enKeys, ...jaKeys]));
  const filteredKeys = allKeys
  .filter((key) => 
    key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    translations[0]?.en[key]?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    translations[0]?.ja[key]?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => a.localeCompare(b)); // Sort alphabetically
  const paginatedKeys = filteredKeys.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'column', width: "100%", height:"500px" }}>
        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '250px', marginRight: '20px' }} // Adjust the width and margin as needed
          />
          <Button variant="contained" onClick={handleAdd} startIcon={<AddIcon />}>Add new Translation</Button>
        </Box>

        <Grid sx={{maxHeight:"85%"}}>
          <TableContainer component={Paper} sx={{ overflow:"hidden", overflowY: "auto", maxHeight: "100%" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Key</TableCell>
                  <TableCell>EN</TableCell>
                  <TableCell>JA</TableCell>
                  <TableCell>To Edit</TableCell>
                  <TableCell>To Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedKeys.map((key) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      <DisplayJsonValue value={translations[0]?.en[key]} />
                    </TableCell>
                    <TableCell>
                      <DisplayJsonValue value={translations[0]?.ja[key]} />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(key)}><ModeEditIcon sx={{ color: "grey" }} /></Button>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(key)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Translation for {currentKey}</DialogTitle>
        <DialogContent>
          
          <TextField
            margin="dense"
            label="EN (Edit)"
            type="text"
            fullWidth
            value={editedTranslations.en}
            onChange={(e) => handleChange('en', e.target.value)}
          />
  
          <TextField
            margin="dense"
            label="JA (Edit)"
            type="text"
            fullWidth
            value={editedTranslations.ja}
            onChange={(e) => handleChange('ja', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add New Translation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Key"
            type="text"
            fullWidth
            value={newTranslation.key}
            onChange={(e) => handleNewTranslationChange('key', e.target.value)}
          />
          <TextField
            margin="dense"
            label="EN"
            type="text"
            fullWidth
            value={newTranslation.en}
            onChange={(e) => handleNewTranslationChange('en', e.target.value)}
          />
          <TextField
            margin="dense"
            label="JA"
            type="text"
            fullWidth
            value={newTranslation.ja}
            onChange={(e) => handleNewTranslationChange('ja', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAdd} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <Grid sx={{width:"100%"}}>
        <CommonPagination
          count={filteredKeys.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onChange={handlePageChange}
        />
      </Grid>
    </>
  );
};

const DisplayJsonValue = ({ value }) => {
  try {
    return <>{JSON.stringify(value)}</>;
  } catch (error) {
    return <>{error.message}</>;
  }
};

export default TranslationTable;
