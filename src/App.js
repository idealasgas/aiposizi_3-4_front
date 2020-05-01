import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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
      case 'students': return <Students data={items}/>;
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

function Students(props) {
  const [action, setAction] = useState('index');

  function renderAction() {
    switch(action) {
      case 'index':
        return <StudentsIndex students={props.data} />;
    }
  }

  return(
    <div>{renderAction()}</div>
  );
}

function StudentsIndex(props) {
  const [students, setStudents] = useState(JSON.parse(props.students));
  const [modalShow, setModalShow] = useState(false);

  return(
    <Container>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add student
      </Button>

      <AddNewStudentModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Table borderless striped hover>
        <thead>
          <tr>
            <th scope="col">name</th>
            <th scope="col">surname</th>
            <th scope="col">group</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {students.map(function(student, key) {
            return (
              <tr key={key}>
                <td>{student['name']}</td>
                <td>{student['surname']}</td>
                <td>{student['group']}</td>
              </tr>)
          })}
        </tbody>
      </Table>
    </Container>
  );
}

function AddNewStudentModal(props) {
  function addNewStudent() {
    console.log('add new student')
  }

  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new student
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Name"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Surname"
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Group"
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={addNewStudent}>Add</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Home() {
  return(
    <div>Ето у нас главный экран, здравствуйте.</div>
  );
}

export default App;
