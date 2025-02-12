import Card from '@/components/Card'

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

  return (
    <div className='w-4/5 mx-auto py-8'>
      {tools?.length > 0 && (
        <div className='flex flex-wrap items-center justify-center gap-6'>
          {tools.map(tool => (
            <Card key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}
