'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Contributors() {
  const [contributors, setContributors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('contributions')

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setIsLoading(true)
        const contributorsResponse = await fetch(
          'https://api.github.com/repos/mateusarcedev/tools4.tech/contributors',
        )
        if (!contributorsResponse.ok)
          throw new Error('Failed to fetch contributors')
        const contributorsData = await contributorsResponse.json()

        const detailedContributors = await Promise.all(
          contributorsData.map(async contributor => {
            const userResponse = await fetch(
              `https://api.github.com/users/${contributor.login}`,
            )
            const userData = await userResponse.json()
            return {
              ...contributor,
              followers: userData.followers,
              public_repos: userData.public_repos,
              starred: userData.public_gists,
            }
          }),
        )

        setContributors(detailedContributors)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContributors()
  }, [])

  const filteredAndSortedContributors = contributors
    .filter(contributor =>
      contributor.login.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'contributions':
          return b.contributions - a.contributions
        case 'followers':
          return (b.followers || 0) - (a.followers || 0)
        case 'name':
          return a.login.localeCompare(b.login)
        default:
          return 0
      }
    })

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='bg-red-500 text-white p-4 rounded-lg shadow-lg'>
          <h2 className='font-bold'>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#151515] text-gray-300'>
      <main className='container mx-auto px-4 py-12'>
        <section className='space-y-8'>
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold text-white'>
              Project Contributors
            </h1>
            <p className='text-gray-400 max-w-2xl mx-auto'>
              Thank you to all the amazing contributors who have helped make
              this project possible.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto mb-8'>
            <input
              type='search'
              placeholder='Search contributors...'
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='flex-1 p-2 rounded-lg bg-gray-800 text-white focus:outline-hidden focus:ring-2 focus:ring-gray-600'
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='p-2 rounded-lg bg-gray-800 text-white focus:outline-hidden focus:ring-2 focus:ring-gray-600'
            >
              <option value='contributions'>Most contributions</option>
              <option value='followers'>Most followers</option>
              <option value='name'>Name</option>
            </select>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            <AnimatePresence mode='popLayout'>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className='flex flex-col items-center animate-pulse'
                  >
                    <div className='w-16 h-16 rounded-full bg-gray-700' />
                    <div className='mt-2 w-20 h-4 bg-gray-700 rounded-sm' />
                  </motion.div>
                ))
              ) : filteredAndSortedContributors.length > 0 ? (
                filteredAndSortedContributors.map((contributor, index) => (
                  <motion.div
                    key={contributor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className='p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex flex-col items-center'
                  >
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className='w-16 h-16 rounded-full border-2 border-transparent hover:border-white'
                    />
                    <span className='mt-3 text-sm font-medium text-white'>
                      {contributor.login}
                    </span>
                    <div className='mt-2 text-xs text-gray-400'>
                      Contributions: {contributor.contributions}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className='col-span-full text-center py-8'>
                  <p className='text-gray-400'>
                    No contributors found matching your search.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  )
}
