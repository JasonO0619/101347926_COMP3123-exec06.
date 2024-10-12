const express = require('express');
const router = express.Router();
const noteModel = require('../models/NotesModel');


noteModel.deleteMany()
    .then(() => {
        console.log('notes deleted successfully');
    })
    .catch((err) => {
        console.log('Error deleting notes: ', err);
        mongoose.connection.close();
    });

const notes = [
    { 
        noteTitle: "Meeting Notes", 
        noteDescription: "Notes from the project meeting on 2023-10-01.", 
        priority: "HIGH",
        dateAdded: new Date(),
        dateUpdated: new Date()
    },
    { 
        noteTitle: "Grocery List", 
        noteDescription: "Buy milk, eggs, and bread.", 
        priority: "MEDIUM",
        dateAdded: new Date(),
        dateUpdated: new Date()
    },
    { 
        noteTitle: "Book Recommendations", 
        noteDescription: "Suggested books for the reading club.", 
        priority: "LOW",
        dateAdded: new Date(),
        dateUpdated: new Date()
    },
    { 
        noteTitle: "Holiday Plans", 
        noteDescription: "Plan for the upcoming vacation.", 
        priority: "MEDIUM",
        dateAdded: new Date(),
        dateUpdated: new Date()
    },
    { 
        noteTitle: "Fitness Goals", 
        noteDescription: "Goals for the next month: run 5km and do yoga twice a week.", 
        priority: "HIGH",
        dateAdded: new Date(),
        dateUpdated: new Date()
    }
];

noteModel.insertMany(notes)
    .then(() => {
        console.log('Notes inserted successfully');
    })
    .catch((err) => {
        console.error('Error inserting notes:', err);
    });


//TODO - Create a new Note
//http://localhost:8086/notes
router.post('/notes', async (req, res) => {
    const { noteTitle, noteDescription, priority } = req.body;

    if (!noteTitle || !noteDescription || !priority) {
        return res.status(400).send({
            message: "Note title, description, and priority cannot be empty"
        });
    }

    const newNote = new noteModel({
        noteTitle,
        noteDescription,
        priority,
        dateAdded: new Date(),
        dateUpdated: new Date(),
    });

    try {
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (err) {
        console.error('Error saving note:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//TODO - Retrieve all Notes
//http://localhost:8086/notes
router.get('/notes', async (req, res) => {
    try{
        const fetchNotes = await noteModel.find();
        const meridiemTimes = fetchNotes.map(note => ({
            ...note._doc,
            dateAdded: new Date(note.dateAdded).toLocaleString('en-US', { hour12: true }),
            dateUpdated: new Date(note.dateUpdated).toLocaleString('en-US', { hour12: true })
        }));
        res.json(meridiemTimes)
    }catch(err){
            console.error('Error fetching notes:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
        
});

//TODO - Retrieve a single Note with noteId
//http://localhost:8086/notes/:noteId
router.get('/notes/:noteId', async (req, res) => {
    const noteId = req.params.noteId;

    try {
        const note = await noteModel.findById(noteId);
        
        if (!note) {
            return res.status(404).send({
                message: "Note not found"
            });
        }
        const meridiemTimes = {
            ...note._doc,
            dateAdded: new Date(note.dateAdded).toLocaleString('en-US', { hour12: true }),
            dateUpdated: new Date(note.dateUpdated).toLocaleString('en-US', { hour12: true })
        };
        res.json(meridiemTimes);
    } catch (err) {
        console.error('Error fetching note:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//TODO - Update a Note with noteId
//http://localhost:8086/notes/:noteId
router.put('/notes/:noteId', async (req, res) => {
    const noteId = req.params.noteId;
    const { noteTitle, noteDescription, priority } = req.body;
    if (!noteTitle && !noteDescription && !priority) {
        return res.status(400).send({
            message: "At least one field must be updated"
        });
    }

    try {
        const updatedNote = await noteModel.findByIdAndUpdate(
            noteId,
            {
                noteTitle,
                noteDescription,
                priority,
                dateUpdated: new Date() 
            },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).send({
                message: "Note not found"
            });
        }else{
            const meridiemTimes = {
                ...updatedNote._doc,
                dateAdded: new Date(updatedNote.dateAdded).toLocaleString('en-US', { hour12: true }),
                dateUpdated: new Date(updatedNote.dateUpdated).toLocaleString('en-US', { hour12: true })
            };    
        res.json(meridiemTimes);
        }
    } catch (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//TODO - Delete a Note with noteId
//http://localhost:8086/notes/:noteId
router.delete('/notes/:noteId', async (req, res) => {
    try {
        const noteId = req.params.noteId;

        const deletedNote = await noteModel.findByIdAndDelete(noteId);

        // Check if the note was found and deleted
        if (!deletedNote) {
            return res.status(404).send("No Note Found");
        }else{
        res.status(200).send("Note deleted successfully");
        }
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;


