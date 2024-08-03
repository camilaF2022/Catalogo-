import React, { useState, useEffect } from "react";
import { Box, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";

/**
 * The CatalogPagination component provides pagination controls for navigating through catalog pages.
 * It allows users to change the current page and updates the URL accordingly.
 * @param {object} pagination - The current pagination state containing currentPage and totalPages.
 * @param {function} setPagination - Function to update the pagination state.
 * @returns {JSX.Element} Component for pagination controls.
 */
const CatalogPagination = ({ pagination, setPagination }) => {
  const { currentPage, totalPages } = pagination;

  // Search params from the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Avoid updating the URL when the component mounts and there are search params already
  const [updateParamsFlag, setUpdateParamsFlag] = useState(false);

/**
   * Updates the currentPage state when the page changes.
   * @param {object} event - The event object from the Pagination component.
   * @param {number} page - The selected page number.
   */
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
