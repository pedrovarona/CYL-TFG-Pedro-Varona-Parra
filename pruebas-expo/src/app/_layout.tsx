import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WardrobeProvider } from '@/wardrobe/store';
import { AppShell } from '@/wardrobe/shell';

export default function RootLayout() {
  return <SafeAreaProvider><WardrobeProvider><StatusBar style="dark" /><AppShell><Slot /></AppShell></WardrobeProvider></SafeAreaProvider>;
}
