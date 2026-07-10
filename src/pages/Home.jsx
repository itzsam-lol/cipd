import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import FeaturedVideo from "@/components/FeaturedVideo";
import Projects from "@/components/Projects";
import Events from "@/components/Events";
import LatestBlogs from "@/components/LatestBlogs";
import StudentExperience from "@/components/StudentExperience";
import ShareIdeas from "@/components/ShareIdeas";
import Connect from "@/components/Connect";

export default function Home() {
  return (
    <main data-testid="home-page" className="text-ink font-body" style={{ overflowX: "clip", background: "var(--bg)" }}>
      <Nav />
      <Hero />
      <Story />
      <FeaturedVideo />
      <Projects />
      <Events />
      <LatestBlogs />
      <StudentExperience />
      <ShareIdeas />
      <Connect />
    </main>
  );
}
