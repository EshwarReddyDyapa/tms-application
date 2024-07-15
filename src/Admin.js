import React, { useState, useEffect } from "react";

const AdminReport = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch("https://localhost:7237/api/TaskManagement/GetAdminReport");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="admin-report-container">
      <div className="admin-header">
        <h1>Admin Report</h1>
      </div>
      {reportData.map((item, index) => {
        const dueDate = new Date(item.taskDueDate);
        const currentDate = new Date();
        const isExpired = !item.taskIsCompleted && dueDate < currentDate;
        
        return (
          <div
            key={index}
            className={`report-item ${item.taskIsCompleted ? 'completed-task' : ''} ${isExpired ? 'expired-task' : ''}`}>
            <h2>{item.employeeName}</h2>
            <p><strong>Manager:</strong> {item.managerName}</p>
            <ul>
              <li><strong>Task Title:</strong> {item.taskTitle}</li>
              <li><strong>Task Description:</strong> {item.taskDescription}</li>
              <li><strong>Due Date:</strong> {dueDate.toLocaleDateString()}</li>
              <li><strong>Completed:</strong> {item.taskIsCompleted ? "Yes" : "No"}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default AdminReport;
