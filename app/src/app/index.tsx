import { Redirect } from "expo-router";

export default function Index() {
    // For now, redirect to welcome screen as default
    // In a real app, you'd check authentication status here
    return <Redirect href="/welcome" />;
}
