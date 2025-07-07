import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentProvider";

const ContentList = ({ pages, folders = [], basePath = "/heritages" }) => {
	const { extractTitle } = useContent();

	// Get the base path for images
	const getImageBasePath = () => {
		const currentPath = window.location.pathname;
		const match = currentPath.match(/\/(\d+_module_c)\//);
		if (match) {
			return `/${match[1]}/content-pages/images`;
		}
		return "/16_module_c/content-pages/images";
	};

	// Normalize folders to handle both string and object formats
	const normalizeFolders = (folders) => {
		return folders.map((folder) => {
			if (typeof folder === "string") {
				return { name: folder, path: folder };
			}
			return folder;
		});
	};

	// Sort folders alphabetically, pages in reverse alphabetical order (newest first)
	const normalizedFolders = normalizeFolders(folders);
	const sortedFolders = [...normalizedFolders].sort((a, b) =>
		a.name.localeCompare(b.name),
	);
	const sortedPages = [...pages].sort((a, b) =>
		b.filename.localeCompare(a.filename),
	);

	return (
		<div className="space-y-6">
			{/* Folders */}
			{sortedFolders.map((folder) => (
				<div
					key={folder.name}
					className="overflow-hidden border border-gray-200 rounded-lg"
				>
					<Link
						to={`${basePath}/${folder.name}`}
						className="block p-6 transition-colors hover:bg-gray-50"
					>
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<svg
									className="w-8 h-8 text-blue-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
								</svg>
							</div>
							<div className="ml-4">
								<h3 className="text-lg font-medium text-gray-900 capitalize">
									{folder.name.replace(/-/g, " ")}
								</h3>
								<p className="text-gray-500">Folder</p>
							</div>
						</div>
					</Link>
				</div>
			))}

			{/* Pages */}
			{sortedPages.map((page) => {
				const slug = page.filename.replace(/\.(html|txt)$/, "");
				const title = extractTitle(page);

				return (
					<article
						key={page.filename}
						className="overflow-hidden transition-shadow border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
					>
						<Link
							to={`${basePath}/${slug}`}
							className="block transition-colors hover:bg-gray-50"
						>
							{page.cover && (
								<div className="bg-gray-200 aspect-w-16 aspect-h-9">
									<img
										src={`${getImageBasePath()}/${page.cover}`}
										alt={title}
										className="object-cover w-full h-48"
										onError={(e) => {
											e.target.style.display = "none";
										}}
									/>
								</div>
							)}
							<div className="p-6">
								<h2 className="mb-2 text-xl font-semibold text-gray-900 common-ligatures">
									{title}
								</h2>
								{page.summary && (
									<p className="mb-3 text-gray-600">{page.summary}</p>
								)}
								{page.tags && page.tags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{page.tags.map((tag) => (
											<Link
												key={tag}
												to={`/tags/${tag}`}
												className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200"
												onClick={(e) => e.stopPropagation()}
											>
												{tag}
											</Link>
										))}
									</div>
								)}
								<time className="text-sm text-gray-500">
									{new Date(page.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</time>
							</div>
						</Link>
					</article>
				);
			})}

			{sortedFolders.length === 0 && sortedPages.length === 0 && (
				<div className="py-12 text-center">
					<p className="text-lg text-gray-500">No content found.</p>
				</div>
			)}
		</div>
	);
};

export default ContentList;
