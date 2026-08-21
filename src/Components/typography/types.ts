import { TextStyle, TextProps } from "react-native";

export interface PropsTypes extends TextProps {
  children?: string | null | React.ReactNode;
  style?: TextStyle;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  color?: string;
  size?: number;
}
