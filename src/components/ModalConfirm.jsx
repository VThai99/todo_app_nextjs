import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
function ModalConfirm(props) {
  const { handleClose, show, handleConfirm } = props;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Do you want to delete?</h3>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfirm;
