import NetInfo, { useNetInfo } from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const state = useNetInfo();

  return {
    isConnected: state.isConnected !== false,
    isInternetReachable: state.isInternetReachable !== false,
  };
}

export async function getNetworkStatus() {
  const state = await NetInfo.fetch();

  return {
    isConnected: state.isConnected !== false,
    isInternetReachable: state.isInternetReachable !== false,
  };
}
