import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import WarningAlert from './WarningAlert'

function Groups(props) {
  const [groups, setGroups] = useState(JSON.parse(props.groups));
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    axios.get(process.env.REACT_APP_GROUPS_INDEX)
    .then(res => {
      setGroups(res.data);
    });
  }, [modalShow]);

  const handleChange = () => {
    axios.get(process.env.REACT_APP_GROUPS_INDEX)
    .then(res => {
      setGroups(res.data);
    });
  };

  return(
    <Container>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add group
      </Button>
      <AddNewGroupModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Table borderless striped hover>
        <thead>
          <tr>
            <th scope="col">name</th>
            <th scope="col">teacher</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {groups.map(function(group, key) {
            return (
              <tr key={group['id']}>
                <td><ShowButton text={group['name']} id={group['id']} /></td>
                <td>{group['teacher']}</td>
                <td><EditButton onChange={handleChange} id={group['id']} name={group['name']} teacher={group['teacher']} /></td>
                <td><DestroyButton onChange={handleChange} id={group['id']} /></td>
              </tr>)
          })}
        </tbody>
      </Table>
    </Container>
  );
}

function ShowButton(props) {
  const [modalShow, setModalShow] = useState(false);
  const [students, setStudents] = useState([]);

  function showGroup() {
    axios.get(process.env.REACT_APP_GROUPS_PREFIX+props.id+'.json')
    .then(res => {
      setStudents(res.data);
      setModalShow(true);
    });
  }

  return(
    <div>
      <ShowGroupModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            students={students}
          />
      <Button variant="info" onClick={showGroup}>{props.text}</Button>
    </div>
  );
}

function ShowGroupModal(props) {
  return(
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Students of this group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless striped hover>
          <thead>
            <tr>
              <th scope="col">name</th>
              <th scope="col">surname</th>
            </tr>
          </thead>
          <tbody>
            {props.students.map(function(student, key) {
              return (
                <tr key={key}>
                  <td>{student['name']}</td>
                  <td>{student['surname']}</td>
                </tr>)
            })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function DestroyButton(props) {
  function deleteGroup() {
    axios.delete(process.env.REACT_APP_GROUPS_PREFIX+props.id+'.json')
    .then(res => {
      props.onChange();
    });
  }

  return(
    <Button variant='danger' onClick={deleteGroup}>delete</Button>
  );
}

function EditButton(props) {
  const [modalShow, setModalShow] = useState(false);

  return(
    <div>
      <EditGroupModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          id={props.id}
          name={props.name}
          teacher={props.teacher}
          onChange={props.onChange}
        />
      <Button variant="primary" onClick={() => setModalShow(true)}>
        edit
      </Button>
     </div>
  );
}

function EditGroupModal(props) {
  const [name, setName] = useState(props.name);
  const [teacher, setTeacher] = useState(props.teacher);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_TEACHERS_INDEX)
    .then(res => {
      setTeachers(res.data);
    })
  }, []);

  function editGroup() {
    axios.patch(process.env.REACT_APP_GROUPS_PREFIX+props.id+'.json', {
      group: {
        name: name,
        teacher_id: teacher
      }
    }).then(res => {
      props.onChange();
      props.onHide();
    })
  }

  function nameChange(event) {
    setName(event.target.value);
  }

  function teacherChange(event) {
    let selected = event.target.selectedIndex
    let teacherID = event.target.options[selected].dataset.id;
    let id = (teacherID === undefined ? '' : teacherID);
    setTeacher(id);
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
          Edit group
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
          <Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Teacher</Form.Label>
              <Form.Control as="select" onChange={teacherChange} custom>
                <option></option>
                {teachers.map(function(teacher, key) {
                  return (
                    <option data-id={teacher['id']} key={teacher['id']}>{teacher['name']} {teacher['surname']}</option>)
                })}
              </Form.Control>
            </Form.Group>
          </Form>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={editGroup}>Edit</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>);
}

function AddNewGroupModal(props) {
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_TEACHERS_INDEX)
    .then(res => {
      setTeachers(res.data);
    })
  }, []);

  function addNewGroup() {
    setError('');
    if (name === '') {
      setError('name field should be filled');
    } else {
      axios.post(process.env.REACT_APP_GROUPS_INDEX, {
        group: {
          name: name,
          teacher_id: teacher
        }
      })
      .then(function (response) {
        setName('');
        setTeacher('');
        props.onHide();
      });
    }
  }

  function nameChange(event) {
    setName(event.target.value);
  }

  function teacherChange(event) {
    let selected = event.target.selectedIndex
    let teacherID = event.target.options[selected].dataset.id;
    let id = (teacherID === undefined ? '' : teacherID);
    setTeacher(id);
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
          Add new group
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
        <Form>
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Label>Teacher</Form.Label>
              <Form.Control as="select" onChange={teacherChange} custom>
                <option></option>
                {teachers.map(function(teacher, key) {
                  return (
                    <option data-id={teacher['id']} key={teacher['id']}>{teacher['name']} {teacher['surname']}</option>)
                })}
              </Form.Control>
            </Form.Group>
          </Form>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={addNewGroup}>Add</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Groups;
