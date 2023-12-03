/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

type UseTableProps<T> = {
  dataSource: string;
  /** A key used to identify row */
  rowIdentifier: keyof T;
};

type TableRow<T> = T & { isSelected: boolean; isEditable: boolean };

const ITEMS_PER_PAGE = 10;

const useTable = <T>({ dataSource, rowIdentifier }: UseTableProps<T>) => {
  const [tableData, setTableData] = useState<Array<TableRow<T>> | null>(null);

  const [error, setError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");

  const getFilteredData = () => {
    if (!searchInput || searchInput === "") return tableData;
    const filteredData = tableData!.filter((item) => {
      const lowercasedSearchInput = searchInput.toLowerCase().trim();
      const isMatch = Object.values(item).some((value) =>
        value.toString().toLowerCase().trim().includes(lowercasedSearchInput)
      );
      return isMatch;
    });
    return filteredData;
  };

  const search = (searchVal: string) => {
    setSearchInput(searchVal);
  };

  const totalItem = () => {
    if (!tableData) return 0;
    const data = getFilteredData();
    return data ? data.length : 0;
  };

  const totalPages = () => {
    if (!tableData) return 0;
    const data = getFilteredData();
    return Math.ceil(data.length / ITEMS_PER_PAGE);
  };

  const moveToOnePageUp = () => {
    if (currentPage === totalPages()) return;
    setCurrentPage(currentPage + 1);
  };

  const moveToOnePageDown = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const moveToFirstPage = () => {
    setCurrentPage(1);
  };

  const moveToLastPage = () => {
    setCurrentPage(totalPages());
  };

  const toggleRowSelection = (selectedId: string) => {
    if (!tableData) return;
    setTableData((previousData) => {
      if (!previousData) return null;
      return previousData.map((item) => {
        return {
          ...item,
          isSelected:
            item[rowIdentifier] === selectedId
              ? !item.isSelected
              : item.isSelected,
        };
      });
    });
  };

  const makeEditableRowSelection = (selectedId: string) => {
    if (!tableData) return;
    setTableData((previousData) => {
      if (!previousData) return null;
      return previousData.map((item) => {
        return {
          ...item,
          isEditable:
            item[rowIdentifier] === selectedId ? true : item.isEditable,
        };
      });
    });
  };

  const saveRowSection = (selectedId: string) => {
    if (!tableData) return;
    const newData = tableData.map((item) => {
      return {
        ...item,
        isEditable:
          item[rowIdentifier] === selectedId ? false : item.isEditable,
      };
    });
    setTableData(newData);
  };

  const togglePageSelection = () => {
    if (!tableData) return;

    const { start, end } = getPageRange();
    const filteredData = getFilteredData();
    // console.log(filteredData)

    const newData = filteredData.map((item, index) => {
      if (index >= start && index <= end) {
        return {
          ...item,
          isSelected: !isAllSelectedInPage(),
        };
      }
      return { ...item };
    });

    setTableData((previousData) => {
      if (!previousData) return null;
      return previousData.map((item) => {
        const itemInFilteredData = newData.find(
          (i) => i[rowIdentifier] === item[rowIdentifier]
        );
        if (itemInFilteredData) {
          return { ...itemInFilteredData };
        }
        return { ...item };
      });
    });
  };

  const deleteRowSection = (selectedId: string) => {
    if (!tableData) return;
    const newData = tableData.filter(
      (item) => item[rowIdentifier] !== selectedId
    );
    setTableData(newData);
  };

  const editRowSection = (selectedId: string, key: string, value: string) => {
    if (!tableData) return;
    const newData = tableData.map((item) => {
      if (item[rowIdentifier] !== selectedId) return { ...item };
      return {
        ...item,
        [key]: value,
      };
    });
    setTableData(newData);
  };

  const deleteSelected = () => {
    if (!tableData) return;
    const newData = tableData?.filter((item) => {
      return !item.isSelected;
    });

    setTableData(newData);
  };

  const getSelectedItemCount = () => {
    if (!tableData) return 0;
    const data = getFilteredData();
    return data.reduce(
      (count, item) => (item.isSelected ? count + 1 : count),
      0
    );
  };

  const getPageRange = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = currentPage * ITEMS_PER_PAGE - 1;
    return { start, end };
  };

  const isAllSelectedInPage = () => {
    if (!tableData) return false;

    const { start, end } = getPageRange();
    const data = getFilteredData();
    return data.slice(start, end + 1).every((item) => item.isSelected);
  };

  const getPageTableData = () => {
    if (!tableData) return;
    const { start, end } = getPageRange();
    const data = getFilteredData();
    return data.slice(start, end + 1);
  };

  const fetchData = async () => {
    setError(false);
    try {
      let response = await fetch(dataSource);
      let fetchedData: T[] = await response.json();
      const dataWithSelection = fetchedData.map((dataItem) => ({
        ...dataItem,
        isSelected: false,
        isEditable: false,
      }));
      setTableData(dataWithSelection);
      setCurrentPage(1);
      return dataWithSelection;
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  useEffect(() => {
    const initializeTable = async () => {
      try {
        const data = await fetchData();
        setTableData(data);
      } catch (error) {
        setError(true);
      }
    };
    initializeTable();
  }, []);

  return {
    pageTableData: getPageTableData(),

    // table states
    loading: !tableData && !error,
    isEmpty: totalItem() === 0,
    error,
    currentPage,
    totalPages: totalPages(),
    totalItem: totalItem(),
    totalSelectedItems: getSelectedItemCount(),
    isAllSelectedInPage: isAllSelectedInPage(),

    // table function / modifiers
    toggleRowSelection,
    togglePageSelection,
    moveToFirstPage,
    moveToLastPage,
    moveToOnePageDown,
    moveToOnePageUp,
    deleteRowSection,
    deleteSelected,
    makeEditableRowSelection,
    editRowSection,
    saveRowSection,

    // search params
    search,
    searchValue: searchInput,
  };
};

export default useTable;
