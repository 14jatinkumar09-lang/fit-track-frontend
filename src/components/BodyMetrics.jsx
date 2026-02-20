import React from 'react'

const BodyMetrics = ({svg,height ,weight}) => {
  return (
    <div className= '  w-[80%] border p-3  rounded-md bg-[#1D293D]  pb-2'>
      <div className='flex gap-2 '>
        <img src={`../public/${svg}.svg`}></img>
        <div>
            <div className='text-[13px] text-white font-medium'>
            Body Metric 
        </div>
         <div className='text-[11px] text-[#90A1B9]'>
            Your Stats 
        </div>
        </div>
    
      </div>
      <div className=' text-white mt-2 flex justify-between'>
<div className='flex text-[14px] text-[#90A1B9] '> <img src='../public/weight.svg'></img>
  <div className=' mt-1 text-[11px] text-[#90A1B9]'>Weight</div>
 </div>
 <div>{weight}</div>
      
      </div>
      <div className=' text-white mt-2 flex justify-between'>
<div className='flex text-[14px] text-[#90A1B9] '> <img src='../public/height.svg'></img>
  <div className=' mt-1 text-[11px] text-[#90A1B9]'>Height</div>
 </div>
 <div>{height}</div>
      
      </div>
      
    </div>
  )
}

export default BodyMetrics
