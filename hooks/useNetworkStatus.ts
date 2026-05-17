import { useNetInfo } from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const state = useNetInfo();

  return {
    isConnected: state.isConnected !== false,
    isInternetReachable: state.isInternetReachable !== false,
  };
}
