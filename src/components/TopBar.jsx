import React from 'react'

const TopBar = ({label, label2 , label3 , label4 , color}) => {
  return (
    <div className=' dark:bg-[#0F172B] text-black h-32.5 dark:text-white border-b-3 dark:border-none border-gray-200 w-full px-5 py-10 flex justify-between '>
      
        <div>
            <div className='font-bold ml-20 md:ml-0 text-md'>{label || "something"}</div>
      <div className='text-[13px] text-[#90A1B9] ml-17 md:ml-0 '>{label2}</div>

        </div>

      <div >
      <div className='text-[13px] text-[#90A1B9] '>{label3}</div>

      <div className={`font-medium text-[${color}] `}>{label4}</div>
      </div>
      
    </div>
  )
}

export default TopBar
