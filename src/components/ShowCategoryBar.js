import { headers } from 'next/headers'
import Category from './Category'

const getCategories = async () => {
  const response = await fetch(`${process.env.URL_API}/categories`, {
    method: 'GET',
  })

  const data = await response.json()

  return data
}

export default async function ShowCategoryBar() {
  const headerList = await headers()
  const pathname = headerList.get('x-current-path')

  const excludedPaths = ['/contributors', '/addtools']

  const showCategoryBar = !excludedPaths.includes(pathname)

  const categories = await getCategories()

  return (
    showCategoryBar && (
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full container mx-auto p-5 gap-2 mt-4'>
          {categories.length === 0 ? (
            <div className='flex justify-center items-center gap-3 flex-col mt-6'>
              <span className='text-5xl text-neutral-700'>
                <TbMoodEmpty />
              </span>
              <p className='text-white'>Error loading categories!</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-4 gap-4'>
              {categories.map(category => (
                <Category
                  key={category.id}
                  id={category.id}
                  title={category.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  )
}
