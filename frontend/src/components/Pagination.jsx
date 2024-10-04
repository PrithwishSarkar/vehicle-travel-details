import React from "react";
import { HStack, Button } from "@chakra-ui/react";

const Pagination = ({
  rowsPerPage,
  totalRows,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <HStack spacing={2} width="100%" justify="center" px={4}>
      <Button
        variant="ghost"
        border="1px solid gray"
        onClick={() => paginate(currentPage - 1)}
        isDisabled={currentPage === 1}
        flex="1"
        maxW="50px"
      >
        {"<"}
      </Button>

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          onClick={() => paginate(page)}
          variant="ghost"
          border={currentPage === page ? "1px solid blue" : "1px solid gray"}
          color={currentPage === page ? "blue" : "gray"}
          flex="1"
          maxW="50px"
        >
          {page}
        </Button>
      ))}

      <Button
        variant="ghost"
        border="1px solid gray"
        onClick={() => paginate(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        flex="1"
        maxW="50px"
      >
        {">"}
      </Button>
    </HStack>
  );
};

export default Pagination;
