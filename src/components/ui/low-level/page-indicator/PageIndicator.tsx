import { BasicButton, BasicDiv } from "@/main";
import { buildArray } from "@wavy/fn";
import { useRef, useState } from "react";
import type { IconType } from "react-icons";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { BasicDivProps } from "../html/div/BasicDiv";

interface PageIndicatorProps {
  /**@default 0 */
  currentPage?: number;
  totalPages: number;
  /**@default 5 */
  maxIndicators?: number;
  /**@default "1rem" */
  gap?: BasicDivProps["gap"];
  disableNav?: boolean;
  onNextClick?: () => void | Promise<void>;
  onPreviousClick?: () => void | Promise<void>;
  beforePageChange?: (newPageIdx: number) => void | Promise<void>;
  afterPageChange?: (newPageIdx: number) => void | Promise<void>;
}
function PageIndicator(props: PageIndicatorProps) {
  const nextClickedRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(props.currentPage ?? 0);

  const maxIndicators = props.maxIndicators || 5;
  const maxIndices = maxIndicators - 1;
  const lastPageIdx = props.totalPages - 1;

  const handleChangePage = async (index: number) => {
    if (index === currentPage) return;
    const isNextPage = index === currentPage + 1;
    const pageNumberClicked = Math.abs(index - currentPage) > 1;
    nextClickedRef.current = pageNumberClicked ? null : isNextPage;

    if (!pageNumberClicked) {
      if (isNextPage) await props.onNextClick?.();
      else await props.onPreviousClick?.();
    }

    await props.beforePageChange?.(index);
    setCurrentPage(index);
    await props.afterPageChange?.(index);
  };
  const handlePreviousClick = async () => handleChangePage(currentPage - 1);
  const handleNextClick = async () => handleChangePage(currentPage + 1);

  return (
    <BasicDiv row align="center" gap={props.gap || "1rem"}>
      <Nav
        icon={SlArrowLeft}
        disabled={props.disableNav || currentPage === 0}
        onClick={handlePreviousClick}
      />
      <BasicDiv
        row
        justify={lastPageIdx > maxIndices ? "space-evenly" : undefined}
        align="center"
        gap={".5rem"}
        spill={"hidden"}
        style={{ width: `calc(2.05rem * ${maxIndicators})` }}
      >
        {buildArray(props.totalPages, (i) => {
          const selected = currentPage === i;
          return (
            <BasicDiv
              key={i}
              cursor={props.disableNav ? "default" : "pointer"}
              centerContent
              size={"1.6rem"}
              children={`${i + 1}`}
              corners={"circle"}
              fade={selected ? 1 : 0.5}
              borderColor={selected ? undefined : "onSurface[0.1]"}
              backgroundColor={selected ? "primary" : undefined}
              color={selected ? "onPrimary" : undefined}
              fontSize="xs"
              style={{
                userSelect: "none",
                transition: "transform 200ms linear",
                transform: `translateX(calc(${
                  currentPage < maxIndices
                    ? 0
                    : currentPage === lastPageIdx
                    ? currentPage - maxIndices
                    : currentPage - (maxIndices - 1)
                } * 2.1rem * ${nextClickedRef ? -1 : 1}))`,
                flexShrink: 0,
              }}
              onClick={props.disableNav ? undefined : () => handleChangePage(i)}
            />
          );
        })}
      </BasicDiv>
      <Nav
        icon={SlArrowRight}
        disabled={props.disableNav || currentPage === props.totalPages - 1}
        onClick={handleNextClick}
      />
    </BasicDiv>
  );
}

function Nav(props: {
  icon: IconType;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <BasicButton
      async
      disabled={props.disabled}
      padding={0}
      iconSize="1rem"
      leadingEl={props.icon}
      backgroundColor="transparent"
      color="onSurface"
      onClick={props.onClick}
    />
  );
}

export { PageIndicator, type PageIndicatorProps };
