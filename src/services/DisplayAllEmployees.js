import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FetchEmployee({ emp, setEmp }) {
const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://localhost:7237/api/Employee/GetAllEmployees"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setEmp(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleButtonClick = (employee) => {
    if(employee.position.toLowerCase() === 'manager'){
      navigate(`/manager/${employee.id}`);
    }
    else
      navigate(`/employee/${employee.id}`);
  };

  return (
    <>
      <div className="employee-list">
        <h2 className="mx-2 my-2 px-2 py-2">All Employees</h2>
          {emp.map((e) => (
            <div className="mx-3 my-3">
            <button className="btn btn-outline-info" key={e.id} onClick={() => handleButtonClick(e)} >
              {e.name}
            </button>
            </div>
          ))}
      </div>
    </>
  );
}
