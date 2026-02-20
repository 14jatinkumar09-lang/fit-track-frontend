import React from 'react'

const ActivityCard = ({svg,label,num,label2}) => {
  return (
    <div className= ' w-[39%] border p-3  rounded-md bg-[#1D293D]  pb-2'>
      <div className='flex gap-2 '>
        <img src={`../public/${svg}.svg`}></img>
        <div className='text-[13px] text-[#90A1B9]'>
            {label} 
        </div>
        
      </div>
      <div className='text-white mt-2'>

      {num}
      </div>
      <div className='text-[13px] text-[#90A1B9]'>
        {label2}
      </div>
    </div>
  )
}

export default ActivityCard
