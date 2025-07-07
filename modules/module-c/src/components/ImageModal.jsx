import { useEffect } from "react";

const ImageModal = ({ src, alt, isOpen, onClose }) => {
	useEffect(() => {
		if (isOpen) {
			const handleKeyDown = (e) => {
				if (e.key === "Escape") onClose();
			};

			const handleScroll = () => onClose();

			document.addEventListener("keydown", handleKeyDown);
			window.addEventListener("scroll", handleScroll);
			document.body.style.overflow = "hidden";

			return () => {
				document.removeEventListener("keydown", handleKeyDown);
				window.removeEventListener("scroll", handleScroll);
				document.body.style.overflow = "unset";
			};
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
			onClick={onClose}
		>
			<div className="max-w-4xl max-h-full p-4">
				<img
					src={src}
					alt={alt}
					className="object-contain max-w-full max-h-full"
					onClick={(e) => e.stopPropagation()}
				/>
			</div>
		</div>
	);
};

export default ImageModal;
