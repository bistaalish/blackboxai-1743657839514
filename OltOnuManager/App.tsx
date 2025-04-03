import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </PaperProvider>
  );
};

export default App;
