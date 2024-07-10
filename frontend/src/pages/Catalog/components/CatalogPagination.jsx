import React, { useState, useEffect } from "react";
import { Box, Pagination } from "@mui/material";
import { useSearchParams } from "react-router-dom";

/**
 * Component for handling pagination in the artifact catalog.
 * Manages current page state and updates URL params accordingly.
 *
 * @param {Object} pagination - Current pagination state.
 * @param {Function} setPagination - Function to update pagination state.
 */
const CatalogPagination = ({ pagination, setPagination }) => {
  const { currentPage, totalPages } = pagination;

  // Search params from the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Flag to avoid updating URL params when component mounts
  const [updateParamsFlag, setUpdateParamsFlag] = useState(false);

  /**
   * Updates the pagination state when the page changes.
   *
   * @param {Object} _ - Event object (not used).
   * @param {number} page - The new page number.
   */
  const handlePageChange = (_, page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  // Initialize the pagination state with the search params from the URL
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
