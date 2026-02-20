import React from 'react'

const FoodLogCard = ({foodName, svg , calories , type , onClick}) => {
  return (
    <div className='rounded-xl mb-3 p-3 bg-[#1D293D] '>
        <div className='flex justify-between'>
            <div className='flex gap-2'>
                <div><img src={`/${svg}.svg`} ></img></div>
                <div className='mt-2'>{type}</div>
                </div>
            <div className='mt-2'>{calories} kcal</div>
        </div>
<div className='flex justify-between '>
    <div className='flex w-full justify-between px-4 py-4 backdrop-brightness-75 border-transparent rounded-xl mt-4'>
            <div>{foodName}</div>
            <div className='text-[12px] text-[#90A1B9]'>{calories} kcal </div>
        </div>
        <button onClick={onClick} className='hover:cursor-pointer' ><img src='../public/delete.svg'></img></button>
</div>
        
         
      
    </div>
  )
}

export default FoodLogCard
