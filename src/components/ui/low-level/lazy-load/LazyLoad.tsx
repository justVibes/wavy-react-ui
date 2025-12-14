import { usePostRenderEffect, useRerender } from "@/main";
import React, { useEffect, useRef, useState } from "react";

interface LazyLoadProps {
  /**Load children when `n*100` percent of the page is visible.
   * When `n === 0.1`, the children are loaded when `10%` of the page is visible.
   * @default 0.1 */
  threshold?: number;
  /**The element that's rendered while the children aren't visible */
  children: React.ReactNode;
  /** Reloads the children everytime it comes in view
   * @default false
   */
  reloadOnEnter?: boolean;
  idleElement?: React.ReactNode;
  /** The ancestor element that should be used to determine if the child is in view (defaults to the LazyLoad's direct parent)
   */
  root?: Element | Document | HTMLElement;
  /**@default "0px" */
  rootMargin?: string;

  slotProps?: Partial<{
    divWrapper?: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
  }>;
}
function LazyLoad(props: LazyLoadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { triggerRerender } = useRerender();

//   console.l
  usePostRenderEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.
        // Update state when the element intersects with the viewport
        if (entry.isIntersecting) {
            // console.log(entry.rootBounds, entry.target)
          if (!isVisible) setIsVisible(true);
          else if (props.reloadOnEnter) triggerRerender();
          else observer.unobserve(entry.target);
        }
      },
      {
        root: props.root || ref.current?.parentElement,
        rootMargin: props.rootMargin || "0px",
        threshold: props.threshold ?? 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
      const cleanup = () => {
        observer.unobserve(ref.current);
      };

      return cleanup;
    }
  }, [props.reloadOnEnter]);

  return (
    <div ref={ref} {...(props.slotProps?.divWrapper || {})}>
      {isVisible ? props.children : props.idleElement}
    </div>
  );
}

export { LazyLoad, type LazyLoadProps };
