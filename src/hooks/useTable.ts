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
  const [cloneTableData, setCloneTableData] = useState<Array<
    TableRow<T>
  > | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");

  const getFilteredData = () => {
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
    if (!cloneTableData) return 0;
    return cloneTableData ? cloneTableData.length : 0;
  };

  const totalPages = () => {
    if (!cloneTableData) return 0;
    return Math.ceil(cloneTableData.length / ITEMS_PER_PAGE);
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
    if (!cloneTableData) return;
    setCloneTableData((previousData) => {
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
    if (!cloneTableData) return;
    setCloneTableData((previousData) => {
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
    if (!cloneTableData) return;
    const newData = cloneTableData.map((item) => {
      return {
        ...item,
        isEditable:
          item[rowIdentifier] === selectedId ? false : item.isEditable,
      };
    });
    setCloneTableData(newData);
    setTableData(newData);
  };

  const getSelectedItemCount = () => {
    if (!cloneTableData) return 0;
    return cloneTableData.reduce(
      (count, item) => (item.isSelected ? count + 1 : count),
      0
    );
  };

  const togglePageSelection = () => {
    if (!cloneTableData) return;
    const { start, end } = getPageRange();
    setCloneTableData((previousData) => {
      if (!previousData) return null;
      return previousData.map((item, index) => {
        return {
          ...item,
          isSelected:
            index >= start && index <= end
              ? !isAllSelectedInPage()
              : item.isSelected,
        };
      });
    });
  };

  const deleteRowSection = (selectedId: string) => {
    if (!cloneTableData) return;
    const newData = cloneTableData.filter(
      (item) => item[rowIdentifier] !== selectedId
    );
    setTableData(newData);
    setCloneTableData(newData);
  };

  const editRowSection = (selectedId: string, key: string, value: string) => {
    if (!cloneTableData) return;
    const newData = cloneTableData.map((item) => {
      if (item[rowIdentifier] !== selectedId) return { ...item };
      return {
        ...item,
        [key]: value,
      };
    });
    setTableData(newData);
    setCloneTableData(newData);
  };

  const deleteSelected = () => {
    if (!cloneTableData) return;
    const newData = cloneTableData?.filter((item) => {
      return !item.isSelected;
    });

    setTableData(newData);
    setCloneTableData(newData);
  };

  const getPageRange = () => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = currentPage * ITEMS_PER_PAGE - 1;
    return { start, end };
  };

  const isAllSelectedInPage = () => {
    if (!cloneTableData) return false;
    const { start, end } = getPageRange();
    return cloneTableData
      .slice(start, end + 1)
      .every((item) => item.isSelected);
  };

  const getPageTableData = () => {
    if (!cloneTableData) return false;
    const { start, end } = getPageRange();
    return cloneTableData.slice(start, end + 1);
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
    if (searchInput === "") {
      setCloneTableData(tableData);
      return;
    }
    const filteredData = getFilteredData();
    setCloneTableData(filteredData);
  }, [searchInput]);

  useEffect(() => {
    const initializeTable = async () => {
      try {
        const data = await fetchData();
        setCloneTableData(data);
      } catch (error) {
        setError(true);
      }
    };
    initializeTable();
  }, []);

  useEffect(() => {
    setCloneTableData(tableData);
  }, [tableData]);

  return {
    pageTableData: getPageTableData(),

    // table states
    loading: !cloneTableData && !error,
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
