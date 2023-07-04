import Pagination from "react-bootstrap/Pagination";

function PaginationCustom(props) {
  const { totalPages, pageNumber, setPageNumber } = props;
  const ArrayPagination = new Array(totalPages).fill(0);
  return (
    <Pagination className="paginationStyle">
      <Pagination.First />
      <Pagination.Prev />
      {new Array(Number(totalPages)).fill(0)?.map((item, index) => {
        return (
          <Pagination.Item
            key={index}
            onClick={() => {
              setPageNumber(index + 1);
            }}
            active={pageNumber == index + 1}
          >
            {index + 1}
          </Pagination.Item>
        );
      })}

      <Pagination.Ellipsis />

      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
}

export default PaginationCustom;
