export default function Category({ id, title, isActive, onClick }) {
	return (
		<div
			className={`text-white w-48 h-12 flex items-center justify-center rounded-md cursor-pointer ${isActive ? "bg-slate-600" : "bg-background"
				}`}
			onClick={onClick}
		>
			<span
				className={`w-full text-center m-2 ${isActive ? "text-white" : "hover:text-gray-400"
					}`}
			>
				{title}
			</span>
		</div>
	);
}