import { getAccountName, getEAccountStr, timeAgo } from "@daimo/common";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Recipient, useRecipientSearch } from "../../../sync/recipients";
import { AccountBubble } from "../../shared/AccountBubble";
import { ButtonMed } from "../../shared/Button";
import { InputBig } from "../../shared/InputBig";
import Spacer from "../../shared/Spacer";
import { ErrorRowCentered } from "../../shared/error";
import { useNav } from "../../shared/nav";
import { color, touchHighlightUnderlay } from "../../shared/style";
import { TextBody, TextCenter, TextLight } from "../../shared/text";

/** Find someone you've already paid, a Daimo user by name, or any Ethereum account by ENS. */
export function SearchTab() {
  const [prefix, setPrefix] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <InputBig autoFocus icon="search" value={prefix} onChange={setPrefix} />
        <Spacer h={24} />
        <SearchResults prefix={prefix} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export function SearchResults({ prefix }: { prefix: string }) {
  const res = useRecipientSearch(prefix.trim().toLowerCase());

  const recentsOnly = prefix === "";

  return (
    <ScrollView contentContainerStyle={styles.vertSearch} bounces={false}>
      {res.error && <ErrorRowCentered error={res.error} />}
      {res.recipients.length > 0 && (
        <View style={styles.resultsHeader}>
          <TextLight>
            {recentsOnly ? "Recent recipients" : "Search results"}
          </TextLight>
        </View>
      )}
      {res.recipients.map((r) => (
        <RecipientRow key={r.addr} recipient={r} />
      ))}
      {res.recipients.length === 0 && <NoSearchResults />}
    </ScrollView>
  );
}

function NoSearchResults() {
  const nav = useNav();
  const sendPaymentLink = () =>
    nav.navigate("SendTab", { screen: "Send", params: { sendNote: true } });

  return (
    <View>
      <Spacer h={16} />
      <TextCenter>
        <TextLight>No results</TextLight>
      </TextCenter>
      <Spacer h={32} />
      <ButtonMed
        type="subtle"
        title="SEND PAYMENT LINK INSTEAD"
        onPress={sendPaymentLink}
      />
    </View>
  );
}

function RecipientRow({ recipient }: { recipient: Recipient }) {
  const eAccStr = getEAccountStr(recipient);
  const nav = useNav();
  const payAccount = useCallback(
    () =>
      nav.navigate("SendTab", {
        screen: "Send",
        params: { recipient },
      }),
    [eAccStr]
  );

  const name = getAccountName(recipient);
  const nowS = Date.now() / 1e3;
  const lastSendStr =
    recipient.lastSendTime &&
    `Sent ${timeAgo(recipient.lastSendTime, nowS, true)}`;

  return (
    <View style={styles.resultBorder}>
      <TouchableHighlight
        onPress={payAccount}
        {...touchHighlightUnderlay.subtle}
        style={styles.resultRowWrap}
      >
        <View style={styles.resultRow}>
          <View style={styles.resultAccount}>
            <AccountBubble eAcc={recipient} size={36} />
            <TextBody>{name}</TextBody>
          </View>
          <TextLight>{lastSendStr}</TextLight>
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  vertSearch: {
    flexDirection: "column",
    alignSelf: "stretch",
  },
  resultsHeader: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 2,
  },
  resultBorder: {
    borderTopWidth: 1,
    borderColor: color.grayLight,
  },
  resultRowWrap: {
    marginHorizontal: -24,
  },
  resultRow: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultAccount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
