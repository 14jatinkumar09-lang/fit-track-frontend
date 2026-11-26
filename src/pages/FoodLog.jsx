import { useEffect, useRef, useState } from "react";
import TopBar from "../components/TopBar";
import FoodTypeCard from "../components/FoodTypeCard";
import FoodLogCard from "../components/FoodLogCard";
import { useDispatch, useSelector } from "react-redux";
import { addFoodItem, fetchFoodLog, analyzeFoodSnapThunk } from "../store/slice/FoodLog.slice.js";
import toast, { Toaster } from "react-hot-toast";
import { deleteItemThunk } from '../store/slice/Activity.slice.js';
import Button2 from '@mui/material/Button';
import { Sparkles, FileText, X, Sparkle } from "lucide-react";

const FoodLog = () => {
  const dispatch = useDispatch();
  const [foodNameInput, setFoodNameInput] = useState("");
  const [caloriesInput, setCaloriesInput] = useState("");
  const [foodTypeToggle, setFoodTypeToggle] = useState("");
  const [selected, setSelected] = useState(false);
  const [isSnapLoading, setIsSnapLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const foodLog = useSelector(state => state.foodLog.foodIntake);
  const loading = useSelector(state => state.foodLog.loading);

  function getMimeType(file) {
    if (!file) return "";
    const name = (file.name || "").toLowerCase();
    if (file.type === "application/pdf" || name.endsWith(".pdf")) {
      return "application/pdf";
    }
    if (file.type === "image/png" || name.endsWith(".png")) {
      return "image/png";
    }
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg")
    ) {
      return "image/jpeg";
    }
    if (file.type === "image/webp" || name.endsWith(".webp")) {
      return "image/webp";
    }
    return file.type || "";
  }

  function isSupportedFile(file) {
    const mime = getMimeType(file);
    return ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(mime);
  }

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          reject(new Error("Could not read selected file."));
          return;
        }
        const commaIndex = result.indexOf(",");
        if (commaIndex === -1) {
          reject(new Error("Could not extract data from file."));
          return;
        }
        resolve(result.slice(commaIndex + 1));
      };
      reader.onerror = () => reject(new Error("Could not read selected file."));
      reader.readAsDataURL(file);
    });
  }

  function normalizeFoodType(value) {
    const raw = String(value || "").toLowerCase().trim();
    if (!raw) return "snack";
    if (raw.includes("break")) return "breakfast";
    if (raw.includes("lunch")) return "lunch";
    if (raw.includes("dinner")) return "dinner";
    return "snack";
  }

  async function handleSnapFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupportedFile(file)) {
      toast.error("Please upload a JPEG, PNG image or a PDF document.");
      event.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size exceeds 20MB limit.");
      event.target.value = "";
      return;
    }

    const mimeType = getMimeType(file);
    setIsSnapLoading(true);

    try {
      const base64Data = await fileToBase64(file);

      if (mimeType.startsWith("image/")) {
        setFilePreview({ type: "image", url: `data:${mimeType};base64,${base64Data}`, name: file.name });
      } else {
        setFilePreview({ type: "pdf", name: file.name });
      }

      // Send to secure backend endpoint (No client API key required!)
      const res = await dispatch(analyzeFoodSnapThunk({ mimeType, base64Data }));

      if (res?.meta?.requestStatus === "fulfilled") {
        const payload = res.payload;
        const suggestedName = String(payload?.foodName || "").trim();
        const suggestedCalories = Math.round(Number(payload?.kcal));
        const suggestedType = normalizeFoodType(payload?.foodType);

        if (!suggestedName || !Number.isFinite(suggestedCalories) || suggestedCalories <= 0) {
          throw new Error("Could not extract food name/calories from file.");
        }

        // Set into input fields and UI
        setFoodNameInput(suggestedName);
        setCaloriesInput(suggestedCalories);
        setFoodTypeToggle(suggestedType);
        setSelected(true);
        toast.success(`AI estimated: ${suggestedName} (${suggestedCalories} kcal)`);
      } else {
        const errorMsg = res?.payload?.msg || "Failed to analyze food snap. Check server GEMINI_API_KEY.";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      toast.error(error?.message || "Failed to analyze food snap.");
    } finally {
      setIsSnapLoading(false);
      event.target.value = "";
    }
  }

  function handleUseDemoEstimate() {
    const samples = [
      { foodName: "Avocado Toast with Poached Egg", kcal: 340, foodType: "breakfast" },
      { foodName: "Grilled Chicken & Quinoa Salad", kcal: 480, foodType: "lunch" },
      { foodName: "Greek Yogurt with Berries & Honey", kcal: 210, foodType: "snack" },
      { foodName: "Baked Salmon with Steamed Broccoli", kcal: 560, foodType: "dinner" },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setFoodNameInput(picked.foodName);
    setCaloriesInput(picked.kcal);
    setFoodTypeToggle(picked.foodType);
    setSelected(true);
    setFilePreview({ type: "image", name: `${picked.foodName.toLowerCase().replace(/\s+/g, "_")}.jpg` });
    toast.success(`Demo estimate: ${picked.foodName} (${picked.kcal} kcal)`);
  }

  function totalCalories() {
    let totalCalories = 0;
    foodLog?.forEach(i => {
      totalCalories += Number(i.kcal) || 0;
    });
    return totalCalories;
  }

  function handleClick(e) {
    if (foodTypeToggle === e.target.name) {
      setSelected(selected ? false : true);
      setFoodTypeToggle("");
      return;
    }

    setFoodTypeToggle(e.target.name);
    setSelected(true);
  }

  useEffect(() => {
    async function fetch() {
      await dispatch(fetchFoodLog());
    }
    fetch();
  }, [dispatch]);

  return (
    <div className="ml-0 md:ml-64 h-screen border-red-500 w-full md:w-[calc(100%-16rem)] overflow-x-hidden dark:bg-[#020618]">
      <TopBar
        label={"Food Log"}
        label2={"Track your daily intake"}
        label3={"Today's Total"}
        label4={totalCalories() + " kcals"}
        color={"#00D492"}
      />
      <div className="w-full h-[calc(100vh-130px)] md:min-h-[calc(100vh-130px)] border p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[45%] flex flex-col gap-3">
          <div className="rounded-xl text-center md:text-start text-white font-medium p-3 bg-[#1D293D] w-full">
            Quick Add
            <div className="flex flex-wrap my-10 gap-1 mt-5">
              <FoodTypeCard onClick={handleClick} label={"breakfast"} value={foodTypeToggle} />
              <FoodTypeCard onClick={handleClick} label={"lunch"} value={foodTypeToggle} />
              <FoodTypeCard onClick={handleClick} label={"snack"} value={foodTypeToggle} />
              <FoodTypeCard onClick={handleClick} label={"dinner"} value={foodTypeToggle} />
            </div>

            {selected && (
              <div className="flex flex-col gap-2 justify-center mt-3">
                <input
                  value={foodNameInput}
                  onChange={(e) => setFoodNameInput(e.target.value)}
                  className="border border-gray-600 rounded px-3 py-2 text-white bg-[#0F172B] focus:outline-none focus:border-[#00BC7D]"
                  placeholder="enter food name"
                />
                <input
                  type="number"
                  value={!caloriesInput ? "" : caloriesInput}
                  onChange={(e) => setCaloriesInput(Number(e.target.value))}
                  className="border border-gray-600 rounded px-3 py-2 text-white bg-[#0F172B] focus:outline-none focus:border-[#00BC7D]"
                  placeholder="enter calories (kcal)"
                />
              </div>
            )}
          </div>

          {!loading ? (
            <button
              onClick={async () => {
                if (!foodNameInput || !caloriesInput || !foodTypeToggle) {
                  toast.dismiss();
                  if (!foodTypeToggle) {
                    toast("Select Food Type");
                    return;
                  }
                  if (!foodNameInput || !caloriesInput) {
                    toast("Enter food name / calories");
                  }
                  return;
                }

                const res = await dispatch(
                  addFoodItem({
                    foodName: foodNameInput,
                    kcal: caloriesInput,
                    foodType: foodTypeToggle,
                  })
                );
                if (res?.meta?.requestStatus === "fulfilled") {
                  toast.dismissAll();
                  toast.success(res?.payload?.msg || "Food added successfully!");
                  dispatch(fetchFoodLog());
                } else {
                  toast.error(res?.payload?.response?.data?.msg || "error");
                }

                setFoodNameInput("");
                setCaloriesInput("");
                setFilePreview(null);
              }}
              className="w-full rounded-md py-2 text-white text-sm bg-[#00BC7D] hover:bg-[#009b67] transition-colors hover:cursor-pointer"
            >
              Add Food Entry
            </button>
          ) : (
            <Button2
              fullWidth
              loading
              style={{ backgroundColor: "#00BC7D", color: "white" }}
              loadingPosition="end"
            />
          )}

          {/* AI Food Snap Section */}
          <div className="flex flex-col gap-2 mt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              onChange={handleSnapFileChange}
              className="hidden"
            />

            {isSnapLoading ? (
              <Button2
                fullWidth
                loading
                style={{
                  backgroundColor: "#00BC7D",
                  color: "white",
                  padding: "8px 0",
                  borderRadius: "0.375rem",
                }}
                loadingPosition="start"
              >
                Analyzing Food Snap with AI...
              </Button2>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-md py-2.5 text-white text-sm font-medium bg-[#00BC7D] hover:bg-[#009b67] transition-all hover:cursor-pointer shadow-md"
              >
                <Sparkles size={16} />
                <span>AI Food Snap (Photo or PDF)</span>
              </button>
            )}

            {/* Snap File Preview Card */}
            {filePreview && (
              <div className="flex items-center justify-between bg-[#1D293D] border border-gray-700 rounded-lg p-2.5 text-xs text-white">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {filePreview.type === "image" && filePreview.url ? (
                    <img
                      src={filePreview.url}
                      alt="Snap preview"
                      className="w-10 h-10 object-cover rounded border border-gray-600 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded flex items-center justify-center shrink-0 border border-red-500/30">
                      <FileText size={20} />
                    </div>
                  )}
                  <div className="truncate">
                    <p className="truncate font-medium">{filePreview.name}</p>
                    <p className="text-[11px] text-emerald-400">
                      {caloriesInput ? `Estimated: ~${caloriesInput} kcal (${foodTypeToggle || "ready"})` : "Analyzed"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFilePreview(null)}
                  className="text-gray-400 hover:text-white p-1 hover:cursor-pointer"
                  title="Clear snap preview"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Supports JPEG, PNG photos & PDF files</span>
              {/* <button
                type="button"
                onClick={handleUseDemoEstimate}
                className="text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1 hover:cursor-pointer"
                title="Fill sample estimate"
              >
                <Sparkle size={12} />
                <span>Demo Sample</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Food Log List Section */}
        <div className="w-full h-[calc(100vh-423px)] overflow-y-auto flex flex-col md:w-[55%] md:h-[calc(100vh-170px)] text-white">
          {foodLog?.map((item, index) => (
            <FoodLogCard
              onClick={async () => {
                const res = await dispatch(deleteItemThunk(item));
                if (res?.meta?.requestStatus === "fulfilled") {
                  dispatch(fetchFoodLog());
                  toast.dismissAll();
                  toast.success(res.payload?.msg || "Item deleted");
                }
              }}
              key={index}
              foodName={item.foodName}
              type={item.foodType}
              calories={item.kcal}
              svg={item.foodType}
            />
          ))}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default FoodLog;
