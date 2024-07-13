import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployeeData(id);
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

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employee-list">
      <h2 className="mx-2 mt-3">Employee Detail</h2>
      <div className="mx-2 my-2 px-3 py-3">
      <p>Name: {employee.name}</p>
      <p>Position: {employee.position}</p>
      <p>Manager: {employee.managerId}</p>
      </div>
    </div>
  );
}
