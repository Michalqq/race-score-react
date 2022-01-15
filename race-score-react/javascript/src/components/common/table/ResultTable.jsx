import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  useExpanded,
} from "react-table";
import { useDebounce } from "use-debounce";
import { LoadingTable } from "./LoadingTable";
import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import EmptyDataRow from "./EmptyDataRow";
import "bootstrap/dist/css/bootstrap.min.css";

const DefaultColumnFilter = ({ column: { filterValue, setFilter } }) => {
  /* eslint-disable no-unused-vars */
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={""}
    />
  );
};

export default function Table({
  columns,
  data,
  renderRowSubComponent,
  updateMyData,
  isLoading,
  isFooter,
  isHeader = true,
  pageCount: controlledPageCount,
  expandOn = false,
  manualPagination = false,
  manualFilters = false,
  hiddenColumns = [],
  sortBy = [],
  cursor = "text",
  fetchData = () => undefined,
  onPageIndexChange = () => undefined,
  onFilterChange = () => undefined,
  onRowClick = () => undefined,
  highlightRow = () => "",
  textDecoration = "none",
  fontWeight = "350",
}) {
  const [prevLength, setPrevLength] = useState(0);
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );
  const defaultColumn = React.useMemo(
    () => ({ Filter: DefaultColumnFilter }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    visibleColumns,
    footerGroups,
    state: { pageIndex, filters },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
        hiddenColumns: hiddenColumns,
        sortBy: sortBy,
      },
      updateMyData,
      autoResetPage: false,
      autoResetFilters: false,
      isLoading: isLoading,
      isFooter: isFooter,
      isHeader: isHeader,
      manualPagination: manualPagination,
      pageCount: controlledPageCount,
      manualFilters: manualFilters,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  );
  useEffect(() => {
    gotoPage(0);
  }, [filters]);

  const [debounceFilters] = useDebounce(filters, 900);

  useEffect(() => {
    if (debounceFilters) {
      gotoPage(0);
      onFilterChange(debounceFilters);
    }
  }, [debounceFilters]);

  useEffect(() => {
    onPageIndexChange(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    if (debounceFilters) {
      fetchData({ pageIndex, filters: debounceFilters });
    }
  }, [pageIndex, debounceFilters]);

  if (isLoading) {
    return (
      <>
        <table id="traffic-simulator-table" {...getTableProps()}>
          <TableHeader isHeader={isHeader} headerGroups={headerGroups} />
        </table>
        <LoadingTable isLoading={isLoading} />
      </>
    );
  } else if (!data.length) {
    return (
      <>
        <table id="traffic-simulator-table" {...getTableProps()}>
          <TableHeader isHeader={isHeader} headerGroups={headerGroups} />
          <EmptyDataRow headerGroups={headerGroups} />
        </table>
      </>
    );
  } else {
    return (
      <>
        <table
          className="table table-striped"
          id="traffic-simulator-table"
          {...getTableProps()}
        >
          <TableHeader isHeader={isHeader} headerGroups={headerGroups} />
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <React.Fragment key={"row" + rowIndex}>
                  <tr
                    {...row.getRowProps({
                      style: {
                        cursor: cursor,
                        textDecoration: textDecoration,
                        fontWeight: fontWeight,
                        display: "table-row",
                        background: highlightRow(row),
                      },
                    })}
                    className="align-middle"
                  >
                    {row.cells.map((cell, cellIndex) => {
                      return (
                        <td
                          key={cellIndex}
                          style={{
                            maxWidth: "0px",
                            width: "unset",
                          }}
                          {...cell.getCellProps({
                            onClick: cell.column.disableRowClick
                              ? () => undefined
                              : () => onRowClick(row, cell),
                          })}
                          className="p-0 m-0"
                        >
                          <div
                            title={cell.value}
                            className="truncate-text truncate-inline nkor-text-align-right"
                          >
                            {cell.render("Cell")}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {(row.isExpanded || row.values.expand === "true") && (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        {renderRowSubComponent({ row })}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <TableFooter isFooter={isFooter} footerGroups={footerGroups} />
        </table>
      </>
    );
  }
}
/* eslint-enable no-unused-vars */
