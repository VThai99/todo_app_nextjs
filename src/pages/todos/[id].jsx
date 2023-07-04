import axios from "axios";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Button,
  Container,
  Form,
  OverlayTrigger,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import ModalAddNewItem from "../../components/ModalAddNewItem";
import ModalConfirm from "../../components/ModalConfirm";
import ModalEditItem from "../../components/ModalEditItem";
import {
  createTodoItem,
  deleteTodoItem,
  getListTodo,
  getTodo,
  updateTodoItem,
} from "../../service/todoAPI";
import { ToastContainer, toast } from "react-toastify";

export const getStaticPaths = async () => {
  const res = await getListTodo();

  const paths = res?.data.todos?.map((item) => ({
    params: { id: item.id.toString() },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const res = await getTodo(params?.id);
  const todo = res.data.todo;
  return {
    props: {
      title: todo?.title,
      todo,
    },
  };
};

export default function TodoDetail(props) {
  const { title, todo } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();
  const id = router.query.id;
  const baseUrl = process.env.NEXT_PUBLIC_APP_API_TODO;
  const domain = process.env.DOMAIN_SEO;
  const [showModalEdit, setShowModalEdit] = useState({
    isShow: false,
    idEdit: "",
    initData: "",
  });
  const handleCloseEdit = () =>
    setShowModalEdit({ isShow: false, idEdit: "", initData: "" });
  const [isShowDelete, setIsShowDelete] = useState({
    isShow: false,
    idDelete: "",
  });
  const handleCloseDelete = () =>
    setIsShowDelete({ isShow: false, idDelete: "" });

  const { trigger: triggerCreateItem } = useSWRMutation(
    `api/todos/${id}/todo-item`,
    createTodoItem,
    {
      onSuccess: () => {
        setShow(false);
        getTodoDetail();
        toast.success("Create Success");
      },
    }
  );

  const { trigger: triggerDelete } = useSWRMutation(
    `api/todos/deleteItem`,
    deleteTodoItem,
    {
      onSuccess: () => {
        handleCloseDelete();
        getTodoDetail();
        toast.success("Delete Success");
      },
    }
  );

  const { trigger: triggerUpdateItem } = useSWRMutation(
    `api/todoItem/update`,
    updateTodoItem,
    {
      onSuccess: () => {
        handleCloseEdit();
        getTodoDetail();
        toast.success("Update Success");
      },
    }
  );

  const {
    data: dataDetail,
    error: isErrorDetail,
    isLoading: isLoadingDetail,
    mutate: getTodoDetail,
  } = useSWR(
    `${baseUrl}/api/todos/${id}`,
    (url) => axios.get(url).then((res) => res.data),
    { initialData: todo }
  );
  if (isLoadingDetail) {
    return (
      <div className="loading">
        <Spinner animation="border" />
      </div>
    );
  }
  if (isErrorDetail) {
    return <div>Error</div>;
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleAdd = async (value) => {
    triggerCreateItem({ todoId: id, params: value });
  };

  const handleEdit = async (value) => {
    triggerUpdateItem({
      todoId: id,
      todoItemId: showModalEdit.idEdit,
      param: value,
    });
  };

  const handleConfirm = () => {
    triggerDelete({ todoItemId: isShowDelete.idDelete, todoId: id });
  };

  const handleChangeChecked = (itemId, itemChecked, itemName) => {
    triggerUpdateItem({
      todoId: id,
      todoItemId: itemId,
      param: { name: itemName, checked: !itemChecked },
    });
  };

  const renderTooltip = (props) => <Tooltip {...props}>{props.title}</Tooltip>;
  return (
    <>
      <Head>
        <title>{title} - Todo detail</title>
        <meta name="description" content={`Learn more about ${title}`} />
        <meta property="og:title" content={`${title} - The todo item detail`} />
        <meta
          property="og:description"
          content={`Learn more about ${title}, let's see all your actions and modify them`}
        />
        <meta property="og:url" content={`${domain}/todos/${id}`} />
        <meta property="og:type" content="website" />
      </Head>
      <Container className="my-5 text-center">
        <h1>{title}</h1>
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
            {dataDetail?.todo?.TodoItems?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Form.Check
                      checked={item.checked}
                      onClick={() =>
                        handleChangeChecked(item.id, item.checked, item.name)
                      }
                    />
                  </td>
                  <td
                    style={{
                      textDecoration: `${item.checked ? "line-through" : ""}`,
                    }}
                  >
                    {item.name}
                  </td>
                  <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                  <td>{moment(item.updatedAt).format("MM-DD-YYYY")}</td>
                  <td className="actionStyle">
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
                            initData: {
                              name: item.name,
                              checked: item.checked,
                            },
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
        <ModalAddNewItem
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          handleAdd={handleAdd}
        />
        <ModalEditItem
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
