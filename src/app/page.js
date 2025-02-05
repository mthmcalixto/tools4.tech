import ShowCategoryBar from '@/components/ShowCategoryBar'
import { GetRepoStars } from '@/utils'
import Link from 'next/link'

export default async function Home() {
  const stars = await GetRepoStars('mateusarcedev', 'tools4.tech')

  return (
    <>
      <ShowCategoryBar />
      <div className='bg-[#111] flex flex-col text-gray-300'>
        <main className='container mx-auto px-4 py-8 md:py-16 space-y-8 md:space-y-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <section className='space-y-4 p-6 bg-[#222] rounded-lg'>
              <h2 className='text-2xl font-bold text-white'>Objective</h2>
              <p className='text-md leading-relaxed'>
                Tools4.tech aims to be a centralized hub of resources,
                benefiting both novice and experienced programmers. By
                consolidating a wide range of tools and study materials in one
                place, the project seeks to simplify the learning and
                development process, making it more accessible and efficient for
                all programming experience levels.
              </p>
            </section>

            <section className='space-y-4 p-6 bg-[#222] rounded-lg'>
              <h2 className='text-2xl font-bold text-white'>Contributions</h2>
              <p className='text-md leading-relaxed'>
                The developer community is invited to contribute to this
                project, whether by adding new tools, updating existing
                information, or suggesting improvements. Together, we can create
                an even more valuable resource for the software development
                community.
              </p>
            </section>
          </div>

          <section className='space-y-8 text-center'>
            <h2 className='text-3xl font-bold text-white'>
              Project Statistics
            </h2>
            <div className='flex justify-center gap-8'>
              <div className='flex flex-col items-center'>
                <span className='text-4xl font-bold text-white'>{stars}</span>
                <span className='text-sm text-gray-400'>GitHub Stars</span>
              </div>
              <Link
                href='/contributors'
                className='flex flex-col items-center hover:text-white transition-colors duration-300'
              >
                <span className='text-4xl font-bold'>View</span>
                <span className='text-sm text-gray-400'>Contributors</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
