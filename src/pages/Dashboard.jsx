import { useEffect } from "react"
import StatusBar from "../components/StatusBar";
import ActivityCard from '../components/ActivityCard'
import BodyMetrics from "../components/BodyMetrics";
import TodaySummary from '../components/TodaySummary'
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityItems, fetchActivityItemsLast7Days } from "../store/slice/Activity.slice";
import { fetchFoodLog, fetchFoodLogLast7Days } from "../store/slice/FoodLog.slice";

function getDayKeyFromTime(timeString) {
  if (!timeString) return "";
  const parsedDate = new Date(timeString);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toDateString();
  }

  return String(timeString).split(" ").slice(0, 4).join(" ");
}

const Dashboard = () => {
  const dispatch = useDispatch() ;

  const userName  = useSelector(state => state.userBody.userName) ;
  
  const weight  = useSelector(state => state.userBody.weight) ;

  const height  = useSelector(state => state.userBody.height) ;
  
  const caloriesIntakeTarget = Number(useSelector(state => state.userBody.caloriesIntakeTarget)) || 0 ;
  const caloriesBurnedTarget = Number(useSelector(state => state.userBody.caloriesBurnedTarget)) || 0 ;

  const foodLog = useSelector(state => state.foodLog.foodIntake) ;
  const foodLogLast7Days = useSelector(state => state.foodLog.last7DaysFoodIntake) ;

  const activities = useSelector( state  => state.activity.activities) ;
  const activitiesLast7Days = useSelector( state  => state.activity.last7DaysActivities) ;

  const totalMinutes = activities?.reduce((a, b) => a + b.activityTime, 0);

  

  // console.log("userName : ", userName)


  function findTotalcaloriesBurned() {
    let total = 0 ;
        activities?.map(i=>{
          total += Number(i.kcalBurned) ;
        })
        // setCaloriesBurned(total) ;
        return total ;
  }
  function findTotalFoodCalories() {
    let total = 0 ;
        foodLog?.map(i=>{
          total += Number(i.kcal) ;
        })
        // setCalories(total) ;
        return total ;
  } 

  function buildLast7DaysSeries() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];

    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      days.push({
        date: day,
        key: day.toDateString(),
        intake: 0,
        burned: 0
      });
    }

    const dayMap = new Map(days.map((d) => [d.key, d]));

    foodLogLast7Days?.forEach((item) => {
      const key = getDayKeyFromTime(item?.time);
      const entry = dayMap.get(key);
      if (!entry) return;
      entry.intake += Number(item?.kcal) || 0;
    });

    activitiesLast7Days?.forEach((item) => {
      const key = getDayKeyFromTime(item?.time);
      const entry = dayMap.get(key);
      if (!entry) return;
      entry.burned += Number(item?.kcalBurned) || 0;
    });

    return days;
  }

  const last7DaysSeries = buildLast7DaysSeries();
  const maxChartValue = Math.max(
    ...last7DaysSeries.map((day) => Math.max(day.intake, day.burned)),
    1
  );




useEffect(()=>{
    dispatch(fetchFoodLog()) ;
    dispatch(fetchActivityItems()) ;
    dispatch(fetchFoodLogLast7Days()) ;
    dispatch(fetchActivityItemsLast7Days()) ;

  },[])

  return (
    <div className="w-full min-h-screen ml-0 md:ml-64 md:w-[calc(100%-16rem)] overflow-x-hidden dark:bg-[#0F172B]">
      <div className=" flex flex-col gap-3 h-69  bg-[#00BC7D] rounded-b-2xl text-white px-4 py-10">

        <div className="text-[12px] ml-20 md:ml-0">Welcome Back</div>
        <div className="text-md font-medium">Hi there ! 🔥 {userName}</div>
        <div className="text-[15px] my-10 border border-[#00BC7D]  rounded-xl backdrop-brightness-93 h-20 p-5 font-bold "> 🔥 Great Workout today 😊keep it up</div>





      </div>
      <div className="flex flex-col  gap-3 items-center">

        <div className=" border rounded-xl bg-[#1D293D] w-[80%] pb-2 -mt-10">

          <StatusBar label={"Calories Consumed"} current={findTotalFoodCalories()} limit={caloriesIntakeTarget} svg={"../public/background.svg"} color={"green"}/>

          <StatusBar label={"Calories Burned"} current={findTotalcaloriesBurned()} limit={caloriesBurnedTarget} svg={"../public/caloriesBurned.svg"}color={"red"}/>

        </div>

        <div className='flex w-full gap-2 justify-center'>

        <ActivityCard label={"Active"} num={totalMinutes} label2={"minutes today"} svg={"activeToday"} />

        <ActivityCard label={"Workouts"} num={activities?.length} label2={"activities logged"} svg={"workout"} />

        </div>
        <div className='flex items-center flex-col w-full gap-2 justify-center '>
          <BodyMetrics weight={weight ?weight +" kg" : "-" } height={height ? height + " cm" : "-" } svg={"bodyMetric"} />
          <TodaySummary totalCalories={findTotalFoodCalories()} totalMeals={foodLog?.length} activeTime={totalMinutes} />

        </div>

        <div className="border rounded-xl bg-[#1D293D] w-[80%] p-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base font-semibold">Last 7 Days Calories</h3>
            <div className="flex items-center gap-4 text-xs text-[#90A1B9]">
              <div className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                Intake
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-400" />
                Burned
              </div>
            </div>
          </div>

          <div className="mt-4 h-44 flex items-end justify-between gap-2 md:gap-4">
            {last7DaysSeries.map((day) => {
              const intakeHeight = (day.intake / maxChartValue) * 100;
              const burnedHeight = (day.burned / maxChartValue) * 100;
              return (
                <div key={day.key} className="flex-1 min-w-0 flex flex-col items-center">
                  <div className="h-28 md:h-32 flex items-end gap-1.5">
                    <div
                      title={`Intake: ${Math.round(day.intake)} kcal`}
                      className="w-2.5 md:w-3.5 rounded-t bg-emerald-400"
                      style={{ height: `${Math.max(intakeHeight, day.intake > 0 ? 4 : 0)}%` }}
                    />
                    <div
                      title={`Burned: ${Math.round(day.burned)} kcal`}
                      className="w-2.5 md:w-3.5 rounded-t bg-red-400"
                      style={{ height: `${Math.max(burnedHeight, day.burned > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-[10px] md:text-xs text-[#90A1B9]">
                    {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        


      </div>

    </div>
  )
}



export default Dashboard
