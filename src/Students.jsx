import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'

function Students(props) {
  const [students, setStudents] = useState(JSON.parse(props.students));
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/students.json')
    .then(res => {
      setStudents(res.data);
    });
  }, [modalShow]);

  const handleChange = () => {
    axios.get('http://localhost:3001/students.json')
    .then(res => {
      setStudents(res.data);
    });
  };

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
                <td><EditButton id={student['id']} name={student['name']} surname={student['surname']} group={student['group']} /></td>
                <td><DestroyButton onChange={handleChange} id={student['id']} /></td>
              </tr>)
          })}
        </tbody>
      </Table>
    </Container>
  );
}

function DestroyButton(props) {
  function deleteStudent() {
    axios.delete('http://localhost:3001/students/'+props.id+'.json')
    .then(res => {
      console.log(res.data);
      props.onChange();
    });
  }

  return(
    <Button variant='danger' onClick={deleteStudent}>delete</Button>
  );
}

function EditButton(props) {
  const [modalShow, setModalShow] = useState(false);

  return(
    <div>
      <EditStudentModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          id={props.id}
          name={props.name}
          surname={props.surname}
          group={props.group}
        />
      <Button variant="primary" onClick={() => setModalShow(true)}>
        edit
      </Button>
     </div>
  );
}

function EditStudentModal(props) {
  const [name, setName] = useState(props.name);
  const [surname, setSurname] = useState(props.surname);
  const [group, setGroup] = useState((props.name === null ? '' : props.group));

  function editStudent() {
    axios.patch('http://localhost:3001/students/'+props.id+'.json', {
      student: {
        name: name,
        surname: surname,
        group_name: group
      }
    }).then(res => {
      console.log(res.data);
    })
  }

  function nameChange(event) {
    setName(event.target.value);
  }

  function surnameChange(event) {
    setSurname(event.target.value);
  }

  function groupChange(event) {
    setGroup(event.target.value);
  }

  return(
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit student
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Name"
            onChange={nameChange}
            value={name}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Surname"
            value={surname}
            onChange={surnameChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Group"
            value={group}
            onChange={groupChange}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={editStudent}>Edit</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>);
}

function AddNewStudentModal(props) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');

  function addNewStudent() {
    setError('');
    if (name === '' || surname === '') {
      setError('name and surname fields should be filled');
    } else {
      axios.post('http://localhost:3001/students.json', {
        student: {
          name: name,
          surname: surname,
          group_name: group
        }
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  function nameChange(event) {
    setName(event.target.value);
  }

  function surnameChange(event) {
    setSurname(event.target.value);
  }

  function groupChange(event) {
    setGroup(event.target.value);
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
      <WarningAlert error={error} />
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Name"
            onChange={nameChange}
            value={name}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Surname"
            value={surname}
            onChange={surnameChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Group"
            value={group}
            onChange={groupChange}
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

function WarningAlert(props) {
  if (props.error !== '') {
    return(
      <Alert variant="warning">
        {props.error}
      </Alert>
    );
  } else {
    return (<div></div>)
  }
}

export default Students;
