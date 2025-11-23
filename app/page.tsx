import Squares from '@/components/Squares';
import CurvedLoop from '@/components/CurvedLoop';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background layer - Squares component */}
      <div className="absolute inset-0 z-0">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#ff00ff'
        />
      </div>
      
      {/* Content layer - your content goes here */}
      <div className="relative z-10">
        {/* Add your content here */}
          <CurvedLoop 
            marqueeText="About Me ꩜ Resume ꩜ Education ꩜ Experience ꩜ Projects ꩜ Contact ꩜"
            // ✦ ꩜ ✶ ➤ ✘ ༄ ✧
            speed={6.5}
            curveAmount={500}
            direction="right"
            interactive={true}
            className="custom-text-style"
          />
        {/* <CurvedLoop marqueeText="Welcome to React Bits ✦" /> */}
      </div>
    </main>
  );
}
