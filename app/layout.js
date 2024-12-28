'use client'

import './globals.css';
import Head from 'next/head';
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import { QueryProvider } from './providers';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children, session }) {
	const pathname = usePathname();

	// Lista de endpoints que não devem exibir a CategoryBar
	const excludedPaths = ['/contributors', '/addtools'];

	// Verifica se o pathname atual está na lista de exclusão
	const showCategoryBar = !excludedPaths.includes(pathname);

	return (
		<html lang="en" className="h-full">
			<Head>
				<title>Tools4.tech - Essential Tools for Developers</title>
				<meta name="description" content="Find the best developer tools and accelerate your software development with carefully curated resources at Tools4.tech." />
				<meta name="keywords" content="developer tools, software development, programming resources, coding, technology" />
				<meta property="og:title" content="Tools4.tech - Essential Tools for Developers" />
				<meta property="og:description" content="Discover essential programming tools and accelerate your software development at Tools4.tech." />
				<meta property="og:url" content="https://tools4.tech/" />
				<meta property="og:site_name" content="Tools4.tech" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:image" content="/favicon.ico" />
				<meta property="og:image:width" content="800" />
				<meta property="og:image:height" content="600" />
				<meta property="og:image:alt" content="Tools4.tech - Developer Tools" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Tools4.tech - Essential Tools for Developers" />
				<meta name="twitter:description" content="Accelerate your software development with the best developer tools." />
				<meta name="twitter:image" content="/favicon.ico" />
				<meta name="robots" content="index, follow" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="author" content="Tools4.tech" />
				<link rel="canonical" href="https://tools4.tech/" />
			</Head>
			<body className="bg-[#111111] h-full ">
				<SessionProvider session={session}>
					<QueryProvider>
						<Navbar />
						{showCategoryBar && (
							<div className='flex flex-col items-center justify-center'>
								<CategoryBar />
							</div>
						)}
						{children}
					</QueryProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
