import { StyleProp, ViewStyle } from "react-native";
import { Svg, Path } from "react-native-svg";

import { color as baseColor } from "../shared/style";

const icons = {
  "bell-01": (
    <Path d="M9.354 21c.705.622 1.632 1 2.646 1s1.94-.378 2.646-1M18 8A6 6 0 1 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.089 1.936.015.182.054.252.2.36.133.099.732.099 1.928.099H18.61c1.196 0 1.795 0 1.927-.098.147-.11.186-.179.2-.361.014-.165-.353-.755-1.088-1.936C18.78 13.206 18 11.09 18 8Z" />
  ),
  list: (
    <Path d="M21 12H9m12-6H9m12 12H9m-4-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm0 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
  ),
  "mail-01": (
    <Path d="m2 7 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L22 7M6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20Z" />
  ),
  "plus-circle": (
    <Path d="M12 8v8m-4-4h8m6 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
  ),
  "qr-code-01": (
    <Path d="M7 12h5v5m-8.99-5H3m5.01 5H8m4.01 4H12m9.01-9H21M3 17h1.5m11-5h2M3 21h5m4-19v6m5.6 13h1.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C21 20.24 21 19.96 21 19.4v-1.8c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C20.24 16 19.96 16 19.4 16h-1.8c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C16 16.76 16 17.04 16 17.6v1.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C16.76 21 17.04 21 17.6 21Zm0-13h1.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C21 7.24 21 6.96 21 6.4V4.6c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C20.24 3 19.96 3 19.4 3h-1.8c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C16 3.76 16 4.04 16 4.6v1.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C16.76 8 17.04 8 17.6 8Zm-13 0h1.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C8 7.24 8 6.96 8 6.4V4.6c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C7.24 3 6.96 3 6.4 3H4.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C3 3.76 3 4.04 3 4.6v1.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C3.76 8 4.04 8 4.6 8Z" />
  ),
  "send-03": (
    <Path d="M10.5 12H5m-.084.291L2.58 19.267c-.184.548-.275.822-.21.99a.5.5 0 0 0 .332.3c.174.05.438-.07.965-.306l16.711-7.52c.515-.232.772-.348.851-.508a.5.5 0 0 0 0-.444c-.08-.16-.336-.276-.85-.508L3.661 3.748c-.525-.237-.788-.355-.962-.306a.5.5 0 0 0-.332.299c-.066.168.025.442.206.988l2.342 7.057c.032.094.047.14.053.188a.5.5 0 0 1 0 .129c-.006.048-.022.095-.053.188Z" />
  ),
} as const;

export function Icon({
  name,
  size,
  color,
  style,
}: {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? baseColor.midnight}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {icons[name]}
    </Svg>
  );
}
