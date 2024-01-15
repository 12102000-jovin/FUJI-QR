import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import PDC_QR from "./components/PDC-QR";
import PDC_QRList from "./components/PDC-QRList";
import PDC_Dashboard from "./components/PDCDashboard";
import SubAssemblyDashboard from "./components/SubAssemblyDashboard";
import Test from "./components/Test";

function App() {
  return (
    <div className="App">
      <Router>
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/About">About</Link>
              </li>
              <li>
                <Link to="/PDC-QR">PDC-QR</Link>
              </li>
              <li>
                <Link to="/PDC-QRList">PDC QR List</Link>
              </li>
              <li>
                <Link to="/PDC-Dashboard">PDC Dashboard</Link>
              </li>
              <li>
                <Link to="/Testing"> Test </Link>
              </li>
            </ul>
          </nav>
        </header>

        <div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/PDC-QR" element={<PDC_QR />} />
            <Route path="/PDC-QRList" element={<PDC_QRList />} />
            <Route path="/PDC-Dashboard" element={<PDC_Dashboard />} />
            <Route
              path="/SubAssemblyDashboard"
              element={<SubAssemblyDashboard />}
            />
            <Route path="/Testing" element={<Test />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
