import React from 'react'

const StatusBar = ({current,limit,svg,label,color}) => {
  return (
    <>
    <div className="flex gap-3 p-3">
            <img src={`${svg}`}></img>

            <div className="flex justify-between w-full">
              <div>
              <div className="text-[13px] text-[#90A1B9]">{label}</div>
              <div className="text-white">{current}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#90A1B9]">limit</div>
              <div className="text-white">{limit}</div>
            </div>
            </div>
            

          </div>
          <div className="flex flex-col text-[13px] text-[#00BC7D] font-bold px-3">
            <input onChange={(e)=>{}} className={`w-full disabled: text-[${color}]`} type="range" color='red' value={current} max={limit} />
            <div>{limit-current >= 0 ? limit-current : 0  } calories remaining</div>
          </div>
    </>
  )
}

export default StatusBar
