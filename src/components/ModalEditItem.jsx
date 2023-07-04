import { Formik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
function ModalEditItem(props) {
  const { handleClose, show, handleEdit, initData } = props;
  const AddSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    checked: Yup.boolean(),
  });
  return (
    <Modal show={show} onHide={handleClose}>
      <Formik
        initialValues={{
          checked: initData.checked,
          name: initData.name,
        }}
        validationSchema={AddSchema}
        onSubmit={(values) => {
          handleEdit(values);
        }}
        render={({ values, errors, handleChange, touched, handleSubmit }) => (
          <Form
            className="p-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Todo Item</Modal.Title>
            </Modal.Header>
            <Form.Group as={Row} className="my-3">
              <Col sm={12} as={Row}>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    onChange={handleChange}
                    name={`name`}
                    value={values.name}
                  />
                  {errors.name ? (
                    <p className="text-danger">{errors.name}</p>
                  ) : null}
                </Col>
                <Col sm={3} className="checkStyle">
                  <Form.Check
                    label="Check"
                    checked={values.checked}
                    name={`checked`}
                    onChange={handleChange}
                  />
                </Col>
              </Col>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Modal.Footer>
          </Form>
        )}
      />
    </Modal>
  );
}

export default ModalEditItem;
