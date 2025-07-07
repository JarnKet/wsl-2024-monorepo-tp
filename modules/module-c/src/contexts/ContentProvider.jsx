// import { createContext, useContext, useState, useEffect } from "react";

// const ContentContext = createContext();

// export const useContent = () => useContext(ContentContext);

// const ContentProvider = ({ children }) => {
// 	const [pages, setPages] = useState([]);
// 	const [folders, setFolders] = useState([]);
// 	const [loading, setLoading] = useState(true);

// 	// Parse front-matter from file content
// 	const parseFrontMatter = (content) => {
// 		const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
// 		const match = content.match(frontMatterRegex);

// 		if (!match) {
// 			return { frontMatter: {}, content: content.trim() };
// 		}

// 		const frontMatterText = match[1];
// 		const mainContent = match[2];
// 		const frontMatter = {};

// 		frontMatterText.split(/\r?\n/).forEach((line) => {
// 			const colonIndex = line.indexOf(":");
// 			if (colonIndex > 0) {
// 				const key = line.substring(0, colonIndex).trim();
// 				const value = line.substring(colonIndex + 1).trim();

// 				if (key === "tags") {
// 					frontMatter[key] = value.split(",").map((tag) => tag.trim());
// 				} else if (key === "draft") {
// 					frontMatter[key] = value.toLowerCase() === "true";
// 				} else {
// 					frontMatter[key] = value;
// 				}
// 			}
// 		});

// 		return { frontMatter, content: mainContent.trim() };
// 	};

// 	// Check if filename matches YYYY-MM-DD pattern
// 	const isValidFilename = (filename) => {
// 		const datePattern = /^\d{4}-\d{2}-\d{2}-.*\.(html|txt)$/;
// 		return datePattern.test(filename);
// 	};

// 	// Extract date from filename
// 	const extractDateFromFilename = (filename) => {
// 		const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
// 		return match ? match[1] : null;
// 	};

// 	// Load a single file
// 	const loadFile = async (filename, folderPath = "") => {
// 		try {
// 			const fullPath = folderPath
// 				? `/content-pages/${folderPath}/${filename}`
// 				: `/content-pages/${filename}`;

// 			console.log(`Attempting to load: ${fullPath}`);

// 			const response = await fetch(fullPath);
// 			if (!response.ok) {
// 				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
// 			}

// 			const content = await response.text();
// 			const { frontMatter, content: mainContent } = parseFrontMatter(content);

// 			// Skip draft-writing.txt and other non-standard files
// 			if (filename === "draft-writing.txt" || !isValidFilename(filename)) {
// 				console.log(`Skipping invalid filename: ${filename}`);
// 				return null;
// 			}

// 			const dateStr = extractDateFromFilename(filename);
// 			if (!dateStr) {
// 				console.warn(`Could not extract date from filename: ${filename}`);
// 				return null;
// 			}

// 			const pageDate = new Date(dateStr);
// 			const today = new Date();
// 			today.setHours(23, 59, 59, 999); // Include today's content

// 			// Filter out future pages and drafts
// 			if (pageDate > today) {
// 				console.log(`Skipping future-dated page: ${filename}`);
// 				return null;
// 			}

// 			if (frontMatter.draft) {
// 				console.log(`Skipping draft page: ${filename}`);
// 				return null;
// 			}

// 			console.log(`Successfully loaded: ${filename}`);

// 			return {
// 				filename,
// 				title: frontMatter.title || "",
// 				summary: frontMatter.summary || "",
// 				tags: frontMatter.tags || [],
// 				cover: frontMatter.cover || "",
// 				date: dateStr,
// 				draft: frontMatter.draft || false,
// 				content: mainContent,
// 				folder: folderPath,
// 			};
// 		} catch (error) {
// 			console.log(`Could not load ${filename}: ${error.message}`);
// 			return null;
// 		}
// 	};

// 	// Load files from manifest
// 	const loadFromManifest = async () => {
// 		try {
// 			console.log("Loading from manifest...");
// 			const manifestResponse = await fetch("/content-pages/files.json");

// 			if (!manifestResponse.ok) {
// 				throw new Error("No manifest file found");
// 			}

// 			const manifest = await manifestResponse.json();
// 			console.log("Found manifest:", manifest);

// 			const allPages = [];
// 			const allFolders = [];

// 			// Process folders structure
// 			for (const folder of manifest.folders) {
// 				allFolders.push({
// 					name: folder.name,
// 					path: folder.name,
// 				});

// 				// Load files directly in main folder
// 				if (folder.files) {
// 					for (const filename of folder.files) {
// 						const page = await loadFile(filename, folder.name);
// 						if (page) {
// 							allPages.push(page);
// 						}
// 					}
// 				}

// 				// Load files from subfolders
// 				if (folder.subfolders) {
// 					for (const subfolder of folder.subfolders) {
// 						const subfolderPath = `${folder.name}/${subfolder.name}`;
// 						allFolders.push({
// 							name: subfolder.name,
// 							path: subfolderPath,
// 							parent: folder.name,
// 						});

// 						if (subfolder.files) {
// 							for (const filename of subfolder.files) {
// 								const page = await loadFile(filename, subfolderPath);
// 								if (page) {
// 									allPages.push(page);
// 								}
// 							}
// 						}
// 					}
// 				}
// 			}

// 			return { pages: allPages, folders: allFolders };
// 		} catch (error) {
// 			console.error("Error loading from manifest:", error);
// 			return { pages: [], folders: [] };
// 		}
// 	};

// 	// Fallback: try to load known files based on your structure
// 	const loadKnownFiles = async () => {
// 		console.log("Loading known files...");
// 		const knownStructure = [
// 			// Acient/Ancient & Roman
// 			{
// 				file: "2024-06-07-ancient-theatre.txt",
// 				folder: "Acient/Ancient & Roman",
// 			},
// 			{
// 				file: "2024-12-12-musee-gallo-romain.txt",
// 				folder: "Acient/Ancient & Roman",
// 			},

// 			// Acient/Medieval & Renaissance
// 			{
// 				file: "2024-03-02-lyon-hotel-de-ville-vlog.txt",
// 				folder: "Acient/Medieval & Renaissance",
// 			},
// 			{
// 				file: "2024-05-04-vieux-lyon.txt",
// 				folder: "Acient/Medieval & Renaissance",
// 			},
// 			{
// 				file: "2025-01-01-Lyon_Cathedral_St_Jean_Baptiste_Vlog.txt",
// 				folder: "Acient/Medieval & Renaissance",
// 			},

// 			// Acient/Modern & Contemporary
// 			{
// 				file: "2024-06-20-lyon-musee-des-beaux-arts.txt",
// 				folder: "Acient/Modern & Contemporary",
// 			},
// 			{
// 				file: "2024-08-10-Lyon-Musee-des-Confluences.txt",
// 				folder: "Acient/Modern & Contemporary",
// 			},

// 			// Other Notable Sites
// 			{
// 				file: "2022-10-11-the-cathedral-of-saint-jean-baptiste.html",
// 				folder: "Other Notable Sites",
// 			},
// 			{
// 				file: "2023-11-30-Lyon-Musee-Miniature-et-Cinema-Vlog.html",
// 				folder: "Other Notable Sites",
// 			},
// 			{
// 				file: "2024-05-02-lyon-place-bellecour.txt",
// 				folder: "Other Notable Sites",
// 			},
// 			{
// 				file: "2024-06-12-Lyon-Parc-de-la-Tête-d'Or.txt",
// 				folder: "Other Notable Sites",
// 			},
// 			{
// 				file: "2023-10-20-walk-through the city.txt",
// 				folder: "Other Notable Sites",
// 			},
// 			{
// 				file: "2023-12-28-tips-of-using-lyon-city-card.txt",
// 				folder: "Other Notable Sites",
// 			},
// 		];

// 		const loadedPages = [];

// 		for (const { file, folder } of knownStructure) {
// 			const page = await loadFile(file, folder);
// 			if (page) {
// 				loadedPages.push(page);
// 			}
// 		}

// 		return loadedPages;
// 	};

// 	useEffect(() => {
// 		const loadContent = async () => {
// 			setLoading(true);
// 			try {
// 				// Try manifest first, then fallback to known files
// 				let result = await loadFromManifest();

// 				if (result.pages.length === 0) {
// 					console.log("Manifest failed, trying known files...");
// 					const pages = await loadKnownFiles();
// 					result = {
// 						pages,
// 						folders: [
// 							{ name: "Acient", path: "Acient" },
// 							{
// 								name: "Ancient & Roman",
// 								path: "Acient/Ancient & Roman",
// 								parent: "Acient",
// 							},
// 							{
// 								name: "Medieval & Renaissance",
// 								path: "Acient/Medieval & Renaissance",
// 								parent: "Acient",
// 							},
// 							{
// 								name: "Modern & Contemporary",
// 								path: "Acient/Modern & Contemporary",
// 								parent: "Acient",
// 							},
// 							{ name: "Other Notable Sites", path: "Other Notable Sites" },
// 						],
// 					};
// 				}

// 				setPages(result.pages);
// 				setFolders(result.folders);
// 				console.log(
// 					`Content loading completed: ${result.pages.length} pages, ${result.folders.length} folders`,
// 				);
// 			} catch (error) {
// 				console.error("Failed to load content:", error);
// 				setPages([]);
// 				setFolders([]);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		loadContent();
// 	}, []);

// 	const getPageByPath = (path) => {
// 		return pages.find((page) => {
// 			const slug = page.filename.replace(/\.(html|txt)$/, "");
// 			return slug === path;
// 		});
// 	};

// 	const getPagesByTag = (tag) => {
// 		return pages.filter(
// 			(page) =>
// 				page.tags &&
// 				page.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
// 		);
// 	};

// 	const searchPages = (query) => {
// 		if (!query) return pages;

// 		const keywords = query.split("/").map((k) => k.trim().toLowerCase());

// 		return pages.filter((page) => {
// 			const searchText = `${page.title} ${page.content}`.toLowerCase();
// 			return keywords.some((keyword) => searchText.includes(keyword));
// 		});
// 	};

// 	const extractTitle = (page) => {
// 		if (page.title) return page.title;

// 		// Try to extract from first h1 tag
// 		const h1Match = page.content.match(/<h1[^>]*>(.*?)<\/h1>/);
// 		if (h1Match) return h1Match[1];

// 		// Use filename without date and extension
// 		const filename = page.filename
// 			.replace(/^\d{4}-\d{2}-\d{2}-/, "")
// 			.replace(/\.(html|txt)$/, "");
// 		return filename.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
// 	};

// 	const value = {
// 		pages,
// 		folders,
// 		loading,
// 		getPageByPath,
// 		getPagesByTag,
// 		searchPages,
// 		extractTitle,
// 	};

// 	return (
// 		<ContentContext.Provider value={value}>{children}</ContentContext.Provider>
// 	);
// };

// export default ContentProvider;

import { createContext, useContext, useState, useEffect } from "react";

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

const ContentProvider = ({ children }) => {
	const [pages, setPages] = useState([]);
	const [folders, setFolders] = useState([]);
	const [loading, setLoading] = useState(true);

	// Get the base path - should match your seat number
	const getBasePath = () => {
		// Try to detect the seat number from the current URL
		const currentPath = window.location.pathname;
		const match = currentPath.match(/\/(\d+_module_c)\//);
		if (match) {
			return `/${match[1]}/content-pages`;
		}
		// Fallback to your seat number
		return "/16_module_c/content-pages";
	};

	// Parse front-matter from file content
	const parseFrontMatter = (content) => {
		const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
		const match = content.match(frontMatterRegex);

		if (!match) {
			return { frontMatter: {}, content: content.trim() };
		}

		const frontMatterText = match[1];
		const mainContent = match[2];
		const frontMatter = {};

		frontMatterText.split(/\r?\n/).forEach((line) => {
			const colonIndex = line.indexOf(":");
			if (colonIndex > 0) {
				const key = line.substring(0, colonIndex).trim();
				const value = line.substring(colonIndex + 1).trim();

				if (key === "tags") {
					frontMatter[key] = value.split(",").map((tag) => tag.trim());
				} else if (key === "draft") {
					frontMatter[key] = value.toLowerCase() === "true";
				} else {
					frontMatter[key] = value;
				}
			}
		});

		return { frontMatter, content: mainContent.trim() };
	};

	// Check if filename matches YYYY-MM-DD pattern
	const isValidFilename = (filename) => {
		const datePattern = /^\d{4}-\d{2}-\d{2}-.*\.(html|txt)$/;
		return datePattern.test(filename);
	};

	// Extract date from filename
	const extractDateFromFilename = (filename) => {
		const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
		return match ? match[1] : null;
	};

	// Load a single file
	const loadFile = async (filename, folderPath = "") => {
		try {
			const basePath = getBasePath();
			const fullPath = folderPath
				? `${basePath}/${folderPath}/${filename}`
				: `${basePath}/${filename}`;

			console.log(`Attempting to load: ${fullPath}`);

			const response = await fetch(fullPath);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const content = await response.text();
			const { frontMatter, content: mainContent } = parseFrontMatter(content);

			// Skip draft-writing.txt and other non-standard files
			if (filename === "draft-writing.txt" || !isValidFilename(filename)) {
				console.log(`Skipping invalid filename: ${filename}`);
				return null;
			}

			const dateStr = extractDateFromFilename(filename);
			if (!dateStr) {
				console.warn(`Could not extract date from filename: ${filename}`);
				return null;
			}

			const pageDate = new Date(dateStr);
			const today = new Date();
			today.setHours(23, 59, 59, 999); // Include today's content

			// Filter out future pages and drafts
			if (pageDate > today) {
				console.log(`Skipping future-dated page: ${filename}`);
				return null;
			}

			if (frontMatter.draft) {
				console.log(`Skipping draft page: ${filename}`);
				return null;
			}

			console.log(`Successfully loaded: ${filename}`);

			return {
				filename,
				title: frontMatter.title || "",
				summary: frontMatter.summary || "",
				tags: frontMatter.tags || [],
				cover: frontMatter.cover || "",
				date: dateStr,
				draft: frontMatter.draft || false,
				content: mainContent,
				folder: folderPath,
			};
		} catch (error) {
			console.log(`Could not load ${filename}: ${error.message}`);
			return null;
		}
	};

	// Load files from manifest
	const loadFromManifest = async () => {
		try {
			console.log("Loading from manifest...");
			const basePath = getBasePath();
			const manifestPath = `${basePath}/files.json`;

			console.log(`Fetching manifest from: ${manifestPath}`);
			const manifestResponse = await fetch(manifestPath);

			if (!manifestResponse.ok) {
				throw new Error(`No manifest file found at ${manifestPath}`);
			}

			const manifest = await manifestResponse.json();
			console.log("Found manifest:", manifest);

			const allPages = [];
			const allFolders = [];

			// Process folders structure
			for (const folder of manifest.folders) {
				allFolders.push({
					name: folder.name,
					path: folder.name,
				});

				// Load files directly in main folder
				if (folder.files) {
					for (const filename of folder.files) {
						const page = await loadFile(filename, folder.name);
						if (page) {
							allPages.push(page);
						}
					}
				}

				// Load files from subfolders
				if (folder.subfolders) {
					for (const subfolder of folder.subfolders) {
						const subfolderPath = `${folder.name}/${subfolder.name}`;
						allFolders.push({
							name: subfolder.name,
							path: subfolderPath,
							parent: folder.name,
						});

						if (subfolder.files) {
							for (const filename of subfolder.files) {
								const page = await loadFile(filename, subfolderPath);
								if (page) {
									allPages.push(page);
								}
							}
						}
					}
				}
			}

			return { pages: allPages, folders: allFolders };
		} catch (error) {
			console.error("Error loading from manifest:", error);
			return { pages: [], folders: [] };
		}
	};

	useEffect(() => {
		const loadContent = async () => {
			setLoading(true);
			try {
				console.log("Starting content loading...");
				console.log("Base path:", getBasePath());

				// Try to load from manifest first
				const result = await loadFromManifest();

				setPages(result.pages);
				setFolders(result.folders);

				console.log(
					`Content loading completed: ${result.pages.length} pages, ${result.folders.length} folders`,
				);
				console.log(
					"Loaded pages:",
					result.pages.map((p) => `${p.folder}/${p.filename}`),
				);
			} catch (error) {
				console.error("Failed to load content:", error);
				setPages([]);
				setFolders([]);
			} finally {
				setLoading(false);
			}
		};

		loadContent();
	}, []);

	const getPageByPath = (path) => {
		return pages.find((page) => {
			const slug = page.filename.replace(/\.(html|txt)$/, "");
			return slug === path;
		});
	};

	const getPagesByTag = (tag) => {
		return pages.filter(
			(page) =>
				page.tags &&
				page.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
		);
	};

	const searchPages = (query) => {
		if (!query) return pages;

		const keywords = query.split("/").map((k) => k.trim().toLowerCase());

		return pages.filter((page) => {
			const searchText = `${page.title} ${page.content}`.toLowerCase();
			return keywords.some((keyword) => searchText.includes(keyword));
		});
	};

	const extractTitle = (page) => {
		if (page.title) return page.title;

		// Try to extract from first h1 tag
		const h1Match = page.content.match(/<h1[^>]*>(.*?)<\/h1>/);
		if (h1Match) return h1Match[1];

		// Use filename without date and extension
		const filename = page.filename
			.replace(/^\d{4}-\d{2}-\d{2}-/, "")
			.replace(/\.(html|txt)$/, "");
		return filename.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const value = {
		pages,
		folders,
		loading,
		getPageByPath,
		getPagesByTag,
		searchPages,
		extractTitle,
	};

	return (
		<ContentContext.Provider value={value}>{children}</ContentContext.Provider>
	);
};

export default ContentProvider;
