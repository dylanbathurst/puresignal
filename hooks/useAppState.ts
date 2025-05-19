import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppState = () => {
  const appState = useRef(AppState.currentState);
  const [stateValue, setStateValue] = useState<AppStateStatus>("active");

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setStateValue("active");
      } else {
        setStateValue("background");
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return stateValue;
};

export default useAppState;
