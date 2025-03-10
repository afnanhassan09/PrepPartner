import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Friends from "./pages/Friends";
import NotFound from "./components/NotFound";
import { Toaster } from "@/components/ui/toaster";

// Simple test component
const TestRoute = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Test Route Works!</h1>
    <p>This confirms that routing is working correctly.</p>
    <Link to="/">Go Home</Link>
  </div>
);

function App() {
  console.log("App component rendering with routes");

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/test-route" element={<TestRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-right"
        containerClassName="toast-container"
        toastOptions={{
          style: {
            zIndex: 100000,
            position: "relative",
          },
        }}
      />
    </>
  );
}

export default App;
