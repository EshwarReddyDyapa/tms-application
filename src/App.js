import React, { useState } from "react";
import DisplayAllEmployees from "./services/DisplayAllEmployees";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import EmployeeDetail from "./services/EmployeeDetail";
import ManagerDetail from "./services/ManagerDetail";
import Admin from "./Admin";

function Navigate() {
  return (
    <div className="container-fluid header">
      <nav className="navbar">
        <Link className="navbar-brand ms-5" to="/">
          Home
        </Link>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <Link class="nav-link ms-4" to="/admin">
              Admin Page
            </Link>
          </li>
        </ul>
        <div className="page-routes me-4"></div>
      </nav>
    </div>
  );
}

function App() {
  const [data, setData] = useState([]);

  return (
    <>
      <Navigate />
      <div className="container main-content">
        <Routes>
          <Route
            path="/"
            element={<DisplayAllEmployees emp={data} setEmp={setData} />}
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/employee/:id" element={<EmployeeDetail />} />
          <Route path="/manager/:id" element={<ManagerDetail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
