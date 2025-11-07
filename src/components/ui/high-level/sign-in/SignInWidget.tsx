import { BasicButton, BasicColor } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { AUTH_PROVIDERS, AuthProvider } from "@wavy/types";
import { FcGoogle } from "react-icons/fc";
import BasicDiv, { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import BasicSpan from "../../low-level/html/span/BasicSpan";

interface SignInWidgetProps<Auth extends AuthProvider> {
  authProviders?: Auth[];
  glassy?: boolean;
  width?: BasicDivProps["width"];
  backgroundColor?: BasicColor;
  color?: BasicColor;
  header?: JSX.Element;
  zIndex?: number;
  onAuthProviderClick: (provider: Auth) => Promise<void>;
}
function SignInWidget<Provider extends AuthProvider = AuthProvider>(
  props: SignInWidgetProps<Provider>
) {
  const providers = props.authProviders || [...AUTH_PROVIDERS.values()];
  return (
    <BasicDiv
      padding={"1.75rem"}
      corners={"lg"}
      gap={"xl"}
      width={props.width}
      borderColor={props.glassy ? undefined : "outlineVariant"}
      backgroundColor={
        props.backgroundColor ||
        (props.glassy ? "onSurface[0.1]" : "surfaceContainer")
      }
      backdropBlur={props.glassy ? ".5rem" : undefined}
      color={props.color || "onSurface"}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        zIndex: props.zIndex,
      }}
    >
      {props.header || (
        <BasicDiv width="full" color="inherit">
          <BasicSpan fontWeight="bold" fontSize="1.55rem" text="Sign In" />
          <span
            style={{
              opacity: 0.75,
              fontSize: ".95rem",
            }}
            children="Select a sign-in method to continue."
          />
        </BasicDiv>
      )}

      <BasicDiv width="full" color="inherit">
        {providers.map((provider) => (
          <Provider provider={provider} onClick={props.onAuthProviderClick} />
        ))}
      </BasicDiv>
    </BasicDiv>
  );
}

interface AuthProviderProps {
  provider: AuthProvider;
  onClick: SignInWidgetProps<AuthProvider>["onAuthProviderClick"];
}
function Provider(props: AuthProviderProps) {
  const Icon = (() => {
    switch (props.provider) {
      case "Google":
        return FcGoogle;
      default:
        return props.provider satisfies never;
    }
  })();

  const handleOnClick = () => props.onClick(props.provider);

  return (
    <BasicButton
      async
      width="full"
      pendingDelay={1000}
      borderColor={"outlineVariant"}
      backgroundColor={"transparent"}
      color="inherit"
      padding={".75rem"}
      iconSize={"md"}
      leadingEl={Icon}
      // fontSize={"1rem"}
      text={`Continue with ${props.provider}`}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.25) 0px 3px 8px",
      }}
      onClick={handleOnClick}
    />
  );
}

export default SignInWidget;
