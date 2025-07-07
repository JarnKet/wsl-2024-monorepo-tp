import { useState } from "react";
import ImageModal from "./ImageModal";

const ContentRenderer = ({ content, isText = false }) => {
	const [modalImage, setModalImage] = useState(null);

	const processContent = (content) => {
		if (isText) {
			// Process .txt files
			const lines = content.split("\n").filter((line) => line.trim());
			let processedContent = "";
			let isFirstParagraph = true;

			lines.forEach((line) => {
				line = line.trim();
				if (!line) return;

				// Check if line is an image (no spaces and ends with image extension)
				if (/\.(jpg|jpeg|png|gif|webp)$/i.test(line) && !line.includes(" ")) {
					processedContent += `<img src="/content-pages/images/${line}" alt="${line}" class="w-full cursor-pointer hover:opacity-90 transition-opacity" onclick="openImage('/content-pages/images/${line}', '${line}')" />`;
				} else {
					// Regular text line - convert to paragraph
					const className = isFirstParagraph ? "drop-cap" : "";
					processedContent += `<p class="${className}">${line}</p>`;
					isFirstParagraph = false;
				}
			});

			return processedContent;
		} else {
			// Process .html files
			let processedContent = content;
			const isFirstParagraph = true;

			// Replace image paths
			processedContent = processedContent.replace(
				/src="([^"]+\.(jpg|jpeg|png|gif|webp))"/gi,
				'src="/content-pages/images/$1"',
			);

			// Add click handlers to images
			processedContent = processedContent.replace(
				/<img([^>]+)>/gi,
				'<img$1 class="w-full cursor-pointer hover:opacity-90 transition-opacity" onclick="openImage(this.src, this.alt)" />',
			);

			// Add drop cap to first paragraph
			processedContent = processedContent.replace(
				/<p([^>]*)>/,
				'<p$1 class="drop-cap">',
			);

			return processedContent;
		}
	};

	const handleImageClick = (src, alt) => {
		setModalImage({ src, alt });
	};

	const processedHtml = processContent(content);

	return (
		<div className="prose prose-lg max-w-none">
			<div
				dangerouslySetInnerHTML={{ __html: processedHtml }}
				onClick={(e) => {
					if (e.target.tagName === "IMG") {
						e.preventDefault();
						handleImageClick(e.target.src, e.target.alt);
					}
				}}
			/>

			<ImageModal
				src={modalImage?.src}
				alt={modalImage?.alt}
				isOpen={!!modalImage}
				onClose={() => setModalImage(null)}
			/>
		</div>
	);
};

export default ContentRenderer;
