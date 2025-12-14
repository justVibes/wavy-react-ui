import { usePostRenderEffect, useRerender } from "@/main";
import { isIterable, isPromise } from "@wavy/fn";
import React, { useEffect, useRef, useState } from "react";

interface LazyLoadProps {
  wrap?: boolean;
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
  const children = useRef(props.children);
  const parentRef = useRef<HTMLDivElement>(null);
  const isWrapped = useRef(false);
  const Parent = ({ children }: { children: React.ReactNode }) => {
    if (
      props.wrap ||
      Array.isArray(children) ||
      isIterable(children) ||
      isPromise(children) ||
      typeof children === "string" ||
      typeof children === "number" ||
      typeof children === "bigint" ||
      typeof children === "boolean"
    ) {
      isWrapped.current = true;
      return (
        <div ref={parentRef} {...(props.slotProps?.divWrapper || {})}>
          {children}
        </div>
      );
    }
    //@ts-expect-error
    return React.cloneElement(children, { ref: parentRef });
  };
  const [isVisible, setIsVisible] = useState(false);
  const { triggerRerender } = useRerender();

  //   console.l

  useEffect(() => {
    if (!isWrapped.current && parentRef.current) {
      const div = document.createElement("div");
      for (const child of parentRef.current.children) {
        div.appendChild(child);
      }
      const el = React.createElement("div", { ...div });

      children.current = el;
      triggerRerender()
    }
  }, []);

  //   usePostRenderEffect(() => {
  //     const observer = new IntersectionObserver(
  //       ([entry]) => {
  //         // entry.
  //         // Update state when the element intersects with the viewport
  //         if (entry.isIntersecting) {
  //           // console.log(entry.rootBounds, entry.target)
  //           if (!isVisible) setIsVisible(true);
  //           else if (props.reloadOnEnter) triggerRerender();
  //           else observer.unobserve(entry.target);
  //         }
  //       },
  //       {
  //         root: props.root || parentRef.current?.parentElement,
  //         rootMargin: props.rootMargin || "0px",
  //         threshold: props.threshold ?? 0.1,
  //       }
  //     );

  //     if (parentRef.current) {
  //       observer.observe(parentRef.current);
  //       const cleanup = () => {
  //         observer.unobserve(parentRef.current);
  //       };

  //       return cleanup;
  //     }
  //   }, [props.reloadOnEnter]);

  return <Parent>{isVisible ? children.current : props.idleElement}</Parent>;
}

export { LazyLoad, type LazyLoadProps };
