import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Students from './Students'
import Teachers from './Teachers';
import Classrooms from './Classrooms';
import Groups from './Groups';

function App() {
  const [topic, setTopic] = useState('home');
  const [items, setItems] = useState([]);

  function showStudents(e){
    e.preventDefault();
    axios.get(process.env.REACT_APP_STUDENTS_INDEX)
    .then(res => {
      let students = JSON.stringify(res.data);
      console.log(res.data);
      setItems(students);
      setTopic('students');
    });
  }

  function showTeachers(e) {
    e.preventDefault();
    axios.get(process.env.REACT_APP_TEACHERS_INDEX)
    .then(res => {
      let teachers = JSON.stringify(res.data);
      console.log(res.data);
      setItems(teachers);
      setTopic('teachers');
    });
  }

  function showClassrooms(e) {
    e.preventDefault();
    axios.get(process.env.REACT_APP_CLASSROOMS_INDEX)
    .then(res => {
      let classrooms = JSON.stringify(res.data);
      console.log(res.data);
      setItems(classrooms);
      setTopic('classrooms');
    });
  }

  function showGroups(e) {
    e.preventDefault();
    axios.get(process.env.REACT_APP_GROUPS_INDEX)
    .then(res => {
      let groups = JSON.stringify(res.data);
      console.log(res.data);
      setItems(groups);
      setTopic('groups');
    })
  }

  function switchTopic() {
    switch(topic) {
      case 'home': return <Home />;
      case 'students': return <Students students={items} />;
      case 'teachers': return <Teachers teachers={items} />;
      case 'classrooms': return <Classrooms classrooms={items} />;
      case 'groups': return <Groups groups={items} />;
    }
  }

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand><Button variant='light' onClick={() => setTopic('home')}>School</Button></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Button variant='outline-warning' onClick={showStudents}>Students</Button>
            <Button variant='outline-danger' onClick={showTeachers}>Teachers</Button>
            <Button variant='outline-info' onClick={showGroups}>Groups</Button>
            <Button variant='outline-primary' onClick={showClassrooms}>Classrooms</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {switchTopic()}
    </div>
  );
}

function Home() {
  return(
    <div>Здравствуйте.</div>
  );
}

export default App;
