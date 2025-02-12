import Card from '@/components/Card'

export const metadata = {
  title: 'Favorites - Tools4.tech',
}

async function getFavorites(userId) {
  const response = await fetch(
    `${process.env.URL_API}/favorites/user/121470728`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  )

  return response.json()
}

export default async function Favorites() {
  const favorites = await getFavorites()

  if (favorites && favorites.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <h2 className='text-xl font-semibold mb-4'>No favorites found</h2>
        <p className='text-gray-600'>
          You haven't added any tools to your favorites yet.
        </p>
      </div>
    )
  }

  return (
    <div className='w-4/5 mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>My Favorites</h1>
      <div className='grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-5 gap-5'>
        {favorites.map(fav => (
          <div key={fav.id}>
            <Card tool={fav.tool} isFavorite={true} favoriteId={fav.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
