import SafeScreen from "../components/SafeScreen";
import {ClerkProvider } from "@clerk/clerk-expo";
// import {tokenCache} from "@clerk/clerk-expo/tokenCache";
import { Slot } from "expo-router";

export default function RootLayout() {
  return( 
  <ClerkProvider >
  <SafeScreen>
      <Slot />
  </SafeScreen>
    </ClerkProvider>
  );
}
