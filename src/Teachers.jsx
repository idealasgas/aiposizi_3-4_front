import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import WarningAlert from './WarningAlert'

function Teachers(props) {
  const [teachers, setTeachers] = useState(JSON.parse(props.teachers));
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    axios.get(process.env.REACT_APP_TEACHERS_INDEX)
    .then(res => {
      setTeachers(res.data);
    });
  }, [modalShow]);

  const handleChange = () => {
    axios.get(process.env.REACT_APP_TEACHERS_INDEX)
    .then(res => {
      setTeachers(res.data);
    });
  };

  return(
    <Container>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add teacher
      </Button>
      <AddNewTeacherModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Table borderless striped hover>
        <thead>
          <tr>
            <th scope="col">name</th>
            <th scope="col">surname</th>
            <th scope="col">subject</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(function(teacher, key) {
            return (
              <tr key={key}>
                <td>{teacher['name']}</td>
                <td>{teacher['surname']}</td>
                <td>{teacher['subject']}</td>
                <td><EditButton onChange={handleChange} id={teacher['id']} name={teacher['name']} surname={teacher['surname']} subject={teacher['subject']} /></td>
                <td><DestroyButton onChange={handleChange} id={teacher['id']} /></td>
              </tr>)
          })}
        </tbody>
      </Table>
    </Container>
  );
}

function DestroyButton(props) {
  function deleteTeacher() {
    axios.delete(process.env.REACT_APP_TEACHERS_PREFIX+props.id+'.json')
    .then(res => {
      console.log(res.data);
      props.onChange();
    });
  }

  return(
    <Button variant='danger' onClick={deleteTeacher}>delete</Button>
  );
}

function EditButton(props) {
  const [modalShow, setModalShow] = useState(false);

  return(
    <div>
      <EditTeacherModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          id={props.id}
          name={props.name}
          surname={props.surname}
          subject={props.subject}
          onChange={props.onChange}
        />
      <Button variant="primary" onClick={() => setModalShow(true)}>
        edit
      </Button>
     </div>
  );
}

function EditTeacherModal(props) {
  const [name, setName] = useState(props.name);
  const [surname, setSurname] = useState(props.surname);
  const [subject, setSubject] = useState(props.subject);

  function editTeacher() {
    axios.patch(process.env.REACT_APP_TEACHERS_PREFIX+props.id+'.json', {
      teacher: {
        name: name,
        surname: surname,
        subject: subject
      }
    }).then(res => {
      console.log(res.data);
      props.onChange();
      props.onHide();
    })
  }

  function nameChange(event) {
    setName(event.target.value);
  }

  function surnameChange(event) {
    setSurname(event.target.value);
  }

  function subjectChange(event) {
    setSubject(event.target.value);
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
          Edit teacher
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
            placeholder="Subject"
            value={subject}
            onChange={subjectChange}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={editTeacher}>Edit</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>);
}

function AddNewTeacherModal(props) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');

  function addNewTeacher() {
    setError('');
    if (name === '' || surname === '') {
      setError('name and surname fields should be filled');
    } else {
      axios.post(process.env.REACT_APP_TEACHERS_INDEX, {
        teacher: {
          name: name,
          surname: surname,
          subject: subject
        }
      })
      .then(function (response) {
        console.log(response);
        setName('');
        setSurname('');
        setSubject('');
        props.onHide();
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

  function subjectChange(event) {
    setSubject(event.target.value);
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
          Add new teacher
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
            placeholder="Subject"
            value={subject}
            onChange={subjectChange}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={addNewTeacher}>Add</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Teachers;
