import { useState, useEffect } from "react";

const CoverImage = ({ src, alt, className = "" }) => {
	const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

	useEffect(() => {
		const handleMouseMove = (e) => {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;
			setMousePos({ x, y });
		};

		const coverElement = document.querySelector(".cover-image-container");
		if (coverElement) {
			coverElement.addEventListener("mousemove", handleMouseMove);
			return () =>
				coverElement.removeEventListener("mousemove", handleMouseMove);
		}
	}, []);

	return (
		<div
			className={`cover-image-container relative overflow-hidden ${className}`}
			style={{ height: "400px" }}
		>
			<img
				src={src}
				alt={alt}
				className="object-cover w-full h-full cover-spotlight"
				style={{
					"--x": `${mousePos.x}%`,
					"--y": `${mousePos.y}%`,
				}}
				onError={(e) => {
					e.target.src =
						"https://via.placeholder.com/800x400/cccccc/666666?text=Image+Not+Found";
				}}
			/>
		</div>
	);
};

export default CoverImage;
