import { useEffect, useMemo, useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const raw = localStorage.getItem("admin_faqs");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FaqItem | null>(null);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errors, setErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem("admin_faqs", JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    if (editing) {
      setQuestion(editing.question);
      setAnswer(editing.answer);
      setIsModalOpen(true);
    }
  }, [editing]);

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  // helpers
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setErrors(new Set());
    setEditing(null);
    setIsModalOpen(false);
  };

  const validate = () => {
    const e = new Set<string>();
    if (!question.trim()) e.add("question");
    if (!answer.trim()) e.add("answer");
    setErrors(e);
    return e.size === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editing) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === editing.id ? { ...f, question, answer } : f))
      );
    } else {
      const item: FaqItem = {
        id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
        question: question.trim(),
        answer: answer.trim(),
        createdAt: new Date().toISOString(),
      };
      setFaqs((prev) => [item, ...prev]);
      setPage(1);
    }

    resetForm();
  };

  const handleEdit = (item: FaqItem) => {
    setEditing(item);
  };

  const handleDelete = (item: FaqItem) => {
    setConfirmDelete(item);
  };

  const confirmDeleteNow = () => {
    if (!confirmDelete) return;
    setFaqs((prev) => prev.filter((f) => f.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">FAQs</h2>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search FAQs..."
            className="border border-gray-300 rounded px-3 py-2 text-xs sm:text-sm w-full focus:outline-none focus:ring focus:border-blue-300 pr-8"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          <button
            onClick={() => {
              setEditing(null);
              setIsModalOpen(true);
              setQuestion("");
              setAnswer("");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {paginated.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No FAQs found.</div>
        ) : (
          paginated.map((f) => {
            const isOpen = openIds.has(f.id);
            return (
              <div key={f.id} className="border rounded">
                <button
                  onClick={() => toggleOpen(f.id)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="font-medium">{f.question}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                      {f.answer}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(f)}
                        className="px-1 py-1 bg-white rounded text-sm hover:bg-gray-50"
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
                        onClick={() => handleDelete(f)}
                        className="px-1 py-1 text-red-600 rounded text-sm hover:bg-red-100"
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
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editing ? "Edit FAQ" : "Add FAQ"}
              </h3>
              <button onClick={resetForm} className="text-gray-500">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Question
                </label>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
                    errors.has("question") ? "border-red-500" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  className={`w-full border rounded px-3 py-2 text-sm focus:outline-none ${
                    errors.has("answer") ? "border-red-500" : ""
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div className="text-lg font-semibold mb-2">Delete FAQ</div>
            <div className="mb-4 text-sm">
              Are you sure you want to delete this FAQ?
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteNow}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
