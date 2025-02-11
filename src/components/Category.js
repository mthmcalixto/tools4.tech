import { FaAngleRight } from 'react-icons/fa'

export default function Category({ id, title, onClick }) {
  return (
    <button
      className={`text-white p-4 bg-[#222] hover:bg-black flex items-center justify-start rounded-md cursor-pointer`}
      onClick={onClick}
      aria-label={`Categoria: ${title}`}
    >
      <FaAngleRight className={`h-5 w-5 mr-3 text-white`} />
      <span className={`flex-grow text-left text-white`}>{title}</span>
    </button>
  )
}
