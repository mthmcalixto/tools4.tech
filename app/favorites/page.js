'use client';
import { useState } from 'react';
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosConfig } from "../utils/axiosConfig";
import Card from '../../components/Card';
import { Toast } from '../../components/Toast';
import CardSkeleton from '@/components/CardSkeleton';

// Funções de fetch separadas para melhor reutilização
async function fetchToolDetails(toolId) {
  const { data } = await AxiosConfig.get(`/tools/${toolId}`);
  return data;
}

async function fetchFavorites() {
  const { data } = await AxiosConfig.get('/favorites');
  return data;
}

export default function Favorites() {
  const [toast, setToast] = useState(null);
  const queryClient = useQueryClient();

  // Query principal para favoritos
  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 30, // 30 minutos
  });

  // Queries paralelas para detalhes das ferramentas
  const toolQueries = useQueries({
    queries: (favoritesQuery.data ?? []).map((favorite) => ({
      queryKey: ["tool", favorite.toolId],
      queryFn: () => fetchToolDetails(favorite.toolId),
      staleTime: 1000 * 60 * 10, // 10 minutos
      cacheTime: 1000 * 60 * 60, // 1 hora
    })),
    enabled: !!favoritesQuery.data,
  });

  // Combina os dados dos favoritos com os detalhes das ferramentas
  const favorites = favoritesQuery.data?.map((favorite, index) => ({
    ...favorite,
    tool: toolQueries[index]?.data,
  }));

  const isLoading = favoritesQuery.isLoading || toolQueries.some(query => query.isLoading);
  const error = favoritesQuery.error || toolQueries.some(query => query.error);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleFavoriteRemoved = async (favoriteId) => {
    // Invalidação otimista do cache
    await queryClient.invalidateQueries(["favorites"]);
    // Remover imediatamente do cache para UI mais responsiva
    queryClient.setQueryData(["favorites"], (old) =>
      old?.filter(fav => fav.id !== favoriteId)
    );
    showToast("Item removido dos favoritos", "success");
  };

  // Pré-fetch dos dados ao hover
  const prefetchTool = async (toolId) => {
    await queryClient.prefetchQuery(
      ["tool", toolId],
      () => fetchToolDetails(toolId),
      {
        staleTime: 1000 * 60 * 10,
      }
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <CardSkeleton />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      Erro ao carregar seus favoritos
    </div>
  );

  if (!favorites?.length) return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-xl font-semibold mb-4">Nenhum favorito encontrado</h2>
      <p className="text-gray-600">
        Você ainda não adicionou nenhuma ferramenta aos favoritos.
      </p>
    </div>
  );

  return (
    <div className="w-4/5 mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Meus Favoritos</h1>
      <div className="flex flex-wrap justify-between items-center gap-4">
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
  );
}