import { useState, useMemo } from "react";
import {
  AgGridReact,
} from "ag-grid-react";

import {
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function MyTable() {
  const [rowData] = useState([
    {
      image: "https://via.placeholder.com/60",
      title: "Alpha",
      description:
        "This is a very long description that will be truncated and shown inside a popover. Add more content to test overflow and scrolling inside the popup. This keeps the UI tidy and avoids table stretching caused by verbose text.",
    },
    {
      image: "https://via.placeholder.com/60",
      title: "Beta",
      description:
        "Another lengthy description for testing popover overflow with scroll support.",
    },
  ]);

  const DescriptionRenderer = (params: any) => {
    const text = params.value ?? "";
    const truncated = text.length > 60 ? text.slice(0, 60) + "..." : text;

    return (
      <div className="text-gray-700">
        {truncated}{" "}
        {text.length > 60 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="link"
                className="px-0 text-xs underline text-indigo-600"
              >
                more
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              className="max-w-xs max-h-60 overflow-auto whitespace-pre-wrap"
            >
              {text}
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };

  const ActionRenderer = (params: any) => {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("edit", params.data)}
        >
          edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => console.log("delete", params.data)}
        >
          delete
        </Button>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        headerName: "Sr",
        valueGetter: (p: any) => p.node.rowIndex + 1,
        width: 70,
      },
      {
        headerName: "Image",
        field: "image",
        cellRenderer: (params: any) => (
          <img
            src={params.value}
            alt=""
            className="w-10 h-10 rounded object-cover"
          />
        ),
        width: 100,
      },
      {
        headerName: "Title",
        field: "title",
        flex: 1,
      },
      {
        headerName: "Description",
        field: "description",
        cellRenderer: DescriptionRenderer,
        flex: 2,
      },
      {
        headerName: "Actions",
        cellRenderer: ActionRenderer,
        width: 150,
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div
        className="ag-theme-alpine"
        style={{ height: 350, width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          //@ts-ignore
          columnDefs={columns}
          pagination={true}
          paginationPageSize={5}
        />
      </div>
    </div>
  );
}
