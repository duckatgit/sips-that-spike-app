import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (...args: any[]) => React.ReactNode;
  sortable?: boolean;
};

type FilterOption = { value: string; label: string };
type Filter = {
  label: string;
  placeholder?: string;
  component?: React.ReactNode;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

type DataGridProps<T> = {
  columns: Column<T>[];
  data: T[];
  title?: string;
  page: number;
  rowsPerPage: number;
  totalPages: number;
  search: string;
  onSearch: (search: string) => void;
  sortKey: string | null;
  sortAsc: boolean;
  onSort: (key: string) => void;
  onPage: (page: number) => void;
  onRowsPerPage: (rows: number) => void;
  loading?: boolean;
  actionButton?: React.ReactNode;
  openModal?: (mode: string, id?: string) => void;
  filters?: Filter[];
  archive?: boolean;
  onArchiveClick?: () => void;
  createButton?: React.ReactNode;
};

function DataGrid<T extends object>({
  columns,
  data,
  title,
  page,
  rowsPerPage,
  totalPages,
  search,
  onSearch,
  sortKey,
  sortAsc,
  onSort,
  onPage,
  onRowsPerPage,
  loading,
  actionButton,
  openModal,
  filters,
  archive,
  onArchiveClick,
  createButton,
}: DataGridProps<T>) {
  const location = useLocation();
  const nav = useNavigate();
  const [isArchiveActive, setIsArchiveActive] = useState(false);

  const SortIcon = ({ active, asc }: { active: boolean; asc: boolean }) => (
    <span className="inline-block ml-1 align-middle">
      {active ? (
        asc ? (
          <svg width="12" height="12" fill="none" viewBox="0 0 20 20">
            <path d="M6 12l4-4 4 4" stroke="#222" strokeWidth="2" fill="none" />
          </svg>
        ) : (
          <svg width="12" height="12" fill="none" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="#222" strokeWidth="2" fill="none" />
          </svg>
        )
      ) : (
        <svg width="12" height="12" fill="none" viewBox="0 0 20 20">
          <path d="M6 8l4 4 4-4" stroke="#bbb" strokeWidth="2" fill="none" />
        </svg>
      )}
    </span>
  );

  useEffect(() => {
    if (location.pathname.includes("archive")) setIsArchiveActive(true);
    else {
      setIsArchiveActive(false);
    }
  }, [location.pathname]);

  return (
    <>
      <div className=" h-full">
        <div className="flex flex-col p-4 sticky top-0 bg-[white] z-10 sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
          {title && (
            <>
              <div className="flex items-end gap-4">
                <h2
                  onClick={() => {
                    if (location.pathname.includes("archive")) {
                      if (location.pathname.includes("transcripts")) {
                        nav("/admin/transcripts");
                      }
                      if (location.pathname.includes("assistants")) {
                        nav("/admin/assistants");
                      }
                    }
                  }}
                  className={` ${
                    !isArchiveActive && archive
                      ? "relative text-blue-700 after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-blue-700 after:rounded-full "
                      : archive
                      ? "relative hover:after:absolute hover:after:left-0 hover:after:bottom-[-2px] hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-700 hover:after:rounded-full "
                      : null
                  } font-semibold text-lg sm:text-xl   ${
                    archive ? "cursor-pointer" : null
                  } `}
                >
                  {title}
                </h2>
                {archive && (
                  <span
                    onClick={onArchiveClick}
                    className={`relative text-lg font-semibold cursor-pointer ml-2 transition-all duration-200
                         ${
                           isArchiveActive
                             ? "text-blue-700 after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-blue-700 after:rounded-full"
                             : "text-gray-500 hover:text-blue-600"
                         }

                         hover:after:absolute hover:text-gray-500 hover:after:left-0 hover:after:bottom-[-2px] hover:after:h-[2px] hover:after:w-full hover:after:bg-blue-700 hover:after:rounded-full 
                       `}
                  >
                    Archive
                  </span>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {filters && filters.length > 0 && (
              <div className="flex gap-2 w-full sm:w-auto">
                {filters.map((filter, idx) => (
                  <select
                    key={idx}
                    className="border border-gray-300 rounded px-2 py-2 text-xs sm:text-sm w-full sm:w-auto"
                    value={filter.value}
                    onChange={(e) => {
                      filter.onChange(e.target.value);
                      onPage(1);
                    }}
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}
            {/* <div className="relative w-full sm:w-64"> */}
            <div className="relative flex gap-8 w-full">
              <input
                type="text"
                placeholder={"Search"}
                className="border border-gray-300 rounded px-3 py-2 text-xs sm:text-sm w-full focus:outline-none focus:ring focus:border-blue-300 pr-8"
                value={search}
                onChange={(e) => {
                  onSearch(e.target.value);
                  onPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && !search) {
                    e.preventDefault();
                  }
                }}
              />
              {search && (
                <a
                  onClick={() => {
                    onSearch("");
                    onPage(1);
                  }}
                  className="absolute bg-transparent h-[24px] w-[24px] flex items-center justify-center right-1.5 top-[25px] transform -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  x
                </a>
              )}
              {createButton && <>{createButton}</>}
            </div>

            {/* </div> */}

            {actionButton && <>{actionButton}</>}
          </div>
        </div>
        <div className="w-full overflow-x-auto px-4 min-h-[445px]">
          <table className="min-w-full bg-white">
            <thead className="bg-white">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key as string}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-900 text-base cursor-pointer select-none border-b"
                    onClick={() => col.sortable && onSort(col.key as string)}
                  >
                    <span className="flex items-center">
                      {col.label}
                      {col.sortable && (
                        <SortIcon active={sortKey === col.key} asc={sortAsc} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-400"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key as string}
                        className="px-2 sm:px-4 py-2 sm:py-3 align-middle"
                      >
                        {col.render
                          ? col.key === "srno"
                            ? col.render(
                                row,
                                rowIndex + (page - 1) * rowsPerPage
                              )
                            : col.key === "actions"
                            ? col.render(
                                row,
                                rowIndex,
                                typeof openModal !== "undefined"
                                  ? openModal
                                  : undefined
                              )
                            : col.render(row)
                          : (row[col.key as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 sticky bottom-[-0.2px] bg-[white] z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center whitespace-nowrap gap-2">
            <label className="mr-2 text-xs sm:text-sm text-gray-600">
              Rows per page:
            </label>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                onRowsPerPage(Number(e.target.value));
                onPage(1);
              }}
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full flex items-center md:justify-end justify-between md:gap-2">
            <div className="flex items-center gap-2 flex-1 md:flex-[unset]">
              <button
                className={`px-1 py-1 md:py-2 md:px-3 rounded-lg border transition ${
                  page === 1
                    ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => onPage(1)}
                disabled={page === 1}
                title="First page"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M13 15l-5-5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M7 5v10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
              <button
                className={`px-1 py-1 md:py-2 md:px-3 rounded-lg border transition ${
                  page === 1
                    ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => onPage(page - 1)}
                disabled={page === 1}
                title="Previous page"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M13 15l-5-5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
            <span className="md:text-base text-gray-700 font-medium px-2 text-center">
              Page <span className="font-bold">{page}</span> of{" "}
              <span className="font-bold">{totalPages || 1}</span>
            </span>
            <div className="flex items-center gap-2 flex-1 md:flex-[unset] justify-end">
              <button
                className={`px-1 py-1 md:py-2 md:px-3 rounded-lg border transition ${
                  page === totalPages || totalPages === 0
                    ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => onPage(page + 1)}
                disabled={page === totalPages || totalPages === 0}
                title="Next page"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M7 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
              <button
                className={`px-1 py-1 md:py-2 md:px-3 rounded-lg border transition ${
                  page === totalPages || totalPages === 0
                    ? "text-gray-400 border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => onPage(totalPages)}
                disabled={page === totalPages || totalPages === 0}
                title="Last page"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M7 5l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M13 5v10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataGrid;
