'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AxiosConfig } from "../../utils/axiosConfig";
import Card from '../../../components/Card';
import { Toast } from '../../../components/Toast';
import CardSkeleton from '../../../components/CardSkeleton'

const fetchToolsByCategory = async (categoryId) => {
  if (!categoryId) return null;
  const { data } = await AxiosConfig.get(`/tools/category/${categoryId}`);
  return data;
};

export default function ToolsPage() {
  const params = useParams();
  const categoryId = params.slug;
  const [toast, setToast] = useState(null);

  const { data: tools, error, isLoading } = useQuery({
    queryKey: ['tools', categoryId],
    queryFn: () => fetchToolsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  if (isLoading) {
    return (
      <div className="w-4/5 mx-auto py-8 flex flex-wrap items-center justify-between gap-12">
        {[...Array(5)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Erro ao carregar as ferramentas
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto py-8">
      <div className="flex flex-wrap items-center justify-between gap-12">
        {tools?.map(tool => (
          <Card
            key={tool.id}
            tool={tool}
            showToast={showToast}
          />
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
  );
}

