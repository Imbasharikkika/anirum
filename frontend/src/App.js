import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Team from "./pages/Team";
import Timetable from "./pages/Timetable";
import Chat from "./pages/Chat";
import CreateCity from "./pages/CreateCity";
import CreateGroup from "./pages/CreateGroup";
import City from "./pages/City/City";
import District from "./pages/District";
import Office from "./pages/Office";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";
import Test from "./pages/Group/Test";
import Address from "./pages/Address";
import Group from "./pages/Group/Group";
import CreateManager from "./pages/CreateManager";
import CreateTeacher from "./pages/CreateTeacher";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { AppWithAuth } from "./components/AuthContext";

function App() {
  return (
    <div className="App">
      <AppWithAuth>
        <div className="container">
          <div>
            <Header></Header>
          </div>
          <div className="container_2">
            <Sidebar></Sidebar>
            <div className="container_3">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route
                  path="/team/create-teacher"
                  element={<CreateTeacher />}
                />
                <Route
                  path="/team/create-manager"
                  element={<CreateManager />}
                />
                <Route path="/team" element={<Team />} />
                <Route path="/time-table" element={<Timetable />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/create-city" element={<CreateCity />} />
                <Route
                  path="/create-group/:id/:city"
                  element={<CreateGroup />}
                />
                <Route path="/district/:id" element={<District />} />
                <Route path="/office/:id/:city" element={<Office />} />
                <Route path="/city/:id" element={<City />} />
                <Route path="/group/:id" element={<Group />} />
                <Route path="/test/:id" element={<Test />} />
                <Route path="/address/:id/:city" element={<Address />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </div>
          </div>
        </div>
      </AppWithAuth>
    </div>
  );
}

export default App;
