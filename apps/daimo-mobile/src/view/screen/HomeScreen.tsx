import Octicons from "@expo/vector-icons/Octicons";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchResults } from "./send/SearchTab";
import { useWarmCache } from "../../action/useSendAsync";
import { Account, useAccount } from "../../model/account";
import { SwipeUpDown } from "../../vendor/SwipeUpDown";
import { TitleAmount } from "../shared/Amount";
import { HistoryListSwipe } from "../shared/HistoryList";
import { OctName } from "../shared/InputBig";
import { SearchHeader } from "../shared/SearchHeader";
import Spacer from "../shared/Spacer";
import { useNav } from "../shared/nav";
import { color, ss, touchHighlightUnderlay } from "../shared/style";
import { TextBody, TextLight } from "../shared/text";

export default function HomeScreen() {
  const [account] = useAccount();
  console.log(
    `[HOME] rendering ${account?.name}, ${account?.recentTransfers?.length} ops`
  );

  const keySlot = account?.accountKeys.find(
    (keyData) => keyData.pubKey === account?.enclavePubKey
  )?.slot;
  useWarmCache(account?.enclaveKeyName, account?.address, keySlot);

  const nav = useNav();
  const [isHistOpen, setIsHistOpen] = useState(false);
  const setIsHistoryOpened = useCallback((isOpened: boolean) => {
    setIsHistOpen(isOpened);
    nav.setOptions({ title: isOpened ? "History" : "Home" });
  }, []);

  const [searchPrefix, setSearchPrefix] = useState<string | undefined>();

  if (account == null) return null;

  const histList = (
    <HistoryListSwipe
      account={account}
      maxToShow={isHistOpen ? undefined : 5}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={ss.container.screen}>
        <SearchHeader prefix={searchPrefix} setPrefix={setSearchPrefix} />
        {searchPrefix != null && <SearchResults prefix={searchPrefix} />}
        {searchPrefix == null && (
          <>
            <Spacer h={64} />
            <AmountAndButtons account={account} />
            <SwipeUpDown
              itemMini={histList}
              itemFull={histList}
              onShowMini={() => setIsHistoryOpened(false)}
              onShowFull={() => setIsHistoryOpened(true)}
              swipeHeight={screenDimensions.height / 3}
            />
          </>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

function AmountAndButtons({ account }: { account: Account }) {
  const nav = useNav();
  const goSend = useCallback(
    () => nav.navigate("SendTab", { screen: "Send", params: {} }),
    [nav]
  );
  const goRequest = useCallback(
    () => nav.navigate("ReceiveTab", { screen: "Receive" }),
    [nav]
  );
  const goDeposit = useCallback(() => nav.navigate("DepositTab"), [nav]);

  const isEmpty = account.lastBalance === 0n;

  return (
    <View style={styles.amountAndButtons}>
      <TextLight>Your balance</TextLight>
      <TitleAmount amount={account.lastBalance} />
      <Spacer h={16} />
      <View style={styles.buttonRow}>
        <IconButton title="Deposit" onPress={goDeposit} />
        <IconButton title="Receive" onPress={goRequest} />
        <IconButton title="Send" onPress={goSend} disabled={isEmpty} />
      </View>
    </View>
  );
}

function IconButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const name: OctName = (function () {
    switch (title) {
      case "Deposit":
        return "plus";
      case "Receive":
        return "download";
      case "Send":
        return "paper-airplane";
      default:
        return "question";
    }
  })();

  return (
    <View style={styles.iconButtonWrap}>
      <TouchableHighlight
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        style={disabled ? styles.iconButtonDisabled : styles.iconButton}
        hitSlop={16}
        {...touchHighlightUnderlay.primary}
      >
        <Octicons name={name} size={24} color={color.white} />
      </TouchableHighlight>
      <Spacer h={8} />
      <View style={disabled ? styles.iconLabelDisabled : styles.iconLabel}>
        <TextBody>{title}</TextBody>
      </View>
    </View>
  );
}

const screenDimensions = Dimensions.get("screen");

const iconButton = {
  backgroundColor: color.primary,
  height: 64,
  width: 64,
  borderRadius: 64,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
} as const;

const iconLabel = {
  alignSelf: "stretch",
  flexDirection: "row",
  justifyContent: "center",
} as const;

const styles = StyleSheet.create({
  amountAndButtons: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  iconButtonWrap: {
    borderRadius: 16,
    padding: 16,
    width: 96,
  },
  iconButton,
  iconButtonDisabled: {
    ...iconButton,
    opacity: 0.5,
  },
  iconLabel,
  iconLabelDisabled: {
    ...iconLabel,
    opacity: 0.5,
  },
});
