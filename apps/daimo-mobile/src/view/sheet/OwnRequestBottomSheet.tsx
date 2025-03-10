import { chainConfig } from "@daimo/api/src/env";
import {
  DaimoRequestState,
  DaimoRequestV2Status,
  decodeRequestIdString,
  dollarsToAmount,
  now,
} from "@daimo/common";
import { DaimoNonce, DaimoNonceMetadata, DaimoNonceType } from "@daimo/userop";
import { useContext, useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

import { DispatcherContext } from "../../action/dispatch";
import { useSendAsync } from "../../action/useSendAsync";
import { useNav } from "../../common/nav";
import { useAccount } from "../../logic/accountManager";
import { AccountRow } from "../shared/AccountRow";
import { TitleAmount } from "../shared/Amount";
import { ButtonMed } from "../shared/Button";
import { ScreenHeader } from "../shared/ScreenHeader";
import Spacer from "../shared/Spacer";
import { color, ss } from "../shared/style";
import { TextBodyCaps, TextCenter } from "../shared/text";

// Bottom sheet for request made by the user
export function OwnRequestBottomSheet({
  reqStatus,
}: {
  reqStatus: DaimoRequestV2Status;
}) {
  const [account] = useAccount();
  const nav = useNav();
  const dispatcher = useContext(DispatcherContext);

  // Generate nonce
  const nonce = useMemo(
    () =>
      new DaimoNonce(new DaimoNonceMetadata(DaimoNonceType.RequestResponse)),
    []
  );

  const { status, exec: onCancel } = useSendAsync({
    dollarsToSend: 0,
    sendFn: async (opSender) => {
      console.log(
        `[ACTION] cancelling request ${reqStatus.link.id.toString()}`
      );
      return opSender.cancelRequest(decodeRequestIdString(reqStatus.link.id), {
        nonce,
        chainGasConstants: account!.chainGasConstants,
      });
    },
    accountTransform: (acc) => {
      const updatedRequest = {
        ...reqStatus,
        status: DaimoRequestState.Cancelled,
        updatedAt: now(),
      };
      return {
        ...acc,
        notificationRequestStatuses: acc.notificationRequestStatuses // Replace old request with updated one
          .filter((req) => req.link.id !== reqStatus.link.id)
          .concat([updatedRequest]),
      };
    },
  });

  useEffect(() => {
    if (status === "success") {
      dispatcher.dispatch({ name: "hideBottomSheet" });
      nav.navigate("HomeTab", { screen: "Home" });
    }
  }, [status]);

  if (!account) return null;

  const coinName = chainConfig.tokenSymbol.toUpperCase();
  const chainName = chainConfig.chainL2.name.toUpperCase();
  return (
    <View style={ss.container.padH16}>
      <ScreenHeader
        title="You requested"
        onExit={() => {
          dispatcher.dispatch({ name: "hideBottomSheet" });
        }}
        hideOfflineHeader
      />
      <TitleAmount amount={dollarsToAmount(reqStatus.link.dollars)} />
      <Spacer h={8} />
      <TextCenter>
        <TextBodyCaps color={color.grayMid}>
          {coinName} • {chainName}
        </TextBodyCaps>
      </TextCenter>
      <Spacer h={32} />
      {reqStatus.expectedFulfiller && (
        <AccountRow
          acc={reqStatus.expectedFulfiller}
          timestamp={reqStatus.createdAt}
          viewAccount={undefined}
        />
      )}
      <Spacer h={32} />
      {status === "idle" && (
        <ButtonMed title="CANCEL REQUEST" onPress={onCancel} type="subtle" />
      )}
      {status === "loading" && <ActivityIndicator size="large" />}
      <Spacer h={48} />
    </View>
  );
}
