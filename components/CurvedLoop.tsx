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

    const handleTextClick = (e: React.MouseEvent<SVGTextElement>) => {
        // Don't handle clicks if dragging
        if (dragRef.current) return;

        // Get the SVG text element and its position
        const textElement = e.currentTarget;
        const svg = textElement.closest('svg');
        if (!svg || !textPathRef.current || !spacing) return;

        const rect = svg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        // Calculate which item was clicked based on the actual text structure
        // The text repeats, so we need to find the position within one cycle
        const seperator = ' ꩜ ';
        const singleCycleText = navItems.map(item => item.label).join(seperator) + seperator;
        
        // Calculate the position along the curved path
        // The viewBox is 1440 wide, and we need to account for the offset
        const viewBoxWidth = 1440;
        const normalizedX = (clickX / rect.width) * viewBoxWidth;
        
        // Account for the current scroll offset (wrapped to one cycle)
        const normalizedOffset = ((offset % spacing) + spacing) % spacing;
        const positionInCycle = ((normalizedX - normalizedOffset + spacing) % spacing);
        
        // Calculate which character in the single cycle this corresponds to
        // This is approximate since we're dealing with curved text
        const charPosition = Math.floor((positionInCycle / spacing) * singleCycleText.length);
        const actualCharIndex = charPosition % singleCycleText.length;
        
        // Find which item this character belongs to
        let currentPos = 0;
        let clickedItem: NavItem | null = null;
        
        for (let i = 0; i < navItems.length; i++) {
            const item = navItems[i];
            const itemText = item.label;
            const itemStart = currentPos;
            const itemEnd = currentPos + itemText.length;
            
            // Check if the click is within this item's text range
            if (actualCharIndex >= itemStart && actualCharIndex < itemEnd) {
                clickedItem = item;
                break;
            }
            
            // Move to next item (item text + separator)
            currentPos += itemText.length + seperator.length;
        }

        // Handle the click (only once per click event)
        if (clickedItem) {
            e.stopPropagation(); // Prevent multiple triggers
            if (clickedItem.href) {
                window.location.href = clickedItem.href;
            } else if (clickedItem.onClick) {
                clickedItem.onClick();
            }
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
  const [isHovered, setIsHovered] = useState(false);
  const speedRef = useRef(speed);
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
  }, [spacing, speedRef, ready]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speedRef.current : -speedRef.current;
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
  useEffect(() => {
    speedRef.current = isHovered ? speed * 0.3 : speed;
  }, [isHovered, speed]);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
