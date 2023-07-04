import { FieldArray, Formik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { AiFillDelete } from "react-icons/ai";
import * as Yup from "yup";
function ModalAddNew(props) {
  const { handleClose, show, handleAdd } = props;
  const AddSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    TodoItems: Yup.array()
      .min(1, "Minimum of 1 action")
      .of(
        Yup.object().shape({
          name: Yup.string().required("Name is required"),
          checked: Yup.boolean(),
        })
      ),
  });
  return (
    <Modal show={show} onHide={handleClose}>
      <Formik
        initialValues={{
          title: "",
          TodoItems: [{ checked: false, name: "" }],
        }}
        validationSchema={AddSchema}
        onSubmit={(values) => {
          handleAdd(values);
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
              <Modal.Title>New Todo</Modal.Title>
            </Modal.Header>
            <Form.Group className="mb-3" controlId="formGroupTodo">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={values.title}
                onChange={handleChange}
                isValid={touched.title && !errors.title}
              />
              {errors.title ? (
                <p className="text-danger">{errors.title}</p>
              ) : null}
            </Form.Group>
            <FieldArray
              name="TodoItems"
              render={(arrayHelpers) => (
                <div>
                  {values.TodoItems?.length > 0 &&
                    values.TodoItems.map((item, index) => {
                      return (
                        <Form.Group as={Row} className="mb-3" key={index}>
                          <Col sm={12} as={Row}>
                            <Col sm={9}>
                              <Form.Control
                                type="text"
                                placeholder="Enter name"
                                onChange={handleChange}
                                name={`TodoItems[${index}].name`}
                                value={item.name}
                              />
                              {errors.TodoItems?.[index]?.name ? (
                                <p className="text-danger">
                                  {errors.TodoItems?.[index]?.name}
                                </p>
                              ) : null}
                            </Col>
                            <Col sm={2} className="checkStyle">
                              <Form.Check
                                label="Check"
                                checked={item.checked}
                                name={`TodoItems[${index}].checked`}
                                onChange={handleChange}
                              />
                            </Col>
                            <Col sm={1} className="checkStyle">
                              <AiFillDelete
                                color="red"
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                }}
                              />
                            </Col>
                          </Col>
                        </Form.Group>
                      );
                    })}
                  <Button
                    onClick={() =>
                      arrayHelpers.push({ name: "", checked: false })
                    }
                  >
                    Add
                  </Button>
                </div>
              )}
            />
            {!Array.isArray(errors.TodoItems) ? (
              <p className="text-danger">{errors.TodoItems}</p>
            ) : null}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        )}
      />
    </Modal>
  );
}

export default ModalAddNew;
