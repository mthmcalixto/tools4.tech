'use client'

import Card from '@/components/Card'
import CardSkeleton from '@/components/CardSkeleton'
import { Toast } from '@/components/Toast'
import { AxiosConfig } from '@/utils'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

async function fetchToolDetails(toolId) {
  const { data } = await AxiosConfig.get(`/tools/${toolId}`)
  return data
}

async function fetchFavorites() {
  const { data } = await AxiosConfig.get('/favorites')
  return data
}

export default function Favorites() {
  const [toast, setToast] = useState(null)
  const queryClient = useQueryClient()

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  })

  const toolQueries = useQueries({
    queries: Array.isArray(favoritesQuery.data)
      ? favoritesQuery.data.map(favorite => ({
          queryKey: ['tool', favorite.toolId],
          queryFn: () => fetchToolDetails(favorite.toolId),
          staleTime: 1000 * 60 * 10,
          cacheTime: 1000 * 60 * 60,
        }))
      : [],
    enabled:
      Array.isArray(favoritesQuery.data) && favoritesQuery.data.length > 0,
  })

  const favorites = Array.isArray(favoritesQuery.data)
    ? favoritesQuery.data.map((favorite, index) => ({
        ...favorite,
        tool: toolQueries[index]?.data,
      }))
    : []

  const isLoading =
    favoritesQuery.isLoading || toolQueries.some(query => query.isLoading)
  const error = favoritesQuery.error || toolQueries.some(query => query.error)

  const showToast = (message, type) => {
    setToast({ message, type })
  }

  const handleFavoriteRemoved = async favoriteId => {
    await queryClient.invalidateQueries(['favorites'])
    queryClient.setQueryData(['favorites'], old =>
      old?.filter(fav => fav.id !== favoriteId),
    )
    showToast('Item removed from favorites', 'success')
  }

  const prefetchTool = async toolId => {
    await queryClient.prefetchQuery(
      ['tool', toolId],
      () => fetchToolDetails(toolId),
      {
        staleTime: 1000 * 60 * 10,
      },
    )
  }

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <CardSkeleton />
      </div>
    )

  if (error)
    return (
      <div className='flex justify-center items-center h-screen'>
        Error loading your favorites
      </div>
    )

  if (!favorites?.length)
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <h2 className='text-xl font-semibold mb-4'>No favorites found</h2>
        <p className='text-gray-600'>
          You haven't added any tools to your favorites yet.
        </p>
      </div>
    )

  return (
    <div className='w-4/5 mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>My Favorites</h1>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        {favorites.map(favorite => (
          <div
            key={favorite.id}
            onMouseEnter={() => prefetchTool(favorite.tool?.id)}
          >
            <Card
              tool={favorite.tool}
              showToast={showToast}
              onFavoriteRemoved={() => handleFavoriteRemoved(favorite.id)}
              isFavorite={true}
              favoriteId={favorite.id}
            />
          </div>
        ))}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
