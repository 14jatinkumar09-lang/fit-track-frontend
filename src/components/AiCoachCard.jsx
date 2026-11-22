import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addFoodItem, fetchFoodLog } from "../store/slice/FoodLog.slice.js";
import { addActivityThunk, fetchActivityItems } from "../store/slice/Activity.slice.js";
import toast from "react-hot-toast";
import {
  Sparkles,
  RotateCw,
  Utensils,
  Dumbbell,
  Flame,
  Clock,
  Lightbulb,
  Plus,
  CheckCircle,
} from "lucide-react";

const AiCoachCard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [addedMeal, setAddedMeal] = useState(false);
  const [addedActivity, setAddedActivity] = useState(false);

  async function fetchRecommendation() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/recommendations`,
        {},
        {
          withCredentials: true,
          timeout: 45000,
        }
      );

      if (res.data?.data) {
        setRecommendation(res.data.data);
        setAddedMeal(false);
        setAddedActivity(false);
      } else {
        throw new Error(res.data?.msg || "Could not retrieve recommendation");
      }
    } catch (err) {
      console.error("AI Coach error:", err);
      const msg = err?.response?.data?.msg || err.message || "Failed to load AI recommendation";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecommendation();
  }, []);

  async function handleQuickAddMeal(food) {
    if (!food || addedMeal) return;
    try {
      const res = await dispatch(
        addFoodItem({
          foodName: food.suggestedDish,
          kcal: Number(food.estimatedCalories),
          foodType: String(food.mealType || "snack").toLowerCase(),
        })
      );
      if (res?.meta?.requestStatus === "fulfilled") {
        setAddedMeal(true);
        toast.success(`Logged "${food.suggestedDish}" to Food Log!`);
        dispatch(fetchFoodLog());
      } else {
        toast.error("Failed to add meal to log");
      }
    } catch (e) {
      toast.error(e.message || "Failed to log meal");
    }
  }

  async function handleQuickAddActivity(act) {
    if (!act || addedActivity) return;
    try {
      const res = await dispatch(
        addActivityThunk({
          activityName: act.activity,
          kcalBurned: Number(act.estimatedBurn),
          activityTime: Number(act.durationMinutes),
          foodType: act.activity,
        })
      );
      if (res?.meta?.requestStatus === "fulfilled") {
        setAddedActivity(true);
        toast.success(`Logged "${act.activity}" to Activity Log!`);
        dispatch(fetchActivityItems());
      } else {
        toast.error("Failed to add activity to log");
      }
    } catch (e) {
      toast.error(e.message || "Failed to log activity");
    }
  }

  function getActionBadge(type) {
    if (type === "eat") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Utensils size={13} /> Recommended: Eat Next
        </span>
      );
    }
    if (type === "activity") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Dumbbell size={13} /> Recommended: Workout / Recovery
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
        <Sparkles size={13} /> Recommended: Fuel & Move
      </span>
    );
  }

  return (
    <div className="w-[80%] rounded-2xl bg-gradient-to-br from-[#131F33] via-[#1D293D] to-[#131F33] border border-[#2D3F59] p-5 text-white shadow-xl relative overflow-hidden">
      {/* Background Glow Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              AI Daily Coach
            </h3>
            <p className="text-[11px] text-gray-400">
              Personalized next action based on today's intake & workouts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {recommendation && getActionBadge(recommendation.actionType)}
          <button
            onClick={fetchRecommendation}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh AI recommendation"
          >
            <RotateCw size={13} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Thinking..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      {loading && !recommendation ? (
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 animate-pulse">
            Analyzing today's food, workouts, and targets with AI...
          </p>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-sm text-red-400 mb-3">{error}</p>
          <button
            onClick={fetchRecommendation}
            className="px-4 py-1.5 rounded-md text-xs bg-[#00BC7D] text-white hover:bg-[#009b67] cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : recommendation ? (
        <div className="mt-4 space-y-4">
          {/* Status & Summary */}
          <div className="bg-[#0F172B]/70 border border-gray-700/50 rounded-xl p-3.5">
            <h4 className="text-sm font-semibold text-emerald-400 mb-1">
              {recommendation.statusTitle}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {recommendation.summary}
            </p>
          </div>

          {/* Dual Recommendation Grid: Food & Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* What to Eat Next */}
            {recommendation.foodRecommendation && (
              <div
                className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                  recommendation.actionType === "eat" || recommendation.actionType === "both"
                    ? "bg-[#162338] border-emerald-500/40 shadow-sm"
                    : "bg-[#111A29] border-gray-700/40 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Utensils size={13} /> What to Eat Next
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 capitalize">
                      {recommendation.foodRecommendation.mealType || "Meal"}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white mb-1">
                    {recommendation.foodRecommendation.suggestedDish}
                  </h5>

                  <div className="flex items-center gap-3 text-xs text-gray-300 mb-2">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Flame size={13} />
                      ~{recommendation.foodRecommendation.estimatedCalories} kcal
                    </span>
                    {recommendation.foodRecommendation.nutritionalFocus && (
                      <span className="text-[11px] text-gray-400 truncate">
                        • {recommendation.foodRecommendation.nutritionalFocus}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                    {recommendation.foodRecommendation.reason}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAddMeal(recommendation.foodRecommendation)}
                  disabled={addedMeal}
                  className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    addedMeal
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default"
                      : "bg-[#00BC7D] hover:bg-[#009b67] text-white shadow"
                  }`}
                >
                  {addedMeal ? (
                    <>
                      <CheckCircle size={13} />
                      <span>Meal Logged Today</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>Quick Add to Food Log</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Recommended Activity */}
            {recommendation.activityRecommendation && (
              <div
                className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                  recommendation.actionType === "activity" || recommendation.actionType === "both"
                    ? "bg-[#162338] border-amber-500/40 shadow-sm"
                    : "bg-[#111A29] border-gray-700/40 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400 flex items-center gap-1.5">
                      <Dumbbell size={13} /> Suggested Activity
                    </span>
                    {recommendation.activityRecommendation.intensity && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300">
                        {recommendation.activityRecommendation.intensity} Intensity
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-white mb-1">
                    {recommendation.activityRecommendation.activity}
                  </h5>

                  <div className="flex items-center gap-3 text-xs text-gray-300 mb-2">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Clock size={13} />
                      {recommendation.activityRecommendation.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1 text-red-400 font-semibold">
                      <Flame size={13} />
                      ~{recommendation.activityRecommendation.estimatedBurn} kcal
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                    {recommendation.activityRecommendation.reason}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAddActivity(recommendation.activityRecommendation)}
                  disabled={addedActivity}
                  className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    addedActivity
                      ? "bg-amber-600/30 text-amber-300 border border-amber-500/40 cursor-default"
                      : "bg-amber-600 hover:bg-amber-700 text-white shadow"
                  }`}
                >
                  {addedActivity ? (
                    <>
                      <CheckCircle size={13} />
                      <span>Activity Logged Today</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>Quick Add to Activity Log</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Coach Tip */}
          {recommendation.coachTip && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
              <Lightbulb size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-300 mr-1.5">Coach Tip:</span>
                <span>{recommendation.coachTip}</span>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AiCoachCard;
