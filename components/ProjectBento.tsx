import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Github } from "lucide-react";
import "./ProjectBento.css";

export interface ProjectCardProps {
  title: string;
  description: string;
  repoUrl?: string;
  techStack?: { name: string; logo: string }[];
}

export interface ProjectBentoProps {
  projects: ProjectCardProps[];
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
  clickEffect?: boolean;
}

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".project-bento-section");
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        const cards = gridRef.current.querySelectorAll(".project-bento-card");
        cards.forEach((card) => {
          (card as HTMLElement).style.setProperty("--glow-intensity", "0");
        });
        return;
      }

      const { proximity, fadeDistance } =
        calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      const cards = gridRef.current.querySelectorAll(".project-bento-card");
      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          cardElement,
          e.clientX,
          e.clientY,
          glowIntensity,
          spotlightRadius,
        );
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const ProjectBento: React.FC<ProjectBentoProps> = ({
  projects,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={disableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="project-card-grid project-bento-section" ref={gridRef}>
        {projects.map((project, index) => (
          <div
            key={index}
            className={`project-bento-card ${enableBorderGlow ? "project-bento-card--border-glow" : ""}`}
            style={
              {
                "--glow-color": glowColor,
              } as React.CSSProperties
            }
            ref={(el) => {
              if (!el) return;

              const handleClick = (e: MouseEvent) => {
                if (!clickEffect || disableAnimations) return;

                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const maxDistance = Math.max(
                  Math.hypot(x, y),
                  Math.hypot(x - rect.width, y),
                  Math.hypot(x, y - rect.height),
                  Math.hypot(x - rect.width, y - rect.height),
                );

                const ripple = document.createElement("div");
                ripple.style.cssText = `
                  position: absolute;
                  width: ${maxDistance * 2}px;
                  height: ${maxDistance * 2}px;
                  border-radius: 50%;
                  background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                  left: ${x - maxDistance}px;
                  top: ${y - maxDistance}px;
                  pointer-events: none;
                  z-index: 1000;
                `;

                el.appendChild(ripple);

                gsap.fromTo(
                  ripple,
                  { scale: 0, opacity: 1 },
                  {
                    scale: 1,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => ripple.remove(),
                  },
                );
              };

              el.addEventListener("click", handleClick);
            }}
          >
            <div className="project-bento-card__header">
              <div className="project-bento-card__label">PROJECT</div>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-github-link"
              >
                <Github size={20} />
              </a>
            </div>
            <div className="project-bento-card__content">
              <h2 className="project-bento-card__title">{project.title}</h2>
              <p className="project-bento-card__description">
                {project.description}
              </p>
              {project.techStack && project.techStack.length > 0 && (
                <div className="project-tech-stack">
                  {project.techStack.map((tech, idx) => (
                    <div
                      key={idx}
                      className="project-tech-logo"
                      title={tech.name}
                    >
                      <img src={tech.logo} alt={tech.name} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectBento;
