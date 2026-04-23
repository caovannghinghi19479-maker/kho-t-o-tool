import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import CompetitorClone from "./pages/CompetitorClone";
import TextToVideo from "./pages/TextToVideo";
import ImageToVideo from "./pages/ImageToVideo";
import StartEndVideo from "./pages/StartEndVideo";
import IdeaToVideo from "./pages/IdeaToVideo";
import CharacterSync from "./pages/CharacterSync";
import CreateImage from "./pages/CreateImage";
import Storyboard from "./pages/Storyboard";
import ThumbnailStudio from "./pages/ThumbnailStudio";
import JobQueue from "./pages/JobQueue";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[220px] p-6 w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/Dashboard" />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Projects" element={<Projects />} />
          <Route path="/CompetitorClone" element={<CompetitorClone />} />
          <Route path="/TextToVideo" element={<TextToVideo />} />
          <Route path="/ImageToVideo" element={<ImageToVideo />} />
          <Route path="/StartEndVideo" element={<StartEndVideo />} />
          <Route path="/IdeaToVideo" element={<IdeaToVideo />} />
          <Route path="/CharacterSync" element={<CharacterSync />} />
          <Route path="/CreateImage" element={<CreateImage />} />
          <Route path="/Storyboard" element={<Storyboard />} />
          <Route path="/ThumbnailStudio" element={<ThumbnailStudio />} />
          <Route path="/JobQueue" element={<JobQueue />} />
          <Route path="/Settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
