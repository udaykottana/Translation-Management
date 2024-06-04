import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const TableComponent = ({ translations }) => {
  const [editRow, setEditRow] = useState(null);
  const [editValues, setEditValues] = useState({ en: '', ja: '' });

  const allKeys = Object.keys(translations[0].en || {});

  const handleEdit = (key, enValue, jaValue) => {
    setEditRow(key);
    setEditValues({ en: JSON.stringify(enValue), ja: JSON.stringify(jaValue) });
  };

  const handleSave = async (key) => {
    const enValue = tryParseJSON(editValues.en);
    const jaValue = tryParseJSON(editValues.ja);

    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjQ3NDAxMDk0MjI5YTI0OGNiN2YyMjAiLCJpYXQiOjE3MTc0MTIzNjksImV4cCI6MTcxNzQxNDE2OSwidHlwZU9mVXNlciI6IlVzZXIiLCJ0eXBlIjoiYWNjZXNzIn0.sDiWalDywmz6Rd0quq3tfH9PQ24wR29XuclkD5JkCuo';

      const response = await axios.put('http://localhost:5000/v1/users/translations', {
        id: translations[0]._id,
        key: key,
        value: {
          en: enValue,
          ja: jaValue
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        console.log("Translation updated successfully:", response.data.translation);
        translations[0].en[key] = enValue;
        translations[0].ja[key] = jaValue;
        setEditRow(null);
      }
    } catch (error) {
      console.error('Error updating translation:', error);
    }
  };

  const handleChange = (lang, value) => {
    setEditValues({ ...editValues, [lang]: value });
  };

  const tryParseJSON = (jsonString) => {
    try {
      const obj = JSON.parse(jsonString);
      if (obj && typeof obj === 'object') {
        return obj;
      }
    } catch (e) {
      // It's a string
    }
    return jsonString;
  };

  const renderValue = (value) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="table-container" style={{ marginLeft: '0', marginRight: '0' }}>
      <TableContainer component={Paper} sx={{ marginLeft: '0', marginRight: '0' }}>
        <Table aria-label="simple table" sx={{ tableLayout: 'fixed' }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow sx={{ height: '40px' }}>
              <TableCell align="left" sx={{ padding: '10px 0px 0px 13px', height: '40px', lineHeight: '40px', width: '25%' }}>Key</TableCell>
              <TableCell align="left" sx={{ padding: '10px 0', height: '40px', lineHeight: '40px', width: '25%' }}>English</TableCell>
              <TableCell align="left" sx={{ padding: '10px 0', height: '40px', lineHeight: '40px', width: '25%' }}>Japanese</TableCell>
              <TableCell align="left" sx={{ padding: '10px 0px 0px 13px', height: '40px', lineHeight: '40px', width: '25%' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allKeys.map((key) => (
              <TableRow key={key}>
                <TableCell align="left" sx={{ padding: '10px 0px 0px 12px', height: '40px', lineHeight: '40px', width: '25%' }}>{key}</TableCell>
                <TableCell align="left" sx={{ padding: '10px 0', height: '40px', lineHeight: '40px', width: '25%' }}>
                  {editRow === key ? (
                    <TextField
                      value={editValues.en}
                      onChange={(e) => handleChange('en', e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  ) : (
                    renderValue(translations[0].en[key]) || ''
                  )}
                </TableCell>
                <TableCell align="left" sx={{ padding: '10px 0', height: '40px', lineHeight: '40px', width: '25%' }}>
                  {editRow === key ? (
                    <TextField
                      value={editValues.ja}
                      onChange={(e) => handleChange('ja', e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                  ) : (
                    renderValue(translations[0].ja[key]) || ''
                  )}
                </TableCell>
                <TableCell align="left" sx={{ padding: '10px 0px 0px 13px', height: '40px', lineHeight: '40px', width: '25%' }}>
                  {editRow === key ? (
                    <Button variant="contained" color="primary" onClick={() => handleSave(key)}>
                      Save
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => handleEdit(key, translations[0].en[key], translations[0].ja[key])}>
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableComponent;
