import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useState, useEffect } from "react";
import DataGrid from "./ui/DataGrid";
import ArticleForm from "./ui/ArticleForm";
import api, { origin } from "../API/backapi";
import { toast } from "react-hot-toast";

type Article = {
  _id: string;
  image?: string;
  title: string;
  description?: string;
  subTitle?: string;
  nutritionist?: string;
  createdAt?: string;
};

export default function Learn() {
  const [data, setData] = useState<Article[]>([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const fetchArticles = async (p = page, limit = rowsPerPage) => {
    try {
      setLoading(true);
      const params: any = { page: p, limit };
      const res = await api.get("/admin/articles", { params });
      let articles = res.data?.articles || res.data;
      const totalCount = res.data?.total ?? (articles ? articles.length : 0);
      
      if (sortKey) {
        articles = [...articles].sort((a: any, b: any) => {
          const av = a[sortKey];
          const bv = b[sortKey];

          if (typeof av === "number" && typeof bv === "number") {
            return sortAsc ? av - bv : bv - av;
          }

          if (typeof av === "string" && typeof bv === "string") {
            return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
          }

          return 0;
        });
      }

      setData(articles || []);
      setTotal(Number(totalCount) || 0);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to load articles"
      );
    } finally {
      setLoading(false);
    }
  };

  console.log(sortAsc, sortKey);

  useEffect(() => {
    fetchArticles(page, rowsPerPage);
  }, [page, rowsPerPage, search, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    setSortKey(key);
    setSortAsc((prev) => !prev);
  };

  const openModal = (mode: string, article?: any) => {
    const normalizedMode = mode === "edit" ? "edit" : "create";
    setModalMode(normalizedMode as "create" | "edit");
    setSelectedArticle(article || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const handleSuccess = (resData: any) => {
    const newArticle =
      resData?.addArticle ||
      resData?.article ||
      (resData && resData._id ? resData : null);

    if (!newArticle) {
      fetchArticles(page, rowsPerPage);
      return;
    }

    if (modalMode === "create") {
      setPage(1);
      fetchArticles(1, rowsPerPage);
    } else {
      setData((prev) => {
        const found = prev.some((a) => a._id === newArticle._id);
        if (found)
          return prev.map((a) => (a._id === newArticle._id ? newArticle : a));
        fetchArticles(page, rowsPerPage);
        return prev;
      });
    }
  };

  const openDeleteModal = (article: Article) => {
    setDeleteTarget(article);
    setShowDeleteConfirm(true);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setShowDeleteConfirm(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    try {
      await api.delete(`/admin/article/${id}`);
      toast.success("Article deleted");
      const totalAfter = Math.max(0, total - 1);
      const totalPagesAfter = Math.max(1, Math.ceil(totalAfter / rowsPerPage));
      const newPage = page > totalPagesAfter ? totalPagesAfter : page;
      setPage(newPage);
      fetchArticles(newPage, rowsPerPage);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to delete article"
      );
    } finally {
      closeDeleteModal();
    }
  };

  const columns = [
    {
      key: "srno",
      label: "Sr No",
      sortable: false,
      render: (_row: Article, idx: number) => <span>{idx + 1}</span>,
    },
    {
      key: "thumbnail",
      label: "Thumbnail",
      sortable: false,
      render: (row: Article) => (
        <img
          src={
            row.image
              ? `${origin}/uploads/${row.image}`
              : "https://picsum.photos/50"
          }
          alt="thumbnail"
          className="w-10 h-10 rounded object-cover"
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row: Article) => <span>{row.title}</span>,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (row: Article) => (
        <div className="relative group max-w-[160px] overflow-visible">
          <span className="font-semibold text-gray-800 truncate block">
            {row.description || row.subTitle}
          </span>

          <div
            className="
        absolute left-0 bottom-full
        hidden group-hover:block
        bg-white text-black text-xs
        rounded-lg px-3 py-2 shadow-lg z-50 border border-gray-200
        max-w-[300px] whitespace-normal break-words
      "
          >
            <div
              className="
          absolute top-full left-4
          w-0 h-0 
          border-l-4 border-r-4 border-t-4 
          border-l-transparent border-r-transparent border-t-white
        "
            />
            {row.description || row.subTitle}
          </div>
        </div>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row: Article, _index: number, open: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => open("edit", row)}
            className="p-1 rounded focus:outline-none bg-white hover:bg-white focus:bg-white border-none shadow-none"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-blue-600"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 13.5V16h2.5l7.1-7.1a1.8 1.8 0 0 0-2.5-2.5L4 13.5z" />
              <path d="M12.5 6.5l1 1" />
            </svg>
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="p-1 rounded focus:outline-none bg-white hover:bg-white focus:bg-white border-none shadow-none"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-red-600"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="7" width="10" height="9" rx="2" />
              <path d="M8 10v4M12 10v4" />
              <path d="M7 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              <line x1="4" y1="7" x2="16" y2="7" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="">
        <DataGrid
          columns={columns}
          data={data}
          title="Articles"
          page={page}
          rowsPerPage={rowsPerPage}
          totalPages={Math.max(1, Math.ceil(total / rowsPerPage))}
          search={search}
          onSearch={setSearch}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          onPage={setPage}
          onRowsPerPage={setRowsPerPage}
          openModal={openModal}
          loading={loading}
          archive={false}
          createButton={
            <button
              onClick={() => openModal("create", null)}
              className="bg-blue-600 text-white px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              Create
            </button>
          }
        />

        {/* Modal for create/edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <ArticleForm
                isModalContent
                closeModal={closeModal}
                article={
                  modalMode === "edit"
                    ? selectedArticle || undefined
                    : undefined
                }
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        )}
        {/* Delete confirm modal */}
        {showDeleteConfirm && deleteTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
              <div className="text-lg font-semibold mb-2">Confirm delete</div>
              <div className="mb-4">
                Are you sure you want to delete "{deleteTarget.title}"?
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
