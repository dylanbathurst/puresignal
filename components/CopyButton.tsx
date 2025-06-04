import { Colors } from "@/constants/Colors";
import { Copy, CopyCheck } from "lucide-react-native";
import { FC, useCallback, useState } from "react";
import { useColorScheme, View } from "react-native";
import { ThemedText } from "./ThemedText";
import * as Clipboard from "expo-clipboard";
import PressableOpacity from "./PressableOpacity";

const CopyButton: FC<{ textToCopy: string; confirmText?: boolean }> = ({
  confirmText = true,
  textToCopy,
}) => {
  const [copied, setCopied] = useState(false);
  const theme = useColorScheme() ?? "light";

  const copyToClipboard = useCallback(async () => {
    if (!textToCopy) return;
    await Clipboard.setStringAsync(textToCopy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [textToCopy]);

  return (
    <PressableOpacity onPress={copyToClipboard}>
      {copied ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <CopyCheck size={15} color={Colors[theme].link} />
          {confirmText && (
            <ThemedText style={{ fontSize: 10, color: Colors[theme].link }}>
              Copied
            </ThemedText>
          )}
        </View>
      ) : (
        <Copy size={15} color={Colors[theme].tint} />
      )}
    </PressableOpacity>
  );
};

export default CopyButton;
