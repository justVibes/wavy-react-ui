import {
  BasicDiv,
  BasicOl,
  BasicSpan,
  NextButton,
  PreviousButton,
  SubmitButton,
  UseDialogControllerReturn,
  useManagedRef,
  useRerender,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { strictArray } from "@wavy/fn";
import { createContext, useContext, useEffect, useState } from "react";
import { BasicOlProps } from "../html/ol/BasicOl";
import BasicDialog from "./BasicDialog";

const FormContext = createContext<{
  rawSections: BasicOlProps<string>["items"];
  activeSection: string;
  completedSections: string[];
}>(null);

interface BasicFormDialogProps<Section extends string> {
  triggerElement?: JSX.Element;
  controller?: UseDialogControllerReturn;
  title?: React.ReactNode;
  defaultSection?: Section;
  sections: BasicOlProps<Section>["items"];
  sectionMapper: Record<
    Section,
    {
      title: string;
      description: string;
      element:
        | JSX.Element
        | (() => JSX.Element)
        | ((props: { incompleteSections: Section[] }) => JSX.Element);
    }
  >;
  checkCompletionOnMount?: boolean;
  /**
   * @default false
   */
  unmountOnExit?: boolean;
  rerenderOnClose?: boolean;
  isSectionComplete: (section: Section) => boolean;
  onSectionsStatusChange?: (
    incompleteSections: Section[],
    completedSections: Section[]
  ) => void;
  ignoredSections?: Section[];
  hideSubmitButton?: boolean;
  onSubmit?: () => Promise<void>;
}

function BasicFormDialog<Sections extends string>(
  props: BasicFormDialogProps<Sections>
) {
  const sections = props.sections.flatMap((sect) =>
    typeof sect === "object" ? sect.nestedItems : sect
  );
  const defaultIdx = props.defaultSection
    ? sections.findIndex((sect) => sect === props.defaultSection)
    : 0;
  const [activeSectionIdx, setActiveSectionIdx] = useState(
    defaultIdx >= 0 ? defaultIdx : 0
  );
  const { triggerRerender: triggerRerender } = useRerender();
  const completedSectionsRef = useManagedRef<string[]>([]);

  const activeSection = sections[activeSectionIdx];
  const ignoredSections = Array.isArray(props.ignoredSections)
    ? props.ignoredSections
    : strictArray([props.ignoredSections]);
  const previousDisabled = activeSectionIdx <= 0;

  props.checkCompletionOnMount &&
    useEffect(() => {
      sections.forEach((sect, idx) => {
        updateCompletedSections(sect, idx);
      });

      triggerRerender();
    }, []);

  const getIncompleteSections = (
    completedSections = completedSectionsRef.read()
  ) => {
    return sections.filter(
      (sect) =>
        !completedSections.includes(sect) && !ignoredSections.includes(sect)
    );
  };

  const updateCompletedSections = (
    section = activeSection,
    sectionIdx = activeSectionIdx
  ) => {
    let completedSections = completedSectionsRef.read();
    if (ignoredSections.includes(section)) return;
    if (
      props.isSectionComplete(section) &&
      !completedSections.includes(section)
    ) {
      completedSections = [...completedSections, section];
    } else if (
      !props.isSectionComplete(section) &&
      completedSections.includes(section)
    ) {
      completedSections = completedSections.filter((_, i) => i !== sectionIdx);
    } else return;

    completedSectionsRef.upsert(completedSections);
    props.onSectionsStatusChange?.(
      getIncompleteSections(completedSections),
      completedSections as Sections[]
    );
  };

  const handleChangeSection = (section: string) => {
    updateCompletedSections();
    setActiveSectionIdx(sections.findIndex((sect) => sect === section));
  };
  const handleNextClick = () => {
    // The active section index is that last greater than or equal to the last index of the sections[]
    if (activeSectionIdx >= sections.length - 1) return;

    updateCompletedSections();
    setActiveSectionIdx(activeSectionIdx + 1);
  };
  const handlePreviousClick = () => {
    if (previousDisabled) return;
    updateCompletedSections();
    setActiveSectionIdx(activeSectionIdx - 1);
  };
  return (
    <FormContext.Provider
      value={{
        activeSection,
        completedSections: completedSectionsRef.read(),
        rawSections: props.sections,
      }}
    >
      <BasicDialog
        controller={props.controller}
        triggerElement={props.triggerElement}
        unmountOnExit={props.unmountOnExit}
        height="30rem"
        width="45rem"
        maxWidth="45rem"
        backdropBlur="1rem"
        padding={"0px"}
        rerenderOnClose={props.rerenderOnClose}
        backgroundColor="transparent"
        spill={"hidden"}
      >
        <BasicDialog.Body
          grid
          gap="0px"
          width="full"
          height="full"
          spill={"hidden"}
          gridCols=".45fr 1fr"
        >
          <Sidebar title={props.title} onSectionClick={handleChangeSection} />
          <Main
            hideSubmitButton={props.hideSubmitButton}
            sectionMapper={props.sectionMapper}
            previousDisabled={previousDisabled}
            onPreviousClick={handlePreviousClick}
            onNextClick={handleNextClick}
            incompleteSections={getIncompleteSections()}
            onSubmitClick={props.onSubmit}
          />
        </BasicDialog.Body>
      </BasicDialog>
    </FormContext.Provider>
  );
}

function Sidebar(props: {
  title: React.ReactNode | undefined;
  onSectionClick: (section: string) => void;
}) {
  const {
    rawSections: sections,
    activeSection,
    completedSections,
  } = useContext(FormContext);
  return (
    <BasicDiv
      size="full"
      padding={"xl"}
      backgroundColor="surfaceContainer"
      gap={props.title ? "xl" : undefined}
      spill={"hidden"}
    >
      {props.title && (
        <BasicDiv fontSize="lg" fontWeight="bold" spill={"hidden"}>
          {props.title}
        </BasicDiv>
      )}
      <BasicOl
        width="full"
        items={sections}
        isItemActive={(item) => activeSection === item}
        isItemCompleted={(item) => completedSections.includes(item)}
        onItemClick={props.onSectionClick}
      />
    </BasicDiv>
  );
}

function Main(props: {
  previousDisabled: boolean;
  sectionMapper: BasicFormDialogProps<string>["sectionMapper"];
  incompleteSections: string[];
  hideSubmitButton?: boolean;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onSubmitClick?: () => Promise<void>;
}) {
  const { activeSection } = useContext(FormContext);
  const {
    title,
    description,
    element: Element,
  } = props.sectionMapper[activeSection];
  const CurrentSection =
    typeof Element === "function" ? (
      <Element incompleteSections={props.incompleteSections} />
    ) : (
      Element
    );
  return (
    <BasicDiv
      size="full"
      backgroundColor="surfaceContainer[0.5]"
      padding={"3rem"}
      gap={"xl"}
      grid
      gridRows="auto 1fr auto"
      justify="space-between"
      spill={"hidden"}
    >
      <BasicDiv>
        <BasicSpan text={title} fontSize="xl" fontWeight="bold" />
        <span children={description} style={{ opacity: 0.75 }} />
      </BasicDiv>

      <BasicDiv size="full" gap={"lg"}>
        {CurrentSection}
      </BasicDiv>

      <BasicDiv row width="full" align="center" justify="space-between">
        <PreviousButton
          disabled={props.previousDisabled}
          onClick={props.onPreviousClick}
        />
        {activeSection === "Submission" ? (
          !props.hideSubmitButton && (
            <SubmitButton
              disabled={!!props.onSubmitClick}
              onClick={props.onSubmitClick}
            />
          )
        ) : (
          <NextButton onClick={props.onNextClick} />
        )}
      </BasicDiv>
    </BasicDiv>
  );
}

export default BasicFormDialog;
