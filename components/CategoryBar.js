'use client';
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import Category from "./Category";
import { AxiosConfig } from "../app/utils/axiosConfig";
import { useRouter } from 'next/navigation';

const fetchCategories = async () => {
	const { data } = await AxiosConfig.get("/categories");
	return data;
};

export default function CategoryBar() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState(null);

	const { data: categories, isLoading, error } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		staleTime: 1000 * 60 * 5,
		cacheTime: 1000 * 60 * 30,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	const handleCategoryClick = useCallback((categoryId) => {
		setActiveCategory(categoryId);
		router.push(`/tools/${categoryId}`);
	}, [router]);

	if (error) return <h1 className="text-white">Erro ao carregar as categorias</h1>;

	return (
		<div className="bg-white w-4/5 h-auto rounded-lg flex items-center justify-between p-5 gap-2 overflow-x-auto mt-4">
			{isLoading ? (
				<>
					{[...Array(5)].map((_, index) => (
						<div key={index} className="flex-shrink-0">
							<div className="h-12 w-48 bg-gray-200 rounded-md animate-pulse"></div>
						</div>
					))}
				</>
			) : (
				categories?.map((category) => (
					<Category
						key={category.id}
						id={category.id}
						title={category.name}
						isActive={activeCategory === category.id}
						onClick={() => handleCategoryClick(category.id)}
					/>
				))
			)}
		</div>
	);
}