import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useContent } from "../contexts/ContentProvider";
import ContentList from "../components/ContentList";

const TagPage = () => {
	const { tagName } = useParams();
	const { getPagesByTag, loading } = useContent();
	const [taggedPages, setTaggedPages] = useState([]);

	useEffect(() => {
		if (tagName) {
			const pages = getPagesByTag(tagName);
			setTaggedPages(pages);
		}
	}, [tagName, getPagesByTag]);

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
				<nav className="mb-4">
					<Link to="/" className="text-blue-600 hover:text-blue-800">
						← Back to Home
					</Link>
				</nav>
				<h1 className="mb-4 text-4xl font-bold text-gray-900 common-ligatures">
					Heritage Sites Tagged "{tagName}"
				</h1>
				<p className="text-lg text-gray-600">
					Found {taggedPages.length} heritage site
					{taggedPages.length !== 1 ? "s" : ""} with the tag "{tagName}"
				</p>
			</div>

			<ContentList pages={taggedPages} folders={[]} />

			{taggedPages.length === 0 && (
				<div className="py-12 text-center">
					<div className="p-8 bg-gray-100 rounded-lg">
						<h2 className="mb-2 text-xl font-semibold text-gray-700">
							No heritage sites found
						</h2>
						<p className="text-gray-600">
							There are no heritage sites currently tagged with "{tagName}".
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default TagPage;
