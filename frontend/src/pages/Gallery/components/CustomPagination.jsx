import React, { useState, useEffect } from "react";
import { Box, Pagination } from "@mui/material";

/**
 * CustomPagination Component
 *
 * Component to handle pagination of items based on a specified number of items per page.
 *
 * @param {Array} items - List of items to be paginated.
 * @param {function} setDisplayedItems - Function to update the items displayed on the current page.
 */
const CustomPagination = ({ items, setDisplayedItems }) => {
  const itemsPerPage = 6; // Set the number of items per page
  const totalItems = items.length; // Get the total number of items
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate the total number of pages

  const [currentPage, setCurrentPage] = useState(1); // Set the current page initially to 1

  const startIndex = (currentPage - 1) * itemsPerPage; // Calculate the start index of the items to display
  const endIndex = startIndex + itemsPerPage; // Calculate the end index of the items to display
  const displayedItems = items.slice(startIndex, endIndex); // Get the items to display on the current page

  // Function to handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // Update the displayed items when the list or currentPage changes
  useEffect(() => {
    setDisplayedItems(displayedItems);
  }, [items, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset the current page to 1 when the list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box display="flex" justifyContent="center" p={2}>
      {/* Pagination component from Material-UI */}
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
