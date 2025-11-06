import { useState, useEffect, type KeyboardEvent } from "react";
import api, { origin } from "../../API/backapi";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

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

  console.log(article);

  /**
   * article data
   */
  const [title, setTitle] = useState(article?.title || "");
  const [subTitle, setSubTitle] = useState(article?.subTitle || "");
  const [description, setDescription] = useState(article?.description || "");
  const [nutritionist, setNutritionist] = useState(article?.nutritionist || "");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  /**
   * article meta data
   */
  const [totalCarbohydrates, setTotalCarbohydrates] = useState(
    article?.totalCarbohydrates || ""
  );
  const [addedSugars, setAddedSugars] = useState(article?.addedSugars || "");
  const [totalSugars, setTotalSugars] = useState(article?.totalSugars || "");
  const [servingSize, setServingSize] = useState(article?.servingSize || "");
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
  const [secondaryImagePreview, setSecondaryImagePreview] = useState<
    string | null
  >(null);
  const [secondaryObjectUrl, setSecondaryObjectUrl] = useState<string | null>(
    null
  );
  const [secondaryDescription, setSecondaryDescription] = useState(
    article?.secondaryDescription || ""
  );
  const [hiddenSugarNames, setHiddenSugarNames] = useState<string[]>(
    article?.hiddenSugarNames || []
  );
  const [sugarInput, setSugarInput] = useState("");
  const [emptyFields, setEmptyFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (article?.image) {
      setImagePreview(`${origin}/uploads/${article.image}`);
    }
    if (article?.secondaryImage) {
      setSecondaryImagePreview(`${origin}/uploads/${article.secondaryImage}`);
    }
  }, [article]);

  // Clear error highlighting when user starts typing
  useEffect(() => {
    setEmptyFields(new Set());
  }, [
    title,
    subTitle,
    description,
    nutritionist,
    totalCarbohydrates,
    addedSugars,
    totalSugars,
    servingSize,
    imageFile,
    secondaryImage,
    secondaryDescription,
    hiddenSugarNames,
  ]);

  const handleSecondaryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (secondaryObjectUrl) {
      URL.revokeObjectURL(secondaryObjectUrl);
      setSecondaryObjectUrl(null);
    }

    const url = URL.createObjectURL(file);
    setSecondaryObjectUrl(url);
    setSecondaryImage(file);
    setSecondaryImagePreview(url);
  };

  const handleSugarNameInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && sugarInput.trim()) {
      e.preventDefault();
      if (!hiddenSugarNames.includes(sugarInput.trim())) {
        setHiddenSugarNames([...hiddenSugarNames, sugarInput.trim()]);
      }
      setSugarInput("");
    }
  };

  const removeSugarName = (name: string) => {
    setHiddenSugarNames(hiddenSugarNames.filter((sugar) => sugar !== name));
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses =
      "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring focus:border-blue-500";
    return `${baseClasses} ${
      emptyFields.has(fieldName) ? "border-red-500" : ""
    }`;
  };

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
      if (secondaryObjectUrl) {
        URL.revokeObjectURL(secondaryObjectUrl);
      }
    };
  }, [objectUrl, secondaryObjectUrl]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasImage = !!imageFile || !!imagePreview;
    const hasSecondaryImage = !!secondaryImage || !!secondaryImagePreview;

    // Clear previous empty fields
    setEmptyFields(new Set());

    // Check each field and collect empty ones
    const newEmptyFields = new Set<string>();
    const missing: string[] = [];

    if (!title.trim()) {
      newEmptyFields.add("title");
      missing.push("Title");
    }
    if (!subTitle.trim()) {
      newEmptyFields.add("subTitle");
      missing.push("Sub Title");
    }
    if (!description.trim()) {
      newEmptyFields.add("description");
      missing.push("Description");
    }
    if (!nutritionist.trim()) {
      newEmptyFields.add("nutritionist");
      missing.push("Nutritionist");
    }
    if (!totalCarbohydrates.trim()) {
      newEmptyFields.add("totalCarbohydrates");
      missing.push("Total Carbohydrates");
    }
    if (!addedSugars.trim()) {
      newEmptyFields.add("addedSugars");
      missing.push("Added Sugars");
    }
    if (!totalSugars.trim()) {
      newEmptyFields.add("totalSugars");
      missing.push("Total Sugars");
    }
    if (!servingSize.trim()) {
      newEmptyFields.add("servingSize");
      missing.push("Serving Size");
    }
    if (!hasImage) {
      newEmptyFields.add("image");
      missing.push("Image");
    }
    if (!hasSecondaryImage) {
      newEmptyFields.add("secondaryImage");
      missing.push("Secondary Image");
    }
    if (!secondaryDescription.trim()) {
      newEmptyFields.add("secondaryDescription");
      missing.push("Secondary Description");
    }
    if (hiddenSugarNames.length === 0) {
      newEmptyFields.add("hiddenSugarNames");
      missing.push("Hidden Sugar Names");
    }

    if (missing.length > 0) {
      setEmptyFields(newEmptyFields);
      const label = missing.length > 1 ? "fields are" : "field is";
      toast.error(`${missing.join(", ")} ${label} required`);
      return;
    }

    const formData = new FormData();
    const metaFormData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("nutritionist", nutritionist);

    metaFormData.append("totalCarbohydrates", totalCarbohydrates);
    metaFormData.append("addedSugars", addedSugars);
    metaFormData.append("totalSugars", totalSugars);
    metaFormData.append("servingSize", servingSize);
    metaFormData.append("description", secondaryDescription);
    metaFormData.append("hiddenSugarNames", JSON.stringify(hiddenSugarNames));

    if (secondaryImage) {
      metaFormData.append("image", secondaryImage);
    }

    setLoading(true);
    const toastId = toast.loading("Uploading article...");

    try {
      let res;
      if (article && (article._id || article.id)) {
        res = await api.put(
          `/admin/updateArticle/?articleId=${article._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        await api.put(
          `/admin/updateKeyNumber/?keyNumberId=${article.keyNumberId}`,
          metaFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        res = await api.post("/admin/addArticle", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const articleId = res?.data?.addArticle?.id;
        metaFormData.append("articleId", articleId);

        await api.post("/admin/addKeyNumber", metaFormData, {
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
        setTotalCarbohydrates("");
        setAddedSugars("");
        setTotalSugars("");
        setServingSize("");
        setSecondaryImage(null);
        setSecondaryImagePreview(null);
        setSecondaryDescription("");
        setHiddenSugarNames([]);
        setSugarInput("");
      }

      onSuccess?.(res?.data || res?.data?.addArticle || res?.data?.article);

      closeModal?.();
    } catch (err: any) {
      console.log(err);

      const message =
        err?.response?.data?.message ||
        article ? "Failed to update article" :"Failed to add article";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-4xl mx-auto bg-white border p-6 rounded-xl shadow-sm space-y-6"
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
          className={getInputClassName("title")}
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
          className={getInputClassName("subTitle")}
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
          className={`${getInputClassName(
            "description"
          )} min-h-[90px] resize-none`}
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
          className={getInputClassName("nutritionist")}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Total Carbohydrates */}
        <div>
          <label className="block font-medium mb-1">
            Total Carbohydrates <span className="text-red-500">*</span>
          </label>
          <input
            value={totalCarbohydrates}
            onChange={(e) => setTotalCarbohydrates(e.target.value)}
            type="text"
            placeholder="Enter total carbohydrates"
            className={getInputClassName("totalCarbohydrates")}
            disabled={loading}
          />
        </div>

        {/* Total Sugars */}
        <div>
          <label className="block font-medium mb-1">
            Total Sugars <span className="text-red-500">*</span>
          </label>
          <input
            value={totalSugars}
            onChange={(e) => setTotalSugars(e.target.value)}
            type="text"
            placeholder="Enter total sugars"
            className={getInputClassName("totalSugars")}
            disabled={loading}
          />
        </div>

        {/* Added Sugars */}
        <div>
          <label className="block font-medium mb-1">
            Added Sugars <span className="text-red-500">*</span>
          </label>
          <input
            value={addedSugars}
            onChange={(e) => setAddedSugars(e.target.value)}
            type="text"
            placeholder="Enter added sugars"
            className={getInputClassName("addedSugars")}
            disabled={loading}
          />
        </div>

        {/* Serving Size */}
        <div>
          <label className="block font-medium mb-1">
            Serving Size <span className="text-red-500">*</span>
          </label>
          <input
            value={servingSize}
            onChange={(e) => setServingSize(e.target.value)}
            type="text"
            placeholder="Enter serving size"
            className={getInputClassName("servingSize")}
            disabled={loading}
          />
        </div>
      </div>

      {/* Hidden Sugar Names */}
      <div>
        <label className="block font-medium mb-1">
          Hidden Sugar Names <span className="text-red-500">*</span>
        </label>
        <input
          value={sugarInput}
          onChange={(e) => setSugarInput(e.target.value)}
          onKeyDown={handleSugarNameInput}
          type="text"
          placeholder="Type and press Enter to add hidden sugar names"
          className={getInputClassName("hiddenSugarNames")}
          disabled={loading}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {hiddenSugarNames.map((sugar, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              <span>{sugar}</span>
              <button
                type="button"
                onClick={() => removeSugarName(sugar)}
                className="hover:text-blue-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Image */}
      <div>
        <label className="block font-medium mb-1">
          Secondary Image <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1 items-center">
          {secondaryImagePreview && (
            <img
              src={secondaryImagePreview}
              alt="secondary preview"
              className="w-10 h-10 rounded object-cover border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleSecondaryImage}
            className="w-full text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Secondary Description */}
      <div>
        <label className="block font-medium mb-1">
          Secondary Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={secondaryDescription}
          onChange={(e) => setSecondaryDescription(e.target.value)}
          placeholder="Enter secondary description"
          className={`${getInputClassName(
            "secondaryDescription"
          )} min-h-[90px] resize-none`}
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
