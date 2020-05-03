import React from 'react';
import Alert from 'react-bootstrap/Alert'

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

export default WarningAlert;
