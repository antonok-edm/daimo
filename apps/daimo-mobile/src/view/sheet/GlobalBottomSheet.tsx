import { DaimoRequestV2Status } from "@daimo/common";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import RNShake from "react-native-shake";

import { DebugBottomSheet } from "./DebugBottomSheet";
import { FarcasterBottomSheet } from "./FarcasterBottomSheet";
import { HelpBottomSheet } from "./HelpBottomSheet";
import { OnboardingChecklistBottomSheet } from "./OnboardingChecklistBottomSheet";
import { OwnRequestBottomSheet } from "./OwnRequestBottomSheet";
import { Action, DispatcherContext } from "../../action/dispatch";
import ScrollPellet from "../shared/ScrollPellet";

const bottomSheetSettings = {
  debug: {
    enableSwipeClose: true,
  },
  connectFarcaster: {
    enableSwipeClose: true,
  },
  linkFarcaster: {
    enableSwipeClose: false,
  },
  onboardingChecklist: {
    enableSwipeClose: true,
  },
  helpModal: {
    enableSwipeClose: true,
  },
  ownRequest: {
    enableSwipeClose: true,
  },
} as const;

type DisplayedSheet =
  | null
  | {
      // Any key above, except helpModal and ownRequest
      action:
        | "debug"
        | "connectFarcaster"
        | "linkFarcaster"
        | "onboardingChecklist";
    }
  | {
      action: "helpModal";
      payload: { title: string; content: ReactElement };
    }
  | {
      action: "ownRequest";
      payload: { reqStatus: DaimoRequestV2Status };
    };

// Shows the main, global bottom sheet. This ensures that only a single of
// these sheets is visible at a time. The global sheet appears above any screen
// -specific sheets like the transaction detail sheet.
export function GlobalBottomSheet() {
  // Global bottom sheet
  const sheetRef = useRef<BottomSheet>(null);
  const [sheet, setSheet] = useState<DisplayedSheet>(null);

  const openBottomSheet = (sheet: DisplayedSheet) => {
    Keyboard.dismiss();
    setSheet(sheet);
  };

  // Global shake gesture > open Send Debug Log sheet
  useEffect(() => {
    const subscription = RNShake.addListener(() =>
      openBottomSheet({ action: "debug" })
    );
    return () => subscription.remove();
  }, []);

  // Open bottom sheet when requested
  useEffect(() => {
    console.log(`[APP] new bottomSheet=${sheet?.action}`);
    if (sheet) sheetRef.current?.expand();
    else sheetRef.current?.close();
  }, [sheet]);

  // Close bottom sheet when user swipes it away
  const onChangeIndex = useCallback((index: number) => {
    if (index < 0) setSheet(null);
  }, []);

  const onClose = useCallback(() => {
    setSheet(null);
  }, []);

  // Dark backdrop for bottom sheet
  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-0.9}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  // Handle dispatch > open or close bottom sheet
  const dispatcher = useContext(DispatcherContext);
  const handleDispatch = (action: Action) => {
    switch (action.name) {
      case "connectFarcaster": {
        openBottomSheet({ action: "connectFarcaster" });
        break;
      }
      case "linkFarcaster": {
        openBottomSheet({ action: "linkFarcaster" });
        break;
      }
      case "onboardingChecklist": {
        openBottomSheet({ action: "onboardingChecklist" });
        break;
      }
      case "ownRequest": {
        const { reqStatus } = action;
        openBottomSheet({ action: "ownRequest", payload: { reqStatus } });
        break;
      }
      case "helpModal": {
        const { title, content } = action;
        openBottomSheet({ action: "helpModal", payload: { title, content } });
        break;
      }
      case "hideBottomSheet": {
        setSheet(null);
        break;
      }
      default: {
        throw new Error(`Unknown action: ${JSON.stringify(action)}`);
      }
    }
  };

  useEffect(() => {
    dispatcher.register("connectFarcaster", handleDispatch);
    dispatcher.register("linkFarcaster", handleDispatch);
    dispatcher.register("onboardingChecklist", handleDispatch);
    dispatcher.register("ownRequest", handleDispatch);
    dispatcher.register("helpModal", handleDispatch);
    dispatcher.register("hideBottomSheet", handleDispatch);
  }, []);

  console.log(`[APP] rendering bottomSheet=${sheet?.action}`);
  const settings = sheet && bottomSheetSettings[sheet.action];

  return (
    <View
      style={styles.bottomSheetWrapper}
      pointerEvents={sheet != null ? "auto" : "none"}
    >
      <BottomSheet
        handleComponent={ScrollPellet}
        backdropComponent={renderBackdrop}
        ref={sheetRef}
        snapPoints={[]}
        index={-1}
        onChange={onChangeIndex}
        onClose={onClose}
        enablePanDownToClose={settings?.enableSwipeClose}
        enableDynamicSizing
      >
        <BottomSheetView style={styles.bottomSheetView}>
          {sheet?.action === "debug" && <DebugBottomSheet />}
          {(sheet?.action === "connectFarcaster" ||
            sheet?.action === "linkFarcaster") && <FarcasterBottomSheet />}
          {sheet?.action === "onboardingChecklist" && (
            <OnboardingChecklistBottomSheet />
          )}
          {sheet?.action === "helpModal" && (
            <HelpBottomSheet
              content={sheet.payload.content}
              title={sheet.payload.title}
              onPress={() => sheetRef.current?.close()}
            />
          )}
          {sheet?.action === "ownRequest" && (
            <OwnRequestBottomSheet reqStatus={sheet.payload.reqStatus} />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSheetWrapper: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  bottomSheetView: {
    flex: 0,
    minHeight: 128,
  },
});
