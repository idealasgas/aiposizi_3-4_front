import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Students from './Students'

function App() {
  const [topic, setTopic] = useState('home');
  const [items, setItems] = useState([]);

  function showStudents(e){
    e.preventDefault();
    axios.get('http://localhost:3001/students.json')
    .then(res => {
      let students = JSON.stringify(res.data);
      console.log(res.data);
      setItems(students);
      setTopic('students');
    });
  }

  function switchTopic() {
    switch(topic) {
      case 'home': return <Home />;
      case 'students': return <Students students={items}/>;
    }
  }

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">School</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <button onClick={showStudents}>Students</button>
            <Nav.Link href="#link">Teachers</Nav.Link>
            <Nav.Link href="#link">Groups</Nav.Link>
            <Nav.Link href="#link">Classrooms</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {switchTopic()}
    </div>
  );
}

function Home() {
  return(
    <div>Ето у нас главный экран, здравствуйте.</div>
  );
}

export default App;
