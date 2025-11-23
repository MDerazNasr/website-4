'use client';
//import for resume section
import { gsap } from 'gsap';

//background and curvedloop
import Squares from '@/components/Squares';
import CurvedLoop from '@/components/CurvedLoop';

//Dock
import Dock from '@/components/Dock';
import { VscHome, VscArchive, VscAccount, VscSettingsGear, VscGithub, VscMail, VscLightbulbAutofix } from 'react-icons/vsc';
import { SiLinkedin, SiGithub, SiGmail } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';  // Add this line

//PillNav
import PillNav from '@/components/PillNav';
// import logo from '/path/to/logo.svg';
import { useState, useEffect, useRef } from 'react';

//SplitText
import SplitText from '@/components/SplitText';
//ASCIIText
import ASCIIText from '@/components/ASCIIText';
//GradientText
import GradientText from '@/components/GradientText';
//ShuffleText
import Shuffle from '@/components/Shuffle';


export default function Home() {
  const [showToast, setShowToast] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const email = 'mderaznasr@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const scrollToResume = () => {
    const resumeSection = document.getElementById('resume');
    if (resumeSection) {
      const targetY = resumeSection.offsetTop;
      const startY = window.scrollY;
      
      // Create a proxy object to animate
      const scrollObj = { y: startY };
      
      gsap.to(scrollObj, {
        y: targetY,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        }
      });
    }
  };
  const curvedLoopItems = [
    { label: 'About Me' },
    { label: 'Resume', onClick: scrollToResume },
    { label: 'Education' },
    { label: 'Experience' },
    { label: 'Projects' },
    { label: 'Contact' }
  ];

  // Ensure only one Home button - filter duplicates by label
  const pillNavItems = [
    { label: 'Github', href: 'https://github.com/MDerazNasr' },
    { label: 'Home', href: '/home', onClick: handleHomeClick },
    { label: 'Email', href: '/email', onClick: handleEmailClick },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohamed-deraz-nasr-21825b203/' }
  ].filter((item, index, self) => 
    index === self.findIndex((t) => t.label === item.label)
  );

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <main className="relative min-h-screen">
      {/* Background layer - Squares component */}
      <div className="absolute inset-0 z-0">
        <Squares 
          speed={1} 
          squareSize={40}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#ff00ff'
        />
      </div>
      
      {/* Content layer - your content goes here */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        {/* CurvedLoop - positioned at the top */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10 w-full">
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
        <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Shuffle
            text="Welcome to my website!"
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
            style={{ fontWeight: 'bold' }}
          />
        </div>
      </div>

      {/* Resume Section */}
      <section id="resume" className="min-h-screen relative z-10 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Resume</h2>
          {/* PDF Viewer will go here in the next step */}
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
