export const MedModal = ({options, handleClick, handleSelect}) => {
    return (
        <td className='flex flex-col items-start bg-white border-2 border-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <button className='self-end text-gray-500 border-2 border-gray-300 shadow-sm rounded w-8 h-8 mb-8 text-lg flex justify-center items-center hover:bg-gray-500 hover:text-gray-100' type="button" onClick={handleClick}>X</button>
            {options?.map((option, index) => (
               <button id={index} key={index} className='leading-8 font-medium hover:text-blue-500' onClick={(e) => handleSelect(e, index)}>{option}</button> 
            ))}
        </td>
    )
}