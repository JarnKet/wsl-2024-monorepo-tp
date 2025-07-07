import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) {
			navigate(`/?search=${encodeURIComponent(query)}`);
		}
	};

	return (
		<form onSubmit={handleSearch} className="flex items-center">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search heritage sites..."
				className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
			<button
				type="submit"
				className="px-4 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Search
			</button>
		</form>
	);
};

export default SearchBox;
