import React, { ReactNode, useRef, useState, CSSProperties } from 'react';

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top', delay = 100 }) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    let timeout: NodeJS.Timeout;

    const show = () => {
        timeout = setTimeout(() => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                setCoords({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            }
            setVisible(true);
        }, delay);
    };
    const hide = () => {
        clearTimeout(timeout);
        setVisible(false);
    };

    // Позиционирование тултипа
    const getTooltipStyle = (): Partial<CSSProperties> => {
        if (!coords || !ref.current) return { opacity: 0, pointerEvents: 'none' as 'none' };
        const rect = ref.current.getBoundingClientRect();
        const style: Partial<CSSProperties> = { position: 'absolute', zIndex: 9999, pointerEvents: 'none' };
        switch (side) {
            case 'bottom':
                style.top = coords.top + rect.height + 8;
                style.left = coords.left + rect.width / 2;
                style.transform = 'translateX(-50%)';
                break;
            case 'left':
                style.top = coords.top + rect.height / 2;
                style.left = coords.left - 8;
                style.transform = 'translateY(-50%) translateX(-100%)';
                break;
            case 'right':
                style.top = coords.top + rect.height / 2;
                style.left = coords.left + rect.width + 8;
                style.transform = 'translateY(-50%)';
                break;
            default:
                style.top = coords.top - 8;
                style.left = coords.left + rect.width / 2;
                style.transform = 'translate(-50%, -100%)';
        }
        return style;
    };

    return (
        <span
            ref={ref as any}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
            tabIndex={0}
            className="outline-none"
            aria-describedby="tooltip"
        >
            {children}
            {visible && (
                <span
                    id="tooltip"
                    role="tooltip"
                    style={getTooltipStyle()}
                    className="pointer-events-none select-none px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium shadow-lg animate-fadeIn transition-all duration-200"
                >
                    {content}
                </span>
            )}
        </span>
    );
};

export default Tooltip; 