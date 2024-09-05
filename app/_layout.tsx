// app/_layout.tsx ~ Header

import '~/global.css';

import { Toaster } from 'react-hot-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { Text } from '~/components/ui/text';
import NavigationMenuComponent from '~/app/custom-components/NavigationMenuComponent'; 

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            headerLeft: () => <NavigationMenuComponent />, 
            headerTitle: '', 
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                <Text style={{ marginRight: 10 }}>Camunda Dispute CMS</Text>
                <ThemeToggle />
              </View>
            ), 
          }}
        />
        <Stack.Screen
            name='test-component'
            options={{
              headerTitle: 'Test Component',
            }}
        />
      </Stack>
      <PortalHost />
      <Toaster 
        position="bottom-right" // Position the toast at the bottom-right
        toastOptions={{
          style: {
            background: isDarkColorScheme ? '#0a0b0b' : '#fafafa', // Adjust background based on theme
            color: isDarkColorScheme ? '#fafafa' : '#0a0b0b', // Adjust text color based on theme
            border: '1px solid', // Add a border to match your UI style
            borderColor: isDarkColorScheme ? '#27272a' : '#27272a', // Border color based on theme
            borderRadius: '8px', // Add rounded corners
            padding: '16px', // Add padding for better spacing
            boxShadow: isDarkColorScheme ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
            maxWidth: '300px',  // Increase the max width
            maxHeight: '200px', // Set a max height for taller toasts
            wordWrap: 'break-word', // Ensure text wraps within the toast
            overflowY: 'auto', // Prevent content from overflowing
          },
        }}
      />
    </ThemeProvider>
  );
}