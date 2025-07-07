import { Link } from "react-router-dom";
import SearchBox from "./SearchBox";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b shadow-md">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-4">
						<Link
							to="/"
							className="text-2xl font-bold text-blue-600 common-ligatures"
						>
							Lyon Heritage Sites
						</Link>
						<SearchBox />
					</div>
				</div>
			</header>

			<main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
				{children}
			</main>

			<footer className="py-8 mt-16 text-white bg-gray-800">
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="text-center">
						<p>
							&copy; 2024 Lyon Heritage Sites. Discover the rich history of
							Lyon.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Layout;
