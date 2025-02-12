import CardsContributors from '@/components/CardsContributors'
import getContributors from '@/utils/getContributors'

export const metadata = {
  title: 'Project Contributors - Tools4.tech',
}

export default async function Contributors() {
  const data = await getContributors('mateusarcedev', 'tools4.tech')

  return (
    <div className='bg-[#111] text-gray-300'>
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

          <CardsContributors data={data} />
        </section>
      </main>
    </div>
  )
}
