import { Formik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
function ModalEditTodo(props) {
  const { handleClose, show, handleEdit, initData } = props;
  const AddSchema = Yup.object({
    title: Yup.string().required("Name is required"),
  });
  return (
    <Modal show={show} onHide={handleClose}>
      <Formik
        initialValues={{
          title: initData,
        }}
        validationSchema={AddSchema}
        onSubmit={(values) => {
          handleEdit(values);
        }}
        render={({ values, errors, handleChange, handleSubmit }) => (
          <Form
            className="p-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Todo</Modal.Title>
            </Modal.Header>
            <Form.Group as={Row} className="my-3">
              <Col sm={12} as={Row}>
                <Col sm={12}>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    onChange={handleChange}
                    name={`title`}
                    value={values.title}
                  />
                  {errors.title ? (
                    <p className="text-danger">{errors.title}</p>
                  ) : null}
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

export default ModalEditTodo;
