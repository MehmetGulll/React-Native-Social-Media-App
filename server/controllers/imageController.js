const express = require('express');
const fs = require('fs');
const path = require('path');


exports.images = async(req,res)=>{
    const filePath = path.join(__dirname, 'public', req.params.path);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error reading file' });
    } else {
      res.end(data);
    }
  });
}

