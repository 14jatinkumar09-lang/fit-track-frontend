import React from 'react'

const FoodTypeCard = ({onClick,label,value}) => {
    // console.log("props" , value , label)
  return (
    <button onClick={onClick} name={label} className={`${label === value ? "text-blue-500" : null }  rounded-xl backdrop-brightness-80 p-2 text `}>{label}</button>
  )
}

export default FoodTypeCard
