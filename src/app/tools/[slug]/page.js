'use client'

import Card from '@/components/Card'
import CardSkeleton from '@/components/CardSkeleton'
import { Toast } from '@/components/Toast'
import ToolsDataTest from '@/data/e3a0c113-902a-42b3-8b56-0bd7879703ef.json'
import { AxiosConfig } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const fetchToolsByCategory = async categoryId => {
  if (!categoryId) return null
  const { data } = await AxiosConfig.get(`/tools/category/${categoryId}`)
  return data
}

export default function ToolsPage() {
  const params = useParams()
  const categoryId = params.slug
  const [toast, setToast] = useState(null)

  const {
    data: tools,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['tools', categoryId],
    queryFn: () => fetchToolsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const showToast = (message, type) => {
    setToast({ message, type })
  }

  if (process.env.NEXT_PUBLIC_DEV !== 'true' && isLoading) {
    return (
      <div className='w-4/5 mx-auto py-8 flex flex-wrap items-center justify-between gap-12'>
        {[...Array(5)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (process.env.NEXT_PUBLIC_DEV !== 'true' && error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Error loading tools
      </div>
    )
  }

  return (
    <div className='w-4/5 mx-auto py-8'>
      {process.env.NEXT_PUBLIC_DEV === 'true' && ToolsDataTest?.length > 0 && (
        <div className='flex flex-wrap items-center justify-center gap-6'>
          {ToolsDataTest.map(tool => (
            <Card key={tool.id} tool={tool} showToast={showToast} />
          ))}
        </div>
      )}

      {process.env.NEXT_PUBLIC_DEV !== 'true' && tools?.length > 0 && (
        <div className='flex flex-wrap items-center justify-center gap-6'>
          {tools.map(tool => (
            <Card key={tool.id} tool={tool} showToast={showToast} />
          ))}
        </div>
      )}

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
