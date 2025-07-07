import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useContent } from "../contexts/ContentProvider";
import ContentList from "../components/ContentList";

const HomePage = () => {
	const { pages, folders, loading, searchPages } = useContent();
	const [searchParams] = useSearchParams();
	const [displayPages, setDisplayPages] = useState([]);
	const searchQuery = searchParams.get("search");

	useEffect(() => {
		if (searchQuery) {
			setDisplayPages(searchPages(searchQuery));
		} else {
			setDisplayPages(pages);
		}
	}, [pages, searchQuery, searchPages]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-8">
				<h1 className="mb-4 text-4xl font-bold text-gray-900 common-ligatures">
					{searchQuery
						? `Search Results for "${searchQuery}"`
						: "Lyon Heritage Sites"}
				</h1>
				{!searchQuery && (
					<p className="text-lg text-gray-600">
						Discover the rich history and cultural heritage of Lyon, France.
						Explore magnificent basilicas, Renaissance quarters, world-class
						museums, and more.
					</p>
				)}
				{searchQuery && (
					<p className="text-gray-600">
						Found {displayPages.length} result
						{displayPages.length !== 1 ? "s" : ""}
						{displayPages.length > 0 && " matching your search criteria"}
					</p>
				)}
			</div>

			<ContentList pages={displayPages} folders={folders} />
		</div>
	);
};

export default HomePage;
