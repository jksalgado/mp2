import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";
import { ResultsProvider } from "./context/ResultsContext";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter basename="/mp2">
      <ResultsProvider>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/pokemon/:name" element={<DetailView />} />
            <Route path="*" element={<p className="container">Not Found</p>} />
          </Routes>
        </main>
      </ResultsProvider>
    </BrowserRouter>
  );
}
