import { useEffect, useState } from "react";
import { useSnackBars } from "./useSnackbars";
import { useToken } from "./useToken";

// Custom hook to fetch items from an API based on filters and pagination
const useFetchItems = (baseUrl) => {

// Fetch authentication token from context using custom hook
  const { token } = useToken();
  
   // Access snack bar utility functions from custom hook
  const { addAlert } = useSnackBars();
  
  // State variables to manage loading state, filters, pagination, and fetched items
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    query: "",
    shape: "",
    culture: "",
    tags: [],
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    perPage: 0,
    totalPages: 0,
  });
  const [items, setItems] = useState([]);

  // Reset the current page when the filter changes
  useEffect(() => {
    setPagination({ ...pagination, currentPage: 1 });
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data from the API based on filter and pagination
  useEffect(() => {
    // Use setTimeout as debounce to avoid making a request on every keystroke
    const timeoutId = setTimeout(() => {
      let url = new URL(baseUrl);
      let params = {
        query: filter.query,
        shape: filter.shape,
        culture: filter.culture,
        tags: filter.tags.join(","),
        page: pagination.currentPage,
      };
      Object.keys(params).forEach(
        (key) => params[key] && url.searchParams.append(key, params[key])
      );
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          const {
            current_page: currentPage,
            per_page: perPage,
            total_pages: totalPages,
            total,
            data,
          } = response;
          // Update pagination and items state with fetched data
          setPagination({ currentPage, total, perPage, totalPages });
          setItems(data);
        })
        .catch((error) => {
         // Handle error and display alert using snack bar utility
          addAlert(error.message);
        })
        .finally(() => setLoading(false));
    }, 500); // delay of 500ms

    return () => clearTimeout(timeoutId); // cleanup on unmount or filter change
  }, [filter, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

// Return state variables and functions for external use
  return {
    items,         // Fetched items from API
    loading,       // Loading state
    filter,        // Current filter criteria
    setFilter,     // Function to update filter criteria
    pagination,    // Pagination information
    setPagination, // Function to update pagination information
  };
};

export default useFetchItems;
