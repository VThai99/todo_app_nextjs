import moment from "moment/moment";
import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Container,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import ModalAddNew from "../../components/ModalAddNew";
import ModalConfirm from "../../components/ModalConfirm";
import ModalEditTodo from "../../components/ModalEditTodo";
import PaginationCustom from "../../components/PaginationCustom";
import {
  createTodo,
  deleteTodo,
  getListTodo,
  updateTodo,
} from "../../service/todoAPI";
import { ToastContainer, toast } from "react-toastify";

export default function Todo() {
  const [show, setShow] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState({
    isShow: false,
    idEdit: "",
    initData: "",
  });
  const [isShowDelete, setIsShowDelete] = useState({
    isShow: false,
    idDelete: "",
  });
  const handleCloseDelete = () =>
    setIsShowDelete({ isShow: false, idDelete: "" });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseEdit = () =>
    setShowModalEdit({ isShow: false, idEdit: "", initData: "" });
  const [pageNumber, setPageNumber] = useState(1);
  const { trigger: triggerCreate } = useSWRMutation("api/todos", createTodo, {
    onSuccess: () => {
      setShow(false);
      mutate(`api/todos?page=${pageNumber}`);
      toast.success("Create Success");
    },
  });

  const { trigger: triggerDelete } = useSWRMutation(
    `api/todos/delete`,
    deleteTodo,
    {
      onSuccess: () => {
        handleCloseDelete();
        mutate(`api/todos?page=${pageNumber}`);
        toast.success("Delete Success");
      },
    }
  );

  const { trigger: triggerUpdate } = useSWRMutation(
    `api/todos/update`,
    updateTodo,
    {
      onSuccess: () => {
        handleCloseEdit();
        mutate(`api/todos?page=${pageNumber}`);
        toast.success("Update Success");
      },
    }
  );

  const {
    data: dataList,
    error: errorList,
    isLoading: isLoadingList,
  } = useSWR(`api/todos?page=${pageNumber}`, () => getListTodo(pageNumber));
  if (isLoadingList) {
    return (
      <div className="loading">
        <Spinner animation="border" />
      </div>
    );
  }
  if (errorList) {
    return <div>Error</div>;
  }

  const renderTooltip = (props) => <Tooltip {...props}>{props.title}</Tooltip>;

  const handleAdd = async (value) => {
    triggerCreate(value);
  };

  const handleConfirm = () => {
    triggerDelete({ id: isShowDelete.idDelete });
  };

  const handleEdit = async (value) => {
    triggerUpdate({ id: showModalEdit.idEdit, param: value });
  };
  return (
    <>
      <Container className="my-5 text-center">
        <h1>Todo Lists</h1>
        <div className="addNewSection">
          <Button onClick={handleShow}>New Todo</Button>
        </div>
        <Table striped="columns" className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Tittle</th>
              <th>Created Date</th>
              <th>Last Modify Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList?.data.todos?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                  <td>{moment(item.updatedAt).format("MM-DD-YYYY")}</td>
                  <td className="actionStyle">
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip({ title: "View" })}
                    >
                      <Link href={`/todos/${item.id}`}>
                        <Button variant="primary">
                          <AiFillEye />
                        </Button>
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip({ title: "Edit" })}
                    >
                      <Button
                        variant="info"
                        onClick={() => {
                          setShowModalEdit({
                            isShow: true,
                            idEdit: item.id,
                            initData: item.title,
                          });
                        }}
                      >
                        <AiFillEdit />
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip({ title: "Delete" })}
                    >
                      <Button
                        variant="danger"
                        onClick={() =>
                          setIsShowDelete({ isShow: true, idDelete: item.id })
                        }
                      >
                        <AiFillDelete />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <PaginationCustom
          totalPages={dataList?.data.meta?.totalPages ?? 1}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
        <ModalAddNew
          show={show}
          handleClose={handleClose}
          handleAdd={handleAdd}
        />
        <ModalEditTodo
          show={showModalEdit.isShow}
          handleClose={handleCloseEdit}
          handleEdit={handleEdit}
          initData={showModalEdit.initData}
        />
        <ModalConfirm
          show={isShowDelete.isShow}
          handleClose={handleCloseDelete}
          handleConfirm={handleConfirm}
        />
        <ToastContainer />
      </Container>
    </>
  );
}
