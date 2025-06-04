import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import AnimePage from "./pages/AnimePage";
import AnimeList from "./pages/AnimeList";

export default function App() {
    return (
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/anime/:id" element={<AnimePage />} />
                <Route path="/list/:modificator" element={<AnimeList />} />
            </Routes>
    );
}

