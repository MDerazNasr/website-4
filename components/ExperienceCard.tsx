"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";

interface ExperienceCardProps {
  type: "education" | "experience";
  title: string;
  organization: string;
  location: string;
  period: string;
  logo: string;
  details?: string[];
  gpa?: string;
}

const ExperienceCard = ({
  type,
  title,
  organization,
  location,
  period,
  logo,
  details,
  gpa,
}: ExperienceCardProps) => {
  return (
    <StyledWrapper>
      <div className="card">
        <span className="glass" />
        <div className="content">
          <div className="logo-container">
            <img src={logo} alt={organization} className="logo" />
          </div>
          <div className="info">
            <h3 className="title">{title}</h3>
            <h4 className="organization">{organization}</h4>
            <div className="meta">
              <span className="location">{location}</span>
              <span className="period">{period}</span>
            </div>
            {gpa && <p className="gpa">GPA: {gpa}</p>}
            {details && details.length > 0 && (
              <ul className="details">
                {details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    background: #171717;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 3px 1px #00000088;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .card .content {
    border-radius: 8px;
    background: #171717;
    width: calc(100% - 6px);
    z-index: 1;
    padding: 20px;
    color: white;
    display: flex;
    gap: 20px;
    position: relative;
  }

  .logo-container {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .title {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0;
    color: #ff00ff;
    line-height: 1.3;
  }

  .organization {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: #ffffff;
  }

  .meta {
    display: flex;
    gap: 15px;
    font-size: 0.8rem;
    color: #aaaaaa;
  }

  .gpa {
    font-size: 0.8rem;
    color: #aaaaaa;
    margin: 0;
  }

  .details {
    list-style: none;
    padding: 0;
    margin: 6px 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .details li {
    font-size: 0.85rem;
    line-height: 1.4;
    color: #cccccc;
    padding-left: 15px;
    position: relative;
  }

  .details li::before {
    content: "–";
    position: absolute;
    left: 0;
    color: #ff00ff;
  }

  .content::before {
    opacity: 0;
    transition: opacity 300ms;
    content: " ";
    display: block;
    background: #fff5;
    width: 50px;
    height: 50px;
    position: absolute;
    filter: blur(50px);
  }

  .card:hover .content::before {
    opacity: 1;
  }

  .card::before {
    opacity: 1;
    content: "";
    position: absolute;
    display: block;
    width: 120px;
    height: 400px;
    transform: rotate(0deg) translateY(50%);
    background: linear-gradient(90deg, #ff00ff, transparent);
    transition: opacity 300ms;
    animation: rotation_9018 3000ms infinite linear;
    animation-play-state: paused;
  }

  .card::after {
    opacity: 1;
    content: "";
    position: absolute;
    display: block;
    width: 120px;
    height: 400px;
    transform: rotate(0deg) translateY(-50%);
    background: linear-gradient(90deg, transparent, #ff00ff);
    transition: opacity 300ms;
    animation: rotation_9019 3000ms infinite linear;
    animation-play-state: paused;
  }

  .card:hover::before {
    opacity: 1;
    animation-play-state: running;
  }

  .card:hover::after {
    opacity: 1;
    animation-play-state: running;
  }

  .card:hover .glass {
    opacity: 0;
  }

  .glass {
    position: absolute;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: #17171733;
    backdrop-filter: blur(50px);
    z-index: 1;
    transition-duration: 0.5s;
  }

  @keyframes rotation_9018 {
    0% {
      transform: rotate(0deg) translateY(50%);
    }
    100% {
      transform: rotate(360deg) translateY(50%);
    }
  }

  @keyframes rotation_9019 {
    0% {
      transform: rotate(0deg) translateY(-50%);
    }
    100% {
      transform: rotate(360deg) translateY(-50%);
    }
  }
`;

export default ExperienceCard;
