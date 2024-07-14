
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Notes from "./DisplayNote";
import { Modal, Button, Form } from "react-bootstrap";


const EmployeeTasks = () => {
  const [employees, setEmployees] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:7237/api/TaskManagement/GetEmpForManager/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <h1>Employee Tasks</h1>
      {employees.map((employee) => (
        <div key={employee.employeeId}>
          <h2>{employee.employeeName}</h2>
          <p><strong>Position:</strong> {employee.employeePosition}</p>
          <ul>
            {employee.tasks.map((task) => (
              <li key={task.taskId}>
                <h4>{task.taskTitle}</h4>
                <p>{task.taskDescription}</p>
                <p><strong>Due Date:</strong> {new Date(task.taskDueDate).toLocaleDateString()}</p>
                <p><strong>Completed:</strong> {task.taskIsCompleted ? "Yes" : "No"}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTasks;
