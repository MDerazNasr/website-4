import Squares from '@/components/Squares';

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
      </div>
    </main>
  );
}
