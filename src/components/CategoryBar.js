'use client'

import Category from '@/components/Category'
import CategoriesDataTest from '@/data/categories.json'
import { AxiosConfig } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { TbMoodEmpty } from 'react-icons/tb'

const fetchCategories = async () => {
  const { data } = await AxiosConfig.get('/categories')
  return data
}

export default function CategoryBar() {
  const router = useRouter()

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const handleCategoryClick = useCallback(
    categoryId => {
      router.push(`/tools/${categoryId}`)
    },
    [router],
  )

  if (process.env.NEXT_PUBLIC_DEV !== 'true' && error)
    return (
      <div className='flex justify-center items-center gap-3 flex-col mt-6'>
        <span className='text-5xl text-neutral-700'>
          <TbMoodEmpty />
        </span>
        <p className='text-white'>Error loading categories!</p>
      </div>
    )

  return (
    <div className='w-full container mx-auto p-5 gap-2 mt-4'>
      {process.env.NEXT_PUBLIC_DEV == 'true' && (
        <div className='grid grid-cols-[auto] tablet:grid-cols-[auto_auto] desktop:grid-cols-[auto_auto_auto] gap-4'>
          {CategoriesDataTest?.map(category => (
            <Category
              key={category.id}
              id={category.id}
              title={category.name}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      )}

      {process.env.NEXT_PUBLIC_DEV !== 'true' &&
        (isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(3)].map((_, index) => (
              <div key={index} className='shrink-0'>
                <div className='h-12 bg-[#222] rounded-md animate-pulse'></div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {categories?.map(category => (
              <Category
                key={category.id}
                id={category.id}
                title={category.name}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        ))}
    </div>
  )
}
