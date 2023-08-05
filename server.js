const express = require('express');
const app = express();
const PORT = process.env.port || 3001;
const path = require('path');
const fs = require('fs');
const SavedNotes = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => 
    res.json(
        SavedNotes.slice(1)
    )
);
app.get('/', (req, res) => 
    res.sendFile(
        path.join(__dirname, './public/index.html')
    )
);
app.get('/notes', (req, res) => 
    res.sendFile(
        path.join(__dirname, './public/notes.html')
    )
);
app.get('*', (req, res) => 
    res.sendFile(
        path.join(__dirname, './public/index.html')
    )
);

function saveNewNotes(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray)) {
        notesArray = [];
    }
    if (notesArray.length === 0) {
        notesArray.push(0);
    }
        
    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.post('/api/notes', (req, res) => {
    const newNote = saveNewNotes(req.body, SavedNotes);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, SavedNotes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
