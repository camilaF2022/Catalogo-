import React, { useState, useEffect } from "react";
import { Box, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const CatalogPagination = ({ items, setDisplayedItems }) => {
  const itemsPerPage = 6; // Set the number of items per page
  const totalItems = items.length; // Get the total number of items
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate the total number of pages

  const [currentPage, setCurrentPage] = useState(1); // Set the current page initially to 1

  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate the start index of the items to display
  const endIndex = startIndex + itemsPerPage; // Calculate the end index of the items to display
  const displayedItems = items.slice(startIndex, endIndex); // Get the items to display on the current page

  const handlePageChange = (_, page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  // Initialize the pagination state with the search params
  useEffect(() => {
    const page = searchParams.get("page")
      ? parseInt(decodeURIComponent(searchParams.get("page")))
      : 1;
    setPagination({ ...pagination, currentPage: page });
    setUpdateParamsFlag(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the URL when the current page changes
  useEffect(() => {
    if (!updateParamsFlag) {
      return;
    }
    searchParams.set("page", currentPage);
    setSearchParams(searchParams);
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

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

export default CatalogPagination;
