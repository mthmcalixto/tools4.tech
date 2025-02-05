'use client'

import { usePathname } from 'next/navigation'
import CategoryBar from './CategoryBar'

export default function ShowCategoryBar() {
  const pathname = usePathname()

  const excludedPaths = ['/contributors', '/addtools']

  const showCategoryBar = !excludedPaths.includes(pathname)

  return (
    showCategoryBar && (
      <div className='flex flex-col items-center justify-center'>
        <CategoryBar />
      </div>
    )
  )
}
