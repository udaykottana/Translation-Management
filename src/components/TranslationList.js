// src/components/TranslationList.js
import React from 'react';

const TranslationList = ({ translations }) => {
  return (
    <ul>
      {translations.map((translation, index) => (
        <li key={index}>
          {translation.english} - {translation.japanese}
        </li>
      ))}
    </ul>
  );
};

export default TranslationList;
