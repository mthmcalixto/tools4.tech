import Card from '@/components/Card'
import { FaExclamationTriangle } from 'react-icons/fa'

export const metadata = {
  title: 'Tools - Tools4.tech',
}

const getToolsByCategory = async categoryId => {
  const response = await fetch(
    `${process.env.URL_API}/tools/category/${categoryId}`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()

  return data
}

export default async function ToolsPage({ params }) {
  const categoryId = (await params).slug

  const tools = await getToolsByCategory(categoryId)

  if (!tools || tools.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <FaExclamationTriangle className='text-4xl text-red-500 mb-4' />
        <h2 className='text-xl font-semibold mb-4'>
          No tools in this category
        </h2>
        <p className='text-gray-600'>
          The selected category has no tools available.
        </p>
      </div>
    )
  }

  return (
    <div className='w-4/5 mx-auto py-8'>
      <div className='flex flex-wrap items-center justify-center gap-6'>
        {tools.map(tool => (
          <Card key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}
