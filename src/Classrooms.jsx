import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'

function Classrooms(props) {
  const [classrooms, setClassrooms] = useState(JSON.parse(props.classrooms));
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/classrooms.json')
    .then(res => {
      setClassrooms(res.data);
    });
  }, [modalShow]);

  const handleChange = () => {
    axios.get('http://localhost:3001/classrooms.json')
    .then(res => {
      setClassrooms(res.data);
    });
  };

  return(
    <Container>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add classroom
      </Button>
      <AddNewClassroomModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Table borderless striped hover>
        <thead>
          <tr>
            <th scope="col">number</th>
            <th scope="col">teacher</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map(function(classroom, key) {
            return (
              <tr key={key}>
                <td>{classroom['number']}</td>
                <td>{classroom['teacher']}</td>
                <td><EditButton onChange={handleChange} id={classroom['id']} number={classroom['number']} teacher={classroom['teacher']} /></td>
                <td><DestroyButton onChange={handleChange} id={classroom['id']} /></td>
              </tr>)
          })}
        </tbody>
      </Table>
    </Container>
  );
}

function DestroyButton(props) {
  function deleteClassroom() {
    axios.delete('http://localhost:3001/classrooms/'+props.id+'.json')
    .then(res => {
      console.log(res.data);
      props.onChange();
    });
  }

  return(
    <Button variant='danger' onClick={deleteClassroom}>delete</Button>
  );
}

function EditButton(props) {
  const [modalShow, setModalShow] = useState(false);

  return(
    <div>
      <EditClassroomModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          id={props.id}
          number={props.number}
          teacher={props.teacher}
          onChange={props.onChange}
        />
      <Button variant="primary" onClick={() => setModalShow(true)}>
        edit
      </Button>
     </div>
  );
}

function EditClassroomModal(props) {
  const [number, setNumber] = useState(props.number);
  const [teacher, setTeacher] = useState(props.teacher);

  function editClassroom() {
    axios.patch('http://localhost:3001/classrooms/'+props.id+'.json', {
      classroom: {
        number: number,
        teacher: teacher
      }
    }).then(res => {
      console.log(res.data);
      props.onChange();
      props.onHide();
    })
  }

  function numberChange(event) {
    setNumber(event.target.value);
  }

  function teacherChange(event) {
    setTeacher(event.target.value);
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
          Edit classroom
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Number"
            onChange={numberChange}
            value={number}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Teacher"
            value={teacher}
            onChange={teacherChange}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={editClassroom}>Edit</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>);
}

function AddNewClassroomModal(props) {
  const [number, setNumber] = useState('');
  const [teacher, setTeacher] = useState('');
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/teachers.json')
    .then(res => {
      setTeachers(res.data);
    })
  }, []);

  function addNewClassroom() {
    setError('');
    if (number === '') {
      setError('number field should be filled');
    } else {
      axios.post('http://localhost:3001/classrooms.json', {
        classroom: {
          number: number,
          teacher: teacher
        }
      })
      .then(function (response) {
        console.log(response);
        setNumber('');
        setTeacher('');
        props.onHide();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  function numberChange(event) {
    setNumber(event.target.value);
  }

  function teacherChange(event) {
    setTeacher(event.target.value);
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
          Add new classroom
        </Modal.Title>
      </Modal.Header>
      <WarningAlert error={error} />
      <Modal.Body>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Number"
            onChange={numberChange}
            value={number}
          />
        </InputGroup>
        <InputGroup className="mb-3">
        <Form>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Teacher</Form.Label>
            <Form.Control as="select" custom>
              {teachers.map(function(teacher, key) {
                return (
                  <option key={key}>{teacher['name']} {teacher['surname']}</option>)
              })}
              <option></option>
            </Form.Control>
          </Form.Group>
        </Form>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={addNewClassroom}>Add</Button>
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

export default Classrooms;
