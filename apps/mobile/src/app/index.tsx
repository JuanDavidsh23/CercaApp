import { Redirect } from "expo-router";

/**
 * Root index — redirects to the search screen by default.
 * In Phase 3, this will check auth state and redirect accordingly.
 */
export default function RootIndex() {
  return <Redirect href="/(app)/search" />;
}
