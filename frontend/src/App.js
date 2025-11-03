import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuUser from "./pages/MenuUser";
import MenuAdmin from "./pages/MenuAdmin";
import Tables from "./pages/Tables";
import Dashboard from "./pages/Dashboard";
import ManageTables from "./pages/ManageTables";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MenuUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Menu */}
        <Route path="/menu" element={<MenuUser />} />

        {/* Admin Menu */}
        <Route
          path="/admin/menu"
          element={
            <PrivateRoute requiredRole="ROLE_ADMIN">
              <MenuAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <PrivateRoute>
              <Tables />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="ROLE_ADMIN">
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-tables"
          element={
            <PrivateRoute requiredRole="ROLE_ADMIN">
              <ManageTables />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
