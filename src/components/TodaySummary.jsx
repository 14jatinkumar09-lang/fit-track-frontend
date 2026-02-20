const TodaySummary = ({totalMeals, totalCalories, activeTime}) => {
  return (
    <div className="w-full max-w-sm rounded-xl bg-gradient-to-br from-[#0B1220] to-[#0F172B] p-5 shadow-lg border border-[#1D293D]">
      <h3 className="text-sm text-gray-300 mb-4">Today's Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Meals logged</span>
          <span className="text-white font-medium">{totalMeals?totalMeals:"-"}</span>
        </div>

        <div className="h-px bg-[#1D293D]" />

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total calories</span>
          <span className="text-white font-medium">{totalCalories ? totalCalories+" kcal" : "-" } </span>
        </div>

        <div className="h-px bg-[#1D293D]" />

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Active time</span>
          <span className="text-white font-medium">{activeTime ?activeTime+" mins":"-"} </span>
        </div>
      </div>
    </div>
  );
};

export default TodaySummary;
