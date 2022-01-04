import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {HeaderTitle} from '../../components/styled/Text';
import {
  baseNavigatorOptions,
  baseScreenOptions,
} from '../../constants/NavigationOptions';
import {StyleProp, TextStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import WalletConnectIntro from './screens/WalletConnectIntro';
import WalletConnectIcon from '../../../assets/img/wallet-connect/wallet-connect-icon.svg';
import WalletConnectStart from './screens/WalletConnectStart';
import WalletConnectHome from './screens/WalletConnectHome';
import WalletConnectConnections from './screens/WalletConnectConnections';
import WalletConnectRequestDetails from './screens/WalletConnectRequestDetails';

export type WalletConnectStackParamList = {
  Root: undefined;
  WalletConnectStart: undefined;
  WalletConnectConnections: undefined;
  WalletConnectHome: undefined;
  WalletConnectRequestDetails: undefined;
};

export enum WalletConnectScreens {
  ROOT = 'Root',
  WC_START = 'WalletConnectStart',
  WC_CONNECTIONS = 'WalletConnectConnections',
  WC_HOME = 'WalletConnectHome',
  WC_REQUEST_DETAILS = 'WalletConnectRequestDetails',
}

const WalletConnect = createStackNavigator<WalletConnectStackParamList>();

const WalletConnectStack = () => {
  const theme = useTheme();
  const textStyle: StyleProp<TextStyle> = {color: theme.colors.text};
  return (
    <WalletConnect.Navigator
      initialRouteName={WalletConnectScreens.ROOT}
      screenOptions={{
        ...baseNavigatorOptions,
        ...baseScreenOptions,
      }}>
      <WalletConnect.Screen
        name={WalletConnectScreens.ROOT}
        component={WalletConnectIntro}
        options={{
          headerTitle: () => (
            <HeaderTitle style={textStyle}>
              <WalletConnectIcon /> WalletConnect
            </HeaderTitle>
          ),
        }}
      />
      <WalletConnect.Screen
        name={WalletConnectScreens.WC_START}
        component={WalletConnectStart}
        options={{
          headerTitle: () => (
            <HeaderTitle style={textStyle}>
              <WalletConnectIcon /> WalletConnect
            </HeaderTitle>
          ),
        }}
      />
      <WalletConnect.Screen
        name={WalletConnectScreens.WC_CONNECTIONS}
        component={WalletConnectConnections}
        options={{
          headerTitle: () => (
            <HeaderTitle style={textStyle}>
              <WalletConnectIcon /> WalletConnect
            </HeaderTitle>
          ),
        }}
      />
      <WalletConnect.Screen
        name={WalletConnectScreens.WC_HOME}
        component={WalletConnectHome}
        options={{
          headerTitle: () => (
            <HeaderTitle style={textStyle}>
              <WalletConnectIcon /> WalletConnect
            </HeaderTitle>
          ),
        }}
      />
      <WalletConnect.Screen
        name={WalletConnectScreens.WC_REQUEST_DETAILS}
        component={WalletConnectRequestDetails}
        options={{
          headerTitle: () => (
            <HeaderTitle style={textStyle}>
              <WalletConnectIcon /> WalletConnect
            </HeaderTitle>
          ),
        }}
      />
    </WalletConnect.Navigator>
  );
};

export default WalletConnectStack;
