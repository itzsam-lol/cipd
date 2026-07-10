import "@/App.css";
import "@/styles/tiptap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import IpdCp from "@/pages/IpdCp";
import Blogs from "@/pages/Blogs";
import BlogPost from "@/pages/BlogPost";
import EventsPage from "@/pages/EventsPage";
import Login from "@/pages/Login";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminBlogs from "@/admin/AdminBlogs";
import AdminBlogEditor from "@/admin/AdminBlogEditor";
import AdminEvents from "@/admin/AdminEvents";
import AdminEventEditor from "@/admin/AdminEventEditor";
import AdminAnnouncements from "@/admin/AdminAnnouncements";
import AdminSubmissions from "@/admin/AdminSubmissions";
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
          <Route path="/events" element={<EventsPage />} />
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
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/new"
            element={
              <ProtectedRoute>
                <AdminEventEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/edit/:id"
            element={
              <ProtectedRoute>
                <AdminEventEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute>
                <AdminAnnouncements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <ProtectedRoute>
                <AdminSubmissions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
