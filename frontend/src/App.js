import "@/App.css";
import "@/styles/tiptap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import IpdCp from "@/pages/IpdCp";
import Blogs from "@/pages/Blogs";
import BlogPost from "@/pages/BlogPost";
import Login from "@/pages/Login";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminBlogs from "@/admin/AdminBlogs";
import AdminBlogEditor from "@/admin/AdminBlogEditor";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { AuthProvider } from "@/auth/AuthContext";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SmoothScroll />
        <Cursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ipd-cp" element={<IpdCp />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedRoute>
                <AdminBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs/new"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs/edit/:id"
            element={
              <ProtectedRoute>
                <AdminBlogEditor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
