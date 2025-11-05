import React, { useMemo, useState, useEffect } from "react";

export type Column<RowType> = {
  header: string;
  accessor?: keyof RowType | string | ((row: RowType) => any);
  id?: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: RowType, index: number) => React.ReactNode;
  hideOnMobile?: boolean;
  isImage?: boolean;
  imageProps?: {
    className?: string;
    style?: React.CSSProperties;
    altAccessor?: (row: RowType) => string;
    placeholder?: string;
    onErrorSrc?: string;
  };
  actions?: Array<{
    label: string;
    onClick?: (row: RowType) => void;
    icon?: React.ReactNode;
    destructive?: boolean;
  }>;
};

export type TableProps<RowType> = {
  columns: Column<RowType>[];
  data: RowType[];
  loading?: boolean;
  pageSize?: number;
  serverSide?: boolean;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortBy: { id: string; desc: boolean } | null) => void;
  onSelectionChange?: (selected: RowType[]) => void;
  selectable?: boolean;
  renderRowActions?: (row: RowType) => React.ReactNode;
  emptyText?: string;
  autoDetectImages?: boolean;
};

function getNestedValue(obj: any, path?: string | number | undefined) {
  if (obj == null || path == null) return undefined;
  if (typeof path !== "string") return obj[path as any];
  if (!path) return undefined;
  return path
    .split(".")
    .reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
}

export default function Table<RowType extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pageSize = 10,
  serverSide = false,
  onPageChange,
  onSortChange,
  onSelectionChange,
  selectable = false,
  renderRowActions,
  emptyText = "No data to display",
  autoDetectImages = false,
}: TableProps<RowType>) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ id: string; desc: boolean } | null>(null);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  // preview for long content (positioned near the clicked ellipsis)
  const [preview, setPreview] = useState<null | {
    text: string;
    left: number;
    top: number;
  }>(null);

  useEffect(() => {
    if (!openMenuFor) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return setOpenMenuFor(null);
      const menuEl = target.closest("[data-action-menu-id]");
      const btnEl = target.closest("[data-action-btn-id]");
      if (menuEl || btnEl) return;
      setOpenMenuFor(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuFor]);

  // close preview on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const selectedRows = useMemo(() => {
    const ids = Object.keys(selected).filter((k) => selected[Number(k)]);
    return ids.map((k) => data[Number(k)]).filter(Boolean) as RowType[];
  }, [selected, data]);

  useEffect(() => {
    onSelectionChange && onSelectionChange(selectedRows);
  }, [selectedRows, onSelectionChange]);

  const sortedData = useMemo(() => {
    if (!sort || serverSide) return data;
    const col = columns.find((c) => (c.id ?? c.header) === sort.id);
    if (!col) return data;
    const accessor = col.accessor;
    const copy = [...data];
    copy.sort((a, b) => {
      let av: any;
      let bv: any;
      if (typeof accessor === "function") {
        av = accessor(a);
        bv = accessor(b);
      } else if (typeof accessor === "string") {
        av = getNestedValue(a, accessor);
        bv = getNestedValue(b, accessor);
      } else {
        av = (a as any)[col.header as any];
        bv = (b as any)[col.header as any];
      }
      if (av == null && bv == null) return 0;
      if (av == null) return sort.desc ? -1 : 1;
      if (bv == null) return sort.desc ? 1 : -1;
      if (typeof av === "number" && typeof bv === "number")
        return sort.desc ? bv - av : av - bv;
      if (av instanceof Date && bv instanceof Date)
        return sort.desc ? +bv - +av : +av - +bv;
      return sort.desc
        ? String(bv).toLowerCase().localeCompare(String(av).toLowerCase())
        : String(av).toLowerCase().localeCompare(String(bv).toLowerCase());
    });
    return copy;
  }, [data, sort, columns, serverSide]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const pagedData = useMemo(() => {
    if (serverSide) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize, serverSide]);

  useEffect(() => {
    if (serverSide && onPageChange) onPageChange(page);
  }, [page, serverSide, onPageChange]);

  const toggleSort = (col: Column<RowType>) => {
    if (!col.sortable) return;
    const id = col.id ?? col.header;
    let next: { id: string; desc: boolean } | null = {
      id: String(id),
      desc: false,
    };
    if (sort && sort.id === String(id)) {
      if (!sort.desc) next = { id: String(id), desc: true };
      else next = null;
    }
    setSort(next);
    onSortChange && onSortChange(next);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelected({});
      return;
    }
    const newSel: Record<number, boolean> = {};
    pagedData.forEach((_, idx) => {
      const absolute = data.indexOf(pagedData[idx]);
      if (absolute >= 0) newSel[absolute] = true;
    });
    setSelected(newSel);
  };

  const toggleRow = (absoluteIndex: number) =>
    setSelected((s) => ({ ...s, [absoluteIndex]: !s[absoluteIndex] }));

  function isImageUrl(value: string) {
    if (!value) return false;
    const v = String(value).toLowerCase();
    return (
      v.startsWith("data:image") ||
      /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/.test(v)
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-white rounded-md shadow-sm border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              {selectable && (
                <th className="px-3 py-3 text-left text-sm font-medium">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-indigo-500"
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Select all rows"
                    />
                  </label>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id ?? col.header}
                  style={{ width: col.width }}
                  className={`px-4 py-3 text-left text-sm font-medium uppercase tracking-wider select-none ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      className={`flex items-center gap-2 focus:outline-none ${
                        col.sortable ? "cursor-pointer" : "cursor-auto"
                      }`}
                      onClick={() => toggleSort(col)}
                      aria-label={`Sort by ${col.header}`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && sort?.id === (col.id ?? col.header) && (
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden
                        >
                          {sort.desc ? (
                            <path d="M5 8l5 5 5-5H5z" />
                          ) : (
                            <path d="M5 12l5-5 5 5H5z" />
                          )}
                        </svg>
                      )}
                    </button>
                  </div>
                </th>
              ))}
              {renderRowActions && (
                <th className="px-4 py-3 text-left text-sm font-medium" />
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {selectable && (
                    <td className="px-3 py-4">
                      <div className="h-4 w-4 bg-gray-200 rounded" />
                    </td>
                  )}
                  {columns.map((col, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-4 text-sm ${
                        col.hideOnMobile ? "hidden sm:table-cell" : ""
                      }`}
                    >
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </td>
                  ))}
                  {renderRowActions && (
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-10" />
                    </td>
                  )}
                </tr>
              ))
            ) : pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (renderRowActions ? 1 : 0)
                  }
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              pagedData.map((row, idx) => {
                const absoluteIndex = data.indexOf(row);
                return (
                  <tr key={absoluteIndex ?? idx} className="hover:bg-gray-50">
                    {selectable && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={!!selected[absoluteIndex]}
                          onChange={() => toggleRow(absoluteIndex)}
                          className="form-checkbox h-4 w-4 text-indigo-500"
                          aria-label={`Select row ${absoluteIndex + 1}`}
                        />
                      </td>
                    )}

                    {columns.map((col, ci) => {
                      const tdClass = `px-4 py-3 align-top text-sm text-gray-700 ${
                        col.hideOnMobile ? "hidden sm:table-cell" : ""
                      } ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      }`;

                      // compute value
                      let cellValue: any;
                      if (col.render) {
                        // render takes precedence
                      } else if (typeof col.accessor === "function") {
                        try {
                          cellValue = (col.accessor as Function)(row);
                        } catch (e) {
                          cellValue = undefined;
                        }
                      } else if (typeof col.accessor === "string") {
                        cellValue = getNestedValue(row, col.accessor as string);
                      } else {
                        cellValue = (row as any)[col.header as any];
                      }

                      const shouldImage =
                        col.isImage ||
                        (autoDetectImages &&
                          typeof cellValue === "string" &&
                          isImageUrl(cellValue));

                      const menuId = `${absoluteIndex}-${ci}`;

                      return (
                        <td key={ci} className={tdClass}>
                          {col.actions && col.actions.length > 0 ? (
                            <div
                              className="relative inline-block text-left"
                              data-action-menu-id={menuId}
                            >
                              <button
                                data-action-btn-id={menuId}
                                aria-expanded={openMenuFor === menuId}
                                aria-haspopup="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuFor((s) =>
                                    s === menuId ? null : menuId
                                  );
                                }}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                                title="Actions"
                              >
                                <svg
                                  className="w-5 h-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden
                                >
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </button>

                              {openMenuFor === menuId && (
                                <div
                                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                                  role="menu"
                                  aria-orientation="vertical"
                                  aria-labelledby="options-menu"
                                >
                                  {col.actions.map((act, ai) => (
                                    <button
                                      key={ai}
                                      onClick={(ev) => {
                                        ev.stopPropagation();
                                        try {
                                          act.onClick && act.onClick(row);
                                        } finally {
                                          setOpenMenuFor(null);
                                        }
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                                        act.destructive
                                          ? "text-red-600 hover:bg-red-50"
                                          : "text-gray-700 hover:bg-gray-50"
                                      }`}
                                      role="menuitem"
                                    >
                                      {act.icon && (
                                        <span className="opacity-80">
                                          {act.icon}
                                        </span>
                                      )}
                                      <span>{act.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : col.render ? (
                            col.render(row, absoluteIndex)
                          ) : shouldImage ? (
                            (() => {
                              const src =
                                cellValue || col.imageProps?.placeholder || "";
                              const alt = col.imageProps?.altAccessor
                                ? col.imageProps.altAccessor(row)
                                : String(col.header || "image");
                              const cls =
                                col.imageProps?.className ??
                                "h-10 w-10 rounded-md object-cover";
                              const onErrorSrc =
                                col.imageProps?.onErrorSrc ??
                                col.imageProps?.placeholder;
                              return (
                                <img
                                  src={src}
                                  alt={alt}
                                  loading="lazy"
                                  className={cls}
                                  style={col.imageProps?.style}
                                  onError={(e) => {
                                    const t =
                                      e.currentTarget as HTMLImageElement;
                                    if (onErrorSrc && t.src !== onErrorSrc)
                                      t.src = onErrorSrc;
                                  }}
                                />
                              );
                            })()
                          ) : React.isValidElement(cellValue) ? (
                            cellValue
                          ) : cellValue === undefined || cellValue === null ? (
                            "-"
                          ) : (
                            (() => {
                              const s = String(cellValue);
                              const limit = 120;
                              if (s.length <= limit) return s;
                              const short = s.slice(0, limit) + "\u2026";
                              return (
                                <div className="flex items-start gap-2">
                                  <div
                                    className="truncate max-w-xs text-sm text-gray-700"
                                    title={s}
                                  >
                                    {short}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const target =
                                        e.currentTarget as HTMLElement;
                                      const rect =
                                        target.getBoundingClientRect();

                                      const modalWidth = 330;
                                      const modalHeight = 200;
                                      const margin = 8;

                                      let top = rect.bottom + margin;
                                      let left = rect.left;

                                      if (
                                        top + modalHeight >
                                        window.innerHeight
                                      ) {
                                        top = rect.top - modalHeight - margin;
                                      }

                                      if (
                                        left + modalWidth >
                                        window.innerWidth
                                      ) {
                                        left = rect.right - modalWidth - margin;
                                      }

                                      if (top < margin) top = margin;
                                      if (left < margin) left = margin;

                                      setPreview({
                                        text: s, 
                                        top,
                                        left,
                                      });
                                    }}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                                    aria-label="Show full content"
                                  >
                                    ...
                                  </button>
                                </div>
                              );
                            })()
                          )}
                        </td>
                      );
                    })}

                    {renderRowActions && (
                      <td className="px-4 py-3">{renderRowActions(row)}</td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!serverSide && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing{" "}
            <span className="font-medium">
              {Math.min((page - 1) * pageSize + 1, data.length)}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(page * pageSize, data.length)}
            </span>{" "}
            of <span className="font-medium">{data.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded-md bg-white border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="px-2 py-1">Page</div>
            <input
              type="number"
              min={1}
              max={pageCount}
              value={page}
              onChange={(e) =>
                setPage(
                  Math.max(1, Math.min(pageCount, Number(e.target.value) || 1))
                )
              }
              className="w-16 text-center px-2 py-1 border rounded-md"
            />
            <div className="px-2">of {pageCount}</div>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page >= pageCount}
              className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div
          className="fixed z-50 max-w-md bg-white border border-gray-300 shadow-lg rounded-lg p-4 text-sm"
          style={{
            top: preview.top,
            left: preview.left,
            width: 330,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <div className="whitespace-pre-wrap text-gray-800">
            {preview.text}
          </div>
          <button
            onClick={() => setPreview(null)}
            className="mt-3 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
