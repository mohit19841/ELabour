import React from "react";
import {
    useTable,
    useGlobalFilter,
    usePagination
} from "react-table";

import { getBadgeColor } from '../../utils/GetBadgeColor';

const Search = ({
        preGlobalFilteredRows,
        globalFilter,
        setGlobalFilter
    }) => {
    const count = preGlobalFilteredRows && preGlobalFilteredRows.length;

    return (
        <input
            value={globalFilter || ""}
            onChange={e => {
                setGlobalFilter(e.target.value || undefined);
            }}
            placeholder={`Search ${count} item(s)...`}
            className="form-control form-control-lg mb-3"
        />
    );
}

const Pagination = ({
        pageIndex,
        pageOptions,
        previousPage,
        canPreviousPage,
        nextPage,
        canNextPage
    }) => {
    return(
        <div className="row d-flex align-items-center justify-content-between mt-3">
            <div className="col">
                <strong>
                    {`Page ${pageIndex + 1} of ${pageOptions.length}`}
                </strong>
                <button
                    onClick={() => previousPage()} disabled={!canPreviousPage}
                    className="ml-3 btn btn-primary pt-1 pb-0 mr-2 table-pagination-btn"
                >
                    <i className="material-icons">arrow_back</i>
                </button>
                <button
                    onClick={() => nextPage()} disabled={!canNextPage}
                    className="btn btn-primary pt-1 pb-0 table-pagination-btn"
                >
                    <i className="material-icons">arrow_forward</i>
                </button>
            </div>
        </div>
    );
}

const Table = ({ columns, data, history, path, itemsPerPage, searchable, striped }) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state: { pageIndex },
    } = useTable(
        {
          columns,
          data,
          initialState: {pageIndex: 0, pageSize: itemsPerPage ? itemsPerPage : 10}
        },
        useGlobalFilter,
        usePagination
    );

    const viewDetails = (id) => {
        history.push(`${path}/${id}`);
    }

    return (
        <>
        { searchable &&
        <div className="row d-flex justify-content-end">
        <div className="col col-lg-4 col-xl-3">
        <Search
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
        />
        </div>
        </div>
        }
        
        <table
            className={`table table-bordered ${striped && "table-striped"} table-hover`}
            {...getTableProps()}
        >
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                prepareRow(row);
                return (
                    <tr
                        onClick={() => path && viewDetails(row.original.id)}
                        {...row.getRowProps()}
                        style={{cursor:'pointer'}}
                    >
                    {row.cells.map((cell, i) => {

                        // Check if colored badge needs to be rendered
                        if(cell.column.Header === "Completion Status" || cell.column.Header === "Reports") {
                            return ( 
                            <td {...cell.getCellProps()}>
                                <span className={`badge badge-${getBadgeColor(cell.value)}`}>{cell.render("Cell")}</span>
                            </td>
                            );
                        }

                        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                    </tr>
                );
              })}
            </tbody>
        </table>
        <Pagination
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            previousPage={previousPage}
            canPreviousPage={canPreviousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
        />
        </>
    );
}

export default Table;