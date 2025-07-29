import Memory_game from "./components/Memory_game.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./components/StartPage.jsx";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />}/>
        <Route path="/game/:difficulty" element={<Memory_game />}/>
      </Routes>
    </Router>
    );
}

export default App