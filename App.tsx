
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ThemeProvider } from './src/contexts/ThemeContext';
import GameStateProvider from './src/hooks/useGameStateNative';
import MobileTerminalNative from './src/components/MobileTerminalNative';
import NetworkMapNative from './src/components/NetworkMapNative';
import FileSystemNative from './src/components/FileSystemNative';
import MissionsNative from './src/components/MissionsNative';
import { cyberpunkTheme } from './src/styles/cyberpunkTheme';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <PaperProvider theme={cyberpunkTheme}>
      <ThemeProvider>
        <GameStateProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#000000" />
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                      case 'Terminal':
                        iconName = 'console';
                        break;
                      case 'Network':
                        iconName = 'lan';
                        break;
                      case 'Files':
                        iconName = 'folder';
                        break;
                      case 'Missions':
                        iconName = 'target';
                        break;
                      default:
                        iconName = 'help';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#00ff41',
                  tabBarInactiveTintColor: '#00ff4150',
                  tabBarStyle: {
                    backgroundColor: '#000000',
                    borderTopColor: '#00ff41',
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                  },
                  headerStyle: {
                    backgroundColor: '#000000',
                    borderBottomColor: '#00ff41',
                    borderBottomWidth: 1,
                  },
                  headerTintColor: '#00ff41',
                  headerTitleStyle: {
                    fontFamily: 'monospace',
                    fontSize: 18,
                    fontWeight: 'bold',
                  },
                })}
              >
                <Tab.Screen 
                  name="Terminal" 
                  component={MobileTerminalNative}
                  options={{ title: 'HACKNET TERMINAL' }}
                />
                <Tab.Screen 
                  name="Network" 
                  component={NetworkMapNative}
                  options={{ title: 'NETWORK MAP' }}
                />
                <Tab.Screen 
                  name="Files" 
                  component={FileSystemNative}
                  options={{ title: 'FILE SYSTEM' }}
                />
                <Tab.Screen 
                  name="Missions" 
                  component={MissionsNative}
                  options={{ title: 'MISSIONS' }}
                />
              </Tab.Navigator>
            </View>
          </NavigationContainer>
        </GameStateProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}

export default App;
