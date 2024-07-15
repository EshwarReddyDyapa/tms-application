import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Notes from "./DisplayNote";
import { Modal, Button, Form } from "react-bootstrap";

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    isCompleted: false,
    employeeId: id,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [visibleFileInput, setVisibleFileInput] = useState(null);

  useEffect(() => {
    fetchEmployeeData(id);
    fetchTasks(id);
  }, [id]);

  const fetchEmployeeData = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7237/api/Employee/GetEmployeeById/${id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setEmployee(jsonData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchTasks = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:7237/api/TaskManagement/GetTasksForUser/${id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      if (jsonData.length > 0) {
        setTasks(jsonData[0].tasks || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleShowModal = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const markTaskCompleted = async (taskId) => {
    try {
      const response = await fetch(
        `https://localhost:7237/api/TaskManagement/MarkTaskCompleted/${taskId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Fetch updated tasks after marking as completed
      fetchTasks(id);
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://localhost:7237/api/TasksForUser/CreateTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Fetch updated tasks after adding new task
      fetchTasks(id);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        isCompleted: false,
        employeeId: id,
      });
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (taskId) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("taskId", taskId);

    try {
      const response = await fetch(
        `https://localhost:7237/api/TaskManagement/UploadFile`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Fetch updated tasks after file upload
      fetchTasks(id);
      setVisibleFileInput(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCancelUpload = () => {
    setVisibleFileInput(null);
    setSelectedFile(null);
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="employee-list">
        <h2 className="mx-2 mt-3">Employee Detail</h2>
        <div className="mx-2 my-2 px-3 py-3">
          <p>
            <strong>Name: </strong> {employee.name}
          </p>
          <p>
            <strong>Position: </strong> {employee.position}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="container">
            <h3>Task Details for {employee.name}</h3>
            {tasks.length > 0 ? (
              <ul className="ps-0">
                {tasks.map((task) => (
                  <li key={task.id} className="list-item">
                    <div
                      className={`task-detail ${
                        task.isCompleted ? "completed" : ""
                      }`}
                    >
                      <div className="task-detail-item">
                        <h5>{task.title}</h5>
                        <p>{task.description}</p>
                        <p>
                          Due Date:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        <p>Completed: {task.isCompleted ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        {visibleFileInput === task.id ? (
                          <div>
                            <Form.Group controlId={`formFile${task.id}`}>
                              <Form.Control
                                type="file"
                                onChange={handleFileChange}
                              />
                            </Form.Group>
                            <Button
                              className="btn btn-sm btn-info mx-2 my-2"
                              onClick={() => handleFileUpload(task.id)}
                            >
                              Upload Files
                            </Button>
                            <Button
                              className="btn btn-sm btn-danger mx-2 my-2"
                              onClick={handleCancelUpload}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="btn btn-info mx-2 my-2"
                            onClick={() => setVisibleFileInput(task.id)}
                          >
                            Upload File
                          </Button>
                        )}
                        <Button
                          className="btn btn-info mx-2 my-2"
                          onClick={() => markTaskCompleted(task.id)}
                          disabled={task.isCompleted}
                        >
                          Mark as Completed
                        </Button>
                        <Button
                          className="btn btn-info mx-2 my-2"
                          onClick={() => handleShowModal(task)}
                        >
                          Show Notes
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks assigned.</p>
            )}
          </div>
        </div>
        <div className="col-md-6 add-task-container">
          <div className="container mt-4">
            <h3>Add New Task</h3>
            <Form onSubmit={handleAddTask}>
              <Form.Group controlId="formTaskTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleNewTaskChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTaskDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={newTask.description}
                  onChange={handleNewTaskChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formTaskDueDate">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleNewTaskChange}
                  required
                />
              </Form.Group>
              <Button type="submit" className="btn btn-secondary mt-3">
                Add Task
              </Button>
            </Form>
          </div>
        </div>
      </div>

      {/* Modal for Notes */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Notes for {currentTask?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Notes taskId={currentTask?.id} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
