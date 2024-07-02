import { useEffect, useState } from "react";
import { useSnackBars } from "./useSnackbars";
import { useToken } from "./useToken";

const useFetchItems = (baseUrl) => {
  const { token } = useToken();
  const { addAlert } = useSnackBars();
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

  // Fetch data from the API
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
          setPagination({ currentPage, total, perPage, totalPages });
          setItems(data);
        })
        .catch((error) => {
          addAlert(error.message);
        })
        .finally(() => setLoading(false));
    }, 500); // delay of 500ms

    return () => clearTimeout(timeoutId); // cleanup on unmount or filter change
  }, [filter, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    items,
    loading,
    filter,
    setFilter,
    pagination,
    setPagination,
  };
};

export default useFetchItems;
