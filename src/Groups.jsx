import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'

function Groups(props) {
  const [groups, setGroups] = useState(JSON.parse(props.groups));
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/groups.json')
    .then(res => {
      setGroups(res.data);
    });
  }, [modalShow]);

  const handleChange = () => {
    axios.get('http://localhost:3001/groups.json')
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
                <td>{group['name']}</td>
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

function DestroyButton(props) {
  function deleteGroup() {
    axios.delete('http://localhost:3001/groups/'+props.id+'.json')
    .then(res => {
      console.log(res.data);
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

  function editGroup() {
    axios.patch('http://localhost:3001/groups/'+props.id+'.json', {
      group: {
        name: name,
        teacher: teacher
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
          <FormControl
            placeholder="Teacher"
            value={teacher}
            onChange={teacherChange}
          />
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
    axios.get('http://localhost:3001/teachers.json')
    .then(res => {
      setTeachers(res.data);
    })
  }, []);

  function addNewGroup() {
    setError('');
    if (name === '') {
      setError('name field should be filled');
    } else {
      axios.post('http://localhost:3001/groups.json', {
        group: {
          name: name,
          teacher_id: teacher
        }
      })
      .then(function (response) {
        console.log(response);
        setName('');
        setTeacher('');
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

export default Groups;
