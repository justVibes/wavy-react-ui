import { Button, ButtonGroup, Stack, Steps } from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import { StepsVariant } from "node_modules/@chakra-ui/react/dist/types/styled-system/generated/recipes.gen";
import React from "react";
import { IconType } from "react-icons";
import { LuCheck } from "react-icons/lu";

interface BasicStepperProps extends StepsVariant {
  steps: {
    title: string;
    description: React.ReactNode | (() => React.ReactNode);
    icon?: IconType;
  }[];
  showBg?: boolean;
  defaultStep?: number;
  completedel?: JSX.Element | "none";
  colorScheme?: Steps.RootProps["colorPalette"];
  indent?: Steps.RootProps["paddingLeft"] | boolean;
  nested?: boolean;
  value?: Steps.RootProviderProps["value"];
  footer?: (props: {
    PrevTrigger: (props: { children: JSX.Element }) => JSX.Element;
    NextTrigger: (props: { children: JSX.Element }) => JSX.Element;
  }) => JSX.Element;
}
function BasicStepper(props: BasicStepperProps) {
  const Wrapper = ({ children }: { children: JSX.Element[] }) => {
    const coreProps: Partial<Steps.RootProviderProps> = {
      ...props,
      paddingLeft: typeof props.indent === "boolean" ? "11" : props.indent,
      height: "full",
      width: "full",
      gap: "7",
      overflow: "hidden",
      style: { backgroundColor: props.showBg ? "red" : "transparent" },
      colorPalette: props.colorScheme,
    };

    if (props.value)
      return (
        <Steps.RootProvider value={props.value} {...coreProps}>
          {children}
        </Steps.RootProvider>
      );
    return (
      <Steps.Root {...coreProps} count={props.steps.length}>
        {children}
      </Steps.Root>
    );
  };
  return (
    <Wrapper>
      <Steps.List opacity={props.nested ? 0.7 : 1}>
        {props.steps.map((step, index) => (
          <Steps.Item
            // _icon={step.icon ? <step.icon/> : undefined}
            key={index}
            index={index}
            title={step.title}
          >
            <Steps.Trigger>
              <Steps.Indicator>
                {step.icon && (
                  <Steps.Status
                    incomplete={<step.icon />}
                    complete={<LuCheck />}
                  />
                )}
              </Steps.Indicator>
              <Steps.Title>{step.title}</Steps.Title>
            </Steps.Trigger>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      <Stack
        justifyContent={"space-between"}
        height={"full"}
        width={"full"}
        overflow={"hidden"}
      >
        {props.steps.map((step, index) => (
          <Steps.Content
            height={"full"}
            width={"full"}
            key={index}
            index={index}
            overflow={"hidden"}
          >
            {typeof step.description === "function" ? (
              <step.description />
            ) : (
              step.description
            )}
          </Steps.Content>
        ))}
        {props.completedel !== "none" && (
          <Steps.CompletedContent height={"full"} width={"full"} overflow={"hidden"}>
            {props.completedel || "All steps are complete!"}
          </Steps.CompletedContent>
        )}

        {props.footer ? (
          <props.footer
            PrevTrigger={({ children }) => (
              <Steps.PrevTrigger asChild children={children} />
            )}
            NextTrigger={({ children }) => (
              <Steps.NextTrigger asChild children={children} />
            )}
          />
        ) : (
          <ButtonGroup size="sm" variant="outline">
            <Steps.PrevTrigger asChild>
              <Button>Prev</Button>
            </Steps.PrevTrigger>
            <Steps.NextTrigger asChild>
              <Button>Next</Button>
            </Steps.NextTrigger>
          </ButtonGroup>
        )}
      </Stack>
    </Wrapper>
  );
}

export default BasicStepper;
