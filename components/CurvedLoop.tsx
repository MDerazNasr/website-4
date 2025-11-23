'use client';
import { useRef, useEffect, useState, useMemo, useId, FC, PointerEvent } from 'react';
import './CurvedLoop.css';

interface NavItem {
    label: string;
    href?: string;
    target?: string;
    // rel?: string;
    // className?: string;
    onClick?: () => void;
    // onMouseEnter?: () => void;
    // onMouseLeave?: () => void;
    // onMouseMove?: (e: MouseEvent) => void;
    // onMouseDown?: (e: MouseEvent) => void;
}

interface CurvedLoopProps {
    items?: NavItem[];
    marqueeText?: string;
    speed?: number;
    className?: string;
    curveAmount?: number;
    direction?: 'left' | 'right';
    interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
    items,
    marqueeText = '',
    speed = 2,
    className,
    curveAmount = 400,
    direction = 'left',
    interactive = true
}) => {

  /* converts the text string into an array of item */
    const parseItems = (text: string): NavItem[] => {
        // split by common separators: ✘ ✦ ꩜ ✶ ➤ ༄ ✧
        const seperators = /[✦✘꩜✶༄✧]/g;;
        const parts = text.split(seperators).map(part => part.trim()).filter(part => part.length > 0);
        return parts.map(label => ({ label }));
        }
    // Parse items from marqueeText or use items prop
    const navItems = useMemo(() => {
        if (items) return items; // If items prop is provided, use it
        return parseItems(marqueeText); // Otherwise, parse the marqueeText
    }, [items, marqueeText]);

    const text = useMemo(() => {
        const seperator = ' ꩜ ';
        const fullText = navItems
            .map((item: NavItem) => item.label)
            .join(seperator) + seperator;
        const hasTrailing = /\s|\u00A0$/.test(fullText);
        return (hasTrailing ? fullText.replace(/\s+$/, '') : fullText) + '\u00A0';
    }, [navItems]);

    const handleTextClick = (e: React.MouseEvent<SVGTextElement>) => {        // Dont handle clicks if dragging
        if (dragRef.current) return;

        //Get the SVG element and its position
        const svg = e.currentTarget.closest('svg');
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        //Calculate which item was clicked based on position
        //This is approximate, needs improvement 
        const itemWidth = spacing / navItems.length;
        const clickedIndex = Math.floor(clickX / itemWidth) % navItems.length;
        const clickedItem = navItems[clickedIndex];

        //Handle the click
        if (clickedItem.href) {
            window.location.href = clickedItem.href;
        } else if (clickedItem.onClick) {
            clickedItem.onClick();
        }
    };
  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<'left' | 'right'>(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join('')
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        let newOffset = currentOffset + delta;
        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;
        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (e: PointerEvent) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;
    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;
    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120">
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text 
          fontWeight="bold" 
          xmlSpace="preserve" 
          className={className}
          onClick={handleTextClick}  // ADD THIS LINE
          style={{ cursor: 'pointer' }}  // ADD THIS LINE
        >
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
