const fs = require('fs');
const express = require('express');
const app = express();

// Get data from JSON files
const artists = JSON.parse(fs.readFileSync('/Users/anfernepineda/Downloads/f2023-assign3-master/data/artists.json', 'utf8'));
const galleries = JSON.parse(fs.readFileSync('/Users/anfernepineda/Downloads/f2023-assign3-master/data/galleries.json', 'utf8'));
const paintings = JSON.parse(fs.readFileSync('/Users/anfernepineda/Downloads/f2023-assign3-master/data/paintings-nested.json', 'utf8'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(PORT);
});


/* Paintings API */

// Return all paintings
app.get('/api/paintings', (req, res) => {
    res.json(paintings);
});

// Return single painting with specified matching ID
app.get('/api/painting/:id', (req, res) => {
    const data = paintings.find(p => p.paintingID == req.params.id);

    if (!data) {
        res.status(404).send('Error: Specified painting not found');
    } else {
        res.json(data);
    }
});

// Return paintings with specified matching gallery ID
app.get('/api/painting/gallery/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = paintings.filter(p => p.gallery && p.gallery.galleryID === id);

    if (data.length === 0) {
        res.status(404).send('Error: No paintings found for specified gallery');
    } else {
        res.json(data);
    }
});

// Return paintings with specified matching artist ID
app.get('/api/painting/artist/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = paintings.filter(p => p.artist.artistID === id);

    if (data.length === 0) {
        res.status(404).send('Error: No paintings found for specified artist');
    } else {
        res.json(data);
    }
});

// Return paintings within specified range for yearOfWork
app.get('/api/painting/year/:min/:max', (req, res) => {
    const { min, max } = req.params;
    const data = paintings.filter(p => p.yearOfWork >= min && p.yearOfWork <= max);

    if (data.length === 0) {
        res.status(404).send('Error: No paintings found in specified year range');
    } else {
        res.json(data);
    }
});

// Return paintings with specified matching text in title
app.get('/api/painting/title/:text', (req, res) => {
    const data = paintings.filter(p => p.title.toLowerCase().includes(req.params.text.toLowerCase()));

    if (data.length === 0) {
        res.status(404).send('Error: No paintings found from title with specified text');
    } else {
        res.json(data);
    }
});

// Return paintings with specified matching color name
app.get('/api/painting/color/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const data = paintings.filter(p => p.details.annotation.dominantColors.some(color => color.name.toLowerCase() === name));
            
    if (data.length === 0) {
        res.status(404).send('Error: No colors found from specified color name');
    } else {
        res.json(data);
    }
});


/* Artists API */

// Return all artists
app.get('/api/artists', (req, res) => {
    res.json(artists);
});

// Return all artists in specified country
app.get('/api/artists/:country', (req, res) => {
    const country = req.params.country.toLowerCase();
    const data = artists.filter(a => a.Nationality.toLowerCase() === country);

    if (data.length === 0) {
        res.status(404).send('Error: No artists found from specified country');
    } else {
        res.json(data);
    }
});


/* Galleries API */

// Return all galleries
app.get('/api/galleries', (req, res) => {
    res.json(galleries);
});

// Return all galleries in specified country
app.get('/api/galleries/:country', (req, res) => {
    const country = req.params.country.toLowerCase();
    const data = galleries.filter(g => g.GalleryCountry.toLowerCase() === country);
    
    if (data.length === 0) {
        res.status(404).send('Error: No galleries found from specified country');
    } else {
        res.json(data);
    }
});