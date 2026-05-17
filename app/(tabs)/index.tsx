import { Href, Redirect } from "expo-router";

export default function IndexTabRedirect() {
  return <Redirect href={"/(tabs)/home" as Href} />;
}
