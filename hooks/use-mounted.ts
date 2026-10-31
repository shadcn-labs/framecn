import { useSyncExternalStore } from "react";

// Hydration changes the snapshot; there are no later store updates to subscribe to.
const subscribe = () => () => {
  // The client snapshot is constant, so no subscription needs cleaning up.
};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useMounted = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
