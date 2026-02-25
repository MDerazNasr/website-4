"use client";
//import for resume section
import { gsap } from "gsap";
// Removed problematic react-pdf-viewer - using iframe instead
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";

//background and curvedloop
import Squares from "@/components/Squares";
import CurvedLoop from "@/components/CurvedLoop";

//Dock
import Dock from "@/components/Dock";
import {
  VscHome,
  VscArchive,
  VscAccount,
  VscSettingsGear,
  VscGithub,
  VscMail,
  VscLightbulbAutofix,
} from "react-icons/vsc";
import { SiLinkedin, SiGithub, SiGmail } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa"; // Add this line

//PillNav
import PillNav from "@/components/PillNav";
// import logo from '/path/to/logo.svg';
import { useState, useEffect, useRef } from "react";

//SplitText
import SplitText from "@/components/SplitText";
//ASCIIText
import ASCIIText from "@/components/ASCIIText";
//GradientText
import GradientText from "@/components/GradientText";
//ShuffleText
import Shuffle from "@/components/Shuffle";
//Carousel
import Carousel, { CarouselItem } from "@/components/Carousel";
//ReflectiveCard
import ReflectiveCard from "@/components/ReflectiveCard";
//ProjectBento
import ProjectBento from "@/components/ProjectBento";
//LeetCode
import { UserHeatMap } from "react-leetcode";
//GitHub Contribution Graph
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
} from "@/components/kibo-ui/contribution-graph";
import { eachDayOfInterval, endOfYear, formatISO, startOfYear } from "date-fns";
import { cn } from "@/lib/utils";

//PDF Viewer - using iframe instead
// const defaultLayoutPluginInstance = defaultLayoutPlugin();

// LeetCode Stats Component
const LeetCodeStats = ({ username }: { username: string }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      try {
        const query = `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `;

        const response = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { username },
          }),
        });

        const result = await response.json();
        setStats(result.data?.matchedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching LeetCode stats:", error);
        setLoading(false);
      }
    };

    fetchLeetCodeStats();
  }, [username]);

  if (loading) {
    return <div className="text-white/70">Loading LeetCode stats...</div>;
  }

  if (!stats) {
    return (
      <div className="text-white/70">
        <p>Unable to load LeetCode stats.</p>
        <a
          href={`https://leetcode.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff00ff] hover:underline"
        >
          View on LeetCode
        </a>
      </div>
    );
  }

  const submissions = stats.submitStatsGlobal?.acSubmissionNum || [];
  const easy =
    submissions.find((s: any) => s.difficulty === "Easy")?.count || 0;
  const medium =
    submissions.find((s: any) => s.difficulty === "Medium")?.count || 0;
  const hard =
    submissions.find((s: any) => s.difficulty === "Hard")?.count || 0;
  const total =
    submissions.find((s: any) => s.difficulty === "All")?.count || 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-3xl font-bold text-[#ff00ff]">{total}</h4>
        <p className="text-white/70 text-sm">Problems Solved</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#262626] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{easy}</div>
          <div className="text-white/70 text-sm">Easy</div>
        </div>
        <div className="bg-[#262626] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{medium}</div>
          <div className="text-white/70 text-sm">Medium</div>
        </div>
        <div className="bg-[#262626] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{hard}</div>
          <div className="text-white/70 text-sm">Hard</div>
        </div>
      </div>
      <div className="text-center">
        <a
          href={`https://leetcode.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff00ff] hover:underline text-sm"
        >
          View full profile on LeetCode →
        </a>
      </div>
    </div>
  );
};

// GitHub Contribution Graph Component
const GitHubContributionGraph = ({ username }: { username: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const now = new Date();
        const fromDate = startOfYear(now).toISOString();
        const toDate = now.toISOString();

        const query = `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN || ""}`,
          },
          body: JSON.stringify({
            query,
            variables: {
              username,
              from: fromDate,
              to: toDate,
            },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0]?.message || "GitHub API error");
        }

        const contributions =
          result.data?.user?.contributionsCollection?.contributionCalendar?.weeks
            ?.flatMap((week: any) => week.contributionDays)
            .map((day: any) => {
              const count = day.contributionCount;
              const maxCount = 20;
              const maxLevel = 4;
              const level =
                count === 0
                  ? 0
                  : Math.min(
                      Math.ceil((count / maxCount) * maxLevel),
                      maxLevel,
                    );

              return {
                date: day.date,
                count,
                level,
              };
            }) || [];

        setData(contributions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setError(error instanceof Error ? error.message : "Failed to load");
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  if (loading) {
    return <div className="text-white/70">Loading contributions...</div>;
  }

  if (error) {
    return (
      <div className="text-white/70">
        <p>Unable to load GitHub contributions.</p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff00ff] hover:underline"
        >
          View on GitHub
        </a>
      </div>
    );
  }

  return (
    <ContributionGraph data={data}>
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            className={cn(
              'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
              'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
              'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
              'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
              'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]',
            )}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter />
    </ContributionGraph>
  );
};

export default function Home() {
  const [showToast, setShowToast] = useState(false);

  // Projects data - replace with your actual projects
  const projects: CarouselItem[] = [
    {
      id: 1,
      title: "Affinity Map",
      description:
        "Trained a few-shot protein embedding model with UMAP visualization to explore functional similarities across protein families.",
      repoUrl: "https://github.com/MDerazNasr/Protein-fewshot",
      techStack: [
        {
          name: "Python",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        },
        {
          name: "PyTorch",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
        },
        {
          name: "NumPy",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
        },
      ],
    },
    {
      id: 2,
      title: "RL Race Simulator",
      description:
        "Designed multi-threaded race sim running 10K+ epochs, outperforming baseline strategies with 4x faster training throughput.",
      repoUrl: "https://github.com/MDerazNasr/Race-Strategy-Simulator",
      techStack: [
        {
          name: "Python",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        },
        {
          name: "PyTorch",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
        },
        {
          name: "TypeScript",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
      ],
    },
    {
      id: 3,
      title: "Protein Diffusion",
      description:
        "Built diffusion-driven protein generator enabling fast 3D structure generation, conditioning, and biological plausibility scoring.",
      repoUrl: "https://github.com/MDerazNasr/Protein-Diffusion",
      techStack: [
        {
          name: "Python",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        },
        {
          name: "PyTorch",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
        },
        {
          name: "C++",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        },
      ],
    },
    {
      id: 4,
      title: "Financial Research Agent",
      description:
        "Architected an agentic financial intelligence system using LangGraph and Gemini 2.0, achieving 100% data fidelity via SEC XBRL extraction and multi-tier cascading API architecture.",
      repoUrl:
        "https://github.com/MDerazNasr/finance-intelligence-agentic-system",
      techStack: [
        {
          name: "Python",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        },
      ],
    },
    {
      id: 5,
      title: "High-Performance Image Pipeline",
      description:
        "Developed a multi-threaded C++17 image processing engine with O(N) separable filters and custom memory management for high-performance 4K video streams.",
      repoUrl: "https://github.com/MDerazNasr/Image-Filter-Pipeline",
      techStack: [
        {
          name: "C++",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        },
      ],
    },
    {
      id: 6,
      title: "This Website!",
      description: "",
      repoUrl: "https://github.com/MDerazNasr/website-4",
      techStack: [
        {
          name: "TypeScript",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
        {
          name: "React",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          name: "CSS",
          logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        },
      ],
    },
  ];

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const email = "mderaznasr@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const scrollToResume = () => {
    const resumeSection = document.getElementById("resume");
    if (resumeSection) {
      const targetY = resumeSection.offsetTop;
      const startY = window.scrollY;

      // Create a proxy object to animate
      const scrollObj = { y: startY };

      gsap.to(scrollObj, {
        y: targetY,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        },
      });
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      const targetY = projectsSection.offsetTop;
      const startY = window.scrollY;

      const scrollObj = { y: startY };

      gsap.to(scrollObj, {
        y: targetY,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        },
      });
    }
  };

  const scrollToAboutMe = () => {
    const aboutMeSection = document.getElementById("about-me");
    if (aboutMeSection) {
      const targetY = aboutMeSection.offsetTop;
      const startY = window.scrollY;

      const scrollObj = { y: startY };

      gsap.to(scrollObj, {
        y: targetY,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        },
      });
    }
  };

  const curvedLoopItems = [
    { label: "About Me", onClick: scrollToAboutMe },
    { label: "Resume", onClick: scrollToResume },
    { label: "Education + Experience" },
    { label: "Projects", onClick: scrollToProjects },
  ];

  // Ensure only one Home button - filter duplicates by label
  const pillNavItems = [
    { label: "Github", href: "https://github.com/MDerazNasr" },
    { label: "Home", href: "/home", onClick: handleHomeClick },
    { label: "Email", href: "/email", onClick: handleEmailClick },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mohamed-deraz-nasr-21825b203/",
    },
  ].filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.label === item.label),
  );

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <main className="relative min-h-screen">
      {/* Background layer - Squares component */}
      <div className="absolute inset-0 z-0">
        <Squares
          speed={1}
          squareSize={40}
          direction="diagonal"
          borderColor="#fff"
          hoverFillColor="#ff00ff"
        />
      </div>

      {/* Content layer - your content goes here */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pointer-events-none">
        {/* CurvedLoop - positioned at the top */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10 w-full pointer-events-auto">
          <CurvedLoop
            // ✦ ꩜ ✶ ➤ ✘ ༄ ✧
            items={curvedLoopItems}
            speed={7}
            curveAmount={500}
            direction="right"
            interactive={true}
            className="custom-text-style"
          />
        </div>

        {/* Heading - centered in the middle of the page */}
        <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
          <Shuffle
            text="Mohamed Deraz Nasr"
            shuffleDirection="right"
            duration={1}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            respectReducedMotion={true}
            className="font-bold text-center"
            style={{ fontWeight: "bold" }}
          />
        </div>
      </div>

      {/* About Me Section */}
      <section
        id="about-me"
        className="min-h-screen relative z-10 flex items-center justify-center pointer-events-auto"
      >
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-5xl font-bold mb-16 text-center uppercase">
            About Me
          </h2>
          <div className="max-w-6xl mx-auto space-y-12">
            {/* GitHub Contributions */}
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 uppercase">
                GitHub Contributions
              </h3>
              <div className="flex justify-start">
                <GitHubContributionGraph username="MDerazNasr" />
              </div>
            </div>

            {/* LeetCode Heatmap */}
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6 uppercase">
                LeetCode Progress
              </h3>
              <div className="flex justify-center">
                <UserHeatMap
                  userName="derazmnasr"
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  theme={{
                    primaryColor: "rgba(255, 165, 0, 1)",
                    secondaryColor: "rgba(209, 213, 219, 1)",
                    bgColor: "rgba(26, 26, 26, 1)",
                  }}
                  style={{
                    maxWidth: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section
        id="resume"
        className="min-h-screen relative z-10 flex items-center justify-center pointer-events-auto"
      >
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-5xl font-bold mb-8 text-center uppercase">
            My Resume
          </h2>
          <div
            className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ height: "800px" }}
          >
            <iframe
              src="/resume.pdf#zoom=100"
              className="w-full h-full"
              title="Resume PDF"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen relative z-10 flex items-center justify-center pointer-events-auto"
      >
        <div className="w-full px-4 py-16">
          <h2 className="text-5xl font-bold mb-16 text-center uppercase">
            My Projects
          </h2>
          <ProjectBento
            projects={projects}
            enableSpotlight={true}
            enableBorderGlow={true}
            clickEffect={true}
            spotlightRadius={400}
            glowColor="255, 0, 255"
          />
        </div>
      </section>

      {/* <div className="absolute bottom-0 left-0 right-0">
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={60}
        />
      </div> */}
      <PillNav
        items={pillNavItems}
        activeHref="/home"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#333333"
        pillColor="#333333"
        hoveredPillTextColor="#000000"
        pillTextColor="#ffffff"
      />

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
          Email copied to clipboard!
        </div>
      )}
    </main>
  );
}
