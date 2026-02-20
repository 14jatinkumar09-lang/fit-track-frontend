import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { InputBox } from "../components/InputBox";
import { editProfileThunk, fetchBodyDetailsThunk } from "../store/slice/UserBody.slice";

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { height, weight, goal, caloriesIntakeTarget, caloriesBurnedTarget } = useSelector((state) => state.userBody);

  const [form, setForm] = useState({
    height: height || "",
    weight: weight || "",
    goal: goal || "",
    caloriesIntakeTarget: caloriesIntakeTarget || "",
    caloriesBurnedTarget: caloriesBurnedTarget || "",
  });

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveOnboarding() {
    if (!form.height || !form.weight || !form.goal || !form.caloriesIntakeTarget || !form.caloriesBurnedTarget) {
      toast.error("Please fill all fields");
      return;
    }

    const res = await dispatch(editProfileThunk(form));
    if (res.meta?.requestStatus === "fulfilled") {
      toast.success("Details saved");
      dispatch(fetchBodyDetailsThunk());
      navigate("/");
      return;
    }

    toast.error(res?.payload?.response?.data?.msg || "Unable to save details");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">Complete Your Profile</h1>
        <p className="text-slate-600 mt-1 mb-4">Set your current body details and goal.</p>

        <InputBox
          label={"Height"}
          name={"height"}
          value={form.height}
          onChange={onChange}
          placeholder={"e.g. 178 cm"}
        />

        <InputBox
          label={"Weight"}
          name={"weight"}
          value={form.weight}
          onChange={onChange}
          placeholder={"e.g. 72 kg"}
        />

        <InputBox
          label={"Target Calories Per Day"}
          name={"caloriesIntakeTarget"}
          value={form.caloriesIntakeTarget}
          onChange={onChange}
          placeholder={"e.g. 2200"}
        />

        <InputBox
          label={"Calories To Burn Per Day"}
          name={"caloriesBurnedTarget"}
          value={form.caloriesBurnedTarget}
          onChange={onChange}
          placeholder={"e.g. 500"}
        />

        <div className="m-1 p-3 text-left">
          <label className="font-medium" htmlFor="goal">Goal</label>
          <select
            id="goal"
            name="goal"
            value={form.goal}
            onChange={onChange}
            className="border w-full rounded-md py-2 px-3 focus:outline-none focus:border-2 focus:border-blue-500"
          >
            <option value="" className="text-black">Select goal</option>
            <option className="text-black">Maintain weight</option>
            <option className="text-black">Gain weight</option>
            <option className="text-black">Loose weight</option>
          </select>
        </div>

        <button
          className="mt-4 w-full rounded-md py-2 text-white bg-[#00BC7D] hover:cursor-pointer"
          onClick={saveOnboarding}
        >
          Save and Continue
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default Onboarding;
