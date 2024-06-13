import React from "react";
import { Box, Pagination } from "@mui/material";

const CustomPagination = ({ pagination, setPagination }) => {
  const { currentPage, totalPages } = pagination;

  const handlePageChange = (_, page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <Box display="flex" justifyContent="center" p={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </Box>
  );
};

export default CustomPagination;
