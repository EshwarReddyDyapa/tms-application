import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


export default function Notes({ taskId }) {
  const [task, setTask] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    content: "",
    pathToDoc: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editNotes, setEditNotes] = useState([]);

  useEffect(() => {
    fetchNotes(taskId);
  }, [taskId]);

  const fetchNotes = async (taskId) => {
    try {
      const response = await fetch(`https://localhost:7237/api/TaskManagement/GetNoteForTask/${taskId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      if (jsonData) {
        setTask(jsonData.task);
        setNotes(jsonData.notes);
        setEditNotes(jsonData.notes); // Ensure editNotes reflects the current state
      } else {
        // Handle case where jsonData is empty or undefined
        console.error("Empty response or invalid JSON data");
        setTask(null);
        setNotes([]);
        setEditNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      // Optionally, reset state to default values or handle error state
      setTask(null);
      setNotes([]);
      setEditNotes([]);
    }
  };
  

  const handleAddNote = async () => {
    try {
      const response = await fetch(`https://localhost:7237/api/Note/CreateNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          content: newNote.content, 
          pathToDoc: newNote.pathToDoc, 
          taskId 
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setNewNote({
        content: "",
        pathToDoc: "",
      });
      fetchNotes(taskId);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleEditNotes = async () => {
    try {
      await Promise.all(editNotes.map(note => 
        fetch(`https://localhost:7237/api/Note/UpdateNote/${note.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(note),
        })
      ));
      setIsEditMode(false);
      fetchNotes(taskId);
    } catch (error) {
      console.error("Error editing notes:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`https://localhost:7237/api/Note/DeleteNote/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // After deletion, fetch notes again to update the state
      fetchNotes(taskId);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleNoteChange = (id, field, value) => {
    setEditNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, [field]: value } : note
      )
    );
  };

  return (
    <div>
      {task && (
        <div>
          <h4>Task Details</h4>
          <p><strong>Task:</strong> {task.title}</p>
          <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
          <p><strong>Completed:</strong> {task.isCompleted ? "Yes" : "No"}</p>
        </div>
      )}
      <h4>Notes</h4>
      {notes.length > 0 ? (
        <ul>
          {notes.map((note, index) => (
            <li key={note.id}>
              {isEditMode ? (
                <div>
                  <Form.Control
                    type="text"
                    value={editNotes[index].content}
                    onChange={(e) => handleNoteChange(note.id, 'content', e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <p> {note.content}</p>
                  <Button className="btn-sm" variant="danger" onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notes available.</p>
      )}
      {isEditMode ? (
        <Button className="btn btn-info btn-sm my-2" onClick={handleEditNotes}>Save Notes</Button>
      ) : (
        <Button className="btn btn-info my-2" onClick={() => setIsEditMode(true)}>Edit Notes</Button>
      )}
      <div>
        <Form.Control
          type="text"
          name="content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          placeholder="Add a new note"
        />
        {/* Hide the pathToDoc field */}
        {/* <Form.Control
          type="text"
          name="pathToDoc"
          value={newNote.pathToDoc}
          onChange={(e) => setNewNote({ ...newNote, pathToDoc: e.target.value })}
          placeholder="Path to document"
        /> */}
        <Button className="btn btn-info my-2" onClick={handleAddNote}>Add Note</Button>
      </div>
    </div>
  );
}
