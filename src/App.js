import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import noteService from './Services/notes';

const Note = ({note})=>{
  return(<li>{note.content}</li>)
}

const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(()=>{
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const toggleImportantceOf = id =>{
    const note = notes.find(n=>n.id===id)
    const changedNote = {...note, important: !note.important}

    noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !==id ? note : returnedNote))
    })
    .catch(error =>{
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n=>n.id !==id))
    })
  }

  const addNote = event =>{
    event.preventDefault()
    const noteObject = {
      content:newNote,
      important:Math.random() < 0.5,
    }

    noteService
    .create(noteObject)
    .then(returnedNote =>{
      setNewNote(notes.concate(returnedNote))
      setNewNote('')
    })
  }

  const handleNoteChange = (event) =>{
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
  ? notes
  :notes.filter(note=>note.important===true)

  return (
    <div>
     <h1>Notes</h1>
     <div>
      <button onClick={()=>setShowAll(!showAll)}>
      show {showAll? 'important' : 'all'}
      </button>
     </div>
     <ul>
      {notesToShow.map(note =>
         <Note 
         key={note.id} 
         note = {note}
         toggleImportantce ={()=> toggleImportantceOf(note.id)}
         />
          )}
     </ul>
     <form onSubmit={addNote}>
      <input value={newNote} onChange = {handleNoteChange}/>
      <button type="submit">save</button>
     </form>
    </div>
  )
}

export default App;
