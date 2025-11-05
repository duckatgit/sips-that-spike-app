import { useState, useEffect } from "react";
import api, { origin } from "../../API/backapi";
import { toast } from "react-hot-toast";

type Props = {
  openModal?: () => void;
  closeModal?: () => void;
  isModalContent?: boolean;
  article?: any;
  onSuccess?: (article: any) => void;
};

export default function ArticleForm({
  openModal,
  closeModal,
  isModalContent,
  article,
  onSuccess,
}: Props) {
  if (!isModalContent) {
    return (
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    );
  }

  const [title, setTitle] = useState(article?.title || "");
  const [subTitle, setSubTitle] = useState(article?.subTitle || "");
  const [description, setDescription] = useState(article?.description || "");
  const [nutritionist, setNutritionist] = useState(article?.nutritionist || "");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (article?.image) {
      setImagePreview(`${origin}/uploads/${article.image}`);
    }
  }, [article]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be <= 2MB");
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setImageFile(file);
    setImagePreview(url);
  };

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing: string[] = [];
    if (!title.trim()) missing.push("Title");
    if (!subTitle.trim()) missing.push("Sub Title");
    if (!description.trim()) missing.push("Description");
    if (!nutritionist.trim()) missing.push("Nutritionist");

    const hasImage = !!imageFile || !!imagePreview;
    if (!hasImage) missing.push("Image");

    if (missing.length > 0) {
      const label = missing.length > 1 ? "fields are" : "field is";
      toast.error(`${missing.join(", ")} ${label} required`);
      return;
    }

    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("nutritionist", nutritionist);

    setLoading(true);
    const toastId = toast.loading("Uploading article...");

    try {
      let res;
      if (article && (article._id || article.id)) {
        const id = article._id || article.id;
        res = await api.put(`/admin/article/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/admin/article", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(article ? "Article updated" : "Article added", {
        id: toastId,
      });

      if (!article) {
        setTitle("");
        setSubTitle("");
        setDescription("");
        setNutritionist("");
        setImageFile(null);
        setImagePreview(null);
      }

      onSuccess?.(res?.data || res?.data?.addArticle || res?.data?.article);

      closeModal?.();
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err.message || "Failed to add article";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-xl mx-auto bg-white border p-6 rounded-xl shadow-sm space-y-6"
    >
      {/* Image upload */}
      <div>
        <label className="block font-medium mb-1">
          Image <span className="text-red-500">*</span>
        </label>
        <div className="flex  gap-1 items-center">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-10 h-10 rounded object-cover border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter title"
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring focus:border-blue-500"
          disabled={loading}
        />
      </div>

      {/* SubTitle */}
      <div>
        <label className="block font-medium mb-1">
          Sub Title <span className="text-red-500">*</span>
        </label>
        <input
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          type="text"
          placeholder="Enter sub title"
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring focus:border-blue-500"
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none min-h-[90px] focus:ring focus:border-blue-500 resize-none"
          disabled={loading}
        />
      </div>

      {/* Nutritionist */}
      <div>
        <label className="block font-medium mb-1">
          Nutritionist <span className="text-red-500">*</span>
        </label>
        <input
          value={nutritionist}
          onChange={(e) => setNutritionist(e.target.value)}
          type="text"
          placeholder="Enter nutritionist name"
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring focus:border-blue-500"
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
