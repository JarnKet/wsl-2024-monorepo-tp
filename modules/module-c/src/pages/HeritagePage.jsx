import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useContent } from "../contexts/ContentProvider";
import ContentList from "../components/ContentList";
import CoverImage from "../components/CoverImage";
import ContentRenderer from "../components/ContentRenderer";

const HeritagePage = () => {
	const location = useLocation();
	const { pages, folders, getPageByPath, extractTitle } = useContent();
	const [page, setPage] = useState(null);
	const [isListing, setIsListing] = useState(false);
	const [currentFolderPages, setCurrentFolderPages] = useState([]);
	const [currentSubfolders, setCurrentSubfolders] = useState([]);
	const [stickyAside, setStickyAside] = useState(false);

	const path = location.pathname.replace("/heritages/", "").replace(/^\//, "");

	useEffect(() => {
		// Check if this is a page or a folder listing
		const foundPage = getPageByPath(path);
		if (foundPage) {
			setPage(foundPage);
			setIsListing(false);
		} else {
			// This is a folder listing
			setPage(null);
			setIsListing(true);

			// Get pages for current folder
			const folderPages = pages.filter((p) => {
				if (!path) return !p.folder; // Root level
				return p.folder === path;
			});

			// Get subfolders for current folder
			const subfolders = folders.filter((f) => {
				if (!path) return !f.parent; // Root level folders
				return f.parent === path || f.path.startsWith(path + "/");
			});

			setCurrentFolderPages(folderPages);
			setCurrentSubfolders(subfolders);
		}
	}, [path, pages, folders, getPageByPath]);

	useEffect(() => {
		const handleScroll = () => {
			setStickyAside(window.scrollY > 100);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Folder listing view
	if (isListing) {
		const breadcrumbs = path ? path.split("/") : [];

		return (
			<div>
				<div className="mb-8">
					<nav className="flex items-center mb-4 space-x-2 text-sm">
						<Link to="/" className="text-blue-600 hover:text-blue-800">
							Home
						</Link>
						{breadcrumbs.map((crumb, index) => {
							const crumbPath = breadcrumbs.slice(0, index + 1).join("/");
							const isLast = index === breadcrumbs.length - 1;

							return (
								<span key={index} className="flex items-center">
									<span className="mx-2 text-gray-400">/</span>
									{isLast ? (
										<span className="text-gray-600">{crumb}</span>
									) : (
										<Link
											to={`/heritages/${crumbPath}`}
											className="text-blue-600 hover:text-blue-800"
										>
											{crumb}
										</Link>
									)}
								</span>
							);
						})}
					</nav>

					<h1 className="text-4xl font-bold text-gray-900 common-ligatures">
						{path ? path.split("/").pop() : "Lyon Heritage Sites"}
					</h1>

					<p className="mt-2 text-gray-600">
						{currentFolderPages.length} heritage site
						{currentFolderPages.length !== 1 ? "s" : ""}
						{currentSubfolders.length > 0 &&
							` and ${currentSubfolders.length} subfolder${currentSubfolders.length !== 1 ? "s" : ""}`}
					</p>
				</div>

				<ContentList
					pages={currentFolderPages}
					folders={currentSubfolders.map((f) => f.name)}
					basePath={`/heritages${path ? "/" + path : ""}`}
				/>
			</div>
		);
	}

	// Single page view
	if (!page) {
		return (
			<div className="py-12 text-center">
				<h1 className="mb-4 text-2xl font-bold text-gray-900">
					Page Not Found
				</h1>
				<p className="mb-4 text-gray-600">
					The heritage site you're looking for doesn't exist.
				</p>
				<Link to="/" className="text-blue-600 hover:text-blue-800">
					← Back to Home
				</Link>
			</div>
		);
	}

	const title = extractTitle(page);
	const coverImage =
		page.cover || `${page.filename.replace(/\.(html|txt)$/, "")}.jpg`;
	const isTextFile = page.filename.endsWith(".txt");

	// Get the base path for images
	const getImageBasePath = () => {
		const currentPath = window.location.pathname;
		const match = currentPath.match(/\/(\d+_module_c)\//);
		if (match) {
			return `/${match[1]}/content-pages/images`;
		}
		return "/16_module_c/content-pages/images";
	};

	// Build breadcrumbs for individual page
	const folderParts = page.folder ? page.folder.split("/") : [];

	return (
		<div>
			{/* Navigation */}
			<nav className="flex items-center mb-6 space-x-2 text-sm">
				<Link to="/" className="text-blue-600 hover:text-blue-800">
					Home
				</Link>
				{folderParts.map((part, index) => {
					const partPath = folderParts.slice(0, index + 1).join("/");

					return (
						<span key={index} className="flex items-center">
							<span className="mx-2 text-gray-400">/</span>
							<Link
								to={`/heritages/${partPath}`}
								className="text-blue-600 hover:text-blue-800"
							>
								{part}
							</Link>
						</span>
					);
				})}
				<span className="mx-2 text-gray-400">/</span>
				<span className="text-gray-600">{title}</span>
			</nav>

			{/* Cover Image */}
			<CoverImage
				src={`${getImageBasePath()}/${coverImage}`}
				alt={title}
				className="mb-8 rounded-lg"
			/>

			{/* Title */}
			<h1 className="mb-8 text-5xl font-bold text-gray-900 common-ligatures">
				{title}
			</h1>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				{/* Main Content */}
				<div className="lg:col-span-3">
					<ContentRenderer content={page.content} isText={isTextFile} />
				</div>

				{/* Aside Information */}
				<aside
					className={`lg:col-span-1 ${stickyAside ? "lg:sticky lg:top-4" : ""}`}
				>
					<div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
						<h3 className="mb-4 text-lg font-semibold text-gray-900">
							Information
						</h3>

						{/* Date */}
						<div className="mb-4">
							<dt className="text-sm font-medium text-gray-500">Date</dt>
							<dd className="text-sm text-gray-900">
								{new Date(page.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</dd>
						</div>

						{/* Location */}
						{page.folder && (
							<div className="mb-4">
								<dt className="text-sm font-medium text-gray-500">Category</dt>
								<dd className="text-sm text-gray-900">{page.folder}</dd>
							</div>
						)}

						{/* Tags */}
						{page.tags && page.tags.length > 0 && (
							<div className="mb-4">
								<dt className="mb-2 text-sm font-medium text-gray-500">Tags</dt>
								<dd className="flex flex-wrap gap-2">
									{page.tags.map((tag) => (
										<Link
											key={tag}
											to={`/tags/${tag}`}
											className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200"
										>
											{tag}
										</Link>
									))}
								</dd>
							</div>
						)}

						{/* Draft indicator */}
						{page.draft && (
							<div className="mb-4">
								<span className="inline-block px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
									Draft
								</span>
							</div>
						)}
					</div>

					{/* Social Sharing Meta */}
					<div className="p-4 mt-6 border border-gray-200 rounded-lg bg-gray-50">
						<h4 className="mb-2 text-sm font-medium text-gray-900">
							Share this heritage site
						</h4>
						<div className="flex space-x-2">
							<button className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
								Facebook
							</button>
							<button className="flex-1 px-3 py-2 text-sm text-white bg-blue-400 rounded hover:bg-blue-500">
								Twitter
							</button>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
};

export default HeritagePage;
