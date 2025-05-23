// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exam from "./pages/Exam";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/exam"
        element={
          <Layout>
            <Exam />
          </Layout>
        }
      />
    </Routes>
  );
}
