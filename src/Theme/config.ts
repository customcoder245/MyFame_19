import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export const ASPECT_RATIO = width / 360;
export const WIDTH = width;
export const HEIGHT = height;
export const FONT_SIZE = {
  s: 10 * ASPECT_RATIO,
  m: 16 * ASPECT_RATIO,
  l: 24 * ASPECT_RATIO,
  xl: 32 * ASPECT_RATIO,
  xxl: 48 * ASPECT_RATIO,
};

export const BORDER_RADIUS = {
  s: 4 * ASPECT_RATIO,
  m: 8 * ASPECT_RATIO,
  l: 30 * ASPECT_RATIO,
  xl: 32 * ASPECT_RATIO,
  xxl: 48 * ASPECT_RATIO,
};

export const SPACING = {
  s: 4 * ASPECT_RATIO,
  m: 16 * ASPECT_RATIO,
  lg: 18 * ASPECT_RATIO,
  xl: 32 * ASPECT_RATIO,
  xxl: 48 * ASPECT_RATIO,
};

export const FONT_FAMILY = {
  regular: "OpenSans-Regular",
};
