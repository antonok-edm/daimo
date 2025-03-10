import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { useNav } from "../../../common/nav";
import { ScreenHeader } from "../../shared/ScreenHeader";
import { SearchScreen } from "../../shared/SearchScreen";
import Spacer from "../../shared/Spacer";
import { ss } from "../../shared/style";

export function ReceiveNavScreen() {
  // Search prefix
  // Clear prefix on back button
  const [prefix, setPrefix] = useState("");

  // Navigation
  const nav = useNav();
  const goBack = useCallback(() => {
    setPrefix("");
    nav.goBack();
  }, [nav]);

  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const unsubscribe = nav.addListener("transitionEnd", () => {
      // Set focus on transitionEnd to avoid stack navigator looking
      // glitchy on iOS.
      textInputRef.current?.focus();
    });

    return unsubscribe;
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={ss.container.screen}>
        <ScreenHeader title="Request" onBack={goBack} />
        <Spacer h={8} />
        <View style={{ flex: 1, flexDirection: "column" }}>
          <SearchScreen
            {...{ prefix, setPrefix, textInputRef }}
            mode="receive"
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
