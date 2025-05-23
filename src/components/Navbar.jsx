// src/components/Navbar.tsx
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          AI Exam Generator
        </h1>
        <nav className="flex gap-6 font-medium">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
            Home
          </span>
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/exam")}>
            Try Exam
          </span>
        </nav>
      </div>
    </header>
  );
}
