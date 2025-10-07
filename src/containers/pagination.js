import { useState } from 'react';

const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1); // Reiniciar a la primera página cuando se cambia el número de filas
  };

  return {
    page,
    limit,
    handleChangePage,
    handleChangeRowsPerPage
  };
};

export default usePagination;
