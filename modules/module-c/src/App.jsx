import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HeritagePage from "./pages/HeritagePage";
import TagPage from "./pages/TagPage";
import ContentProvider from "./contexts/ContentProvider";
import Layout from "./components/Layout";

function App() {
  return (
    <ContentProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/heritages/*" element={<HeritagePage />} />
          <Route path="/tags/:tagName" element={<TagPage />} />
        </Routes>
      </Layout>
    </ContentProvider>
  );
}

export default App;
