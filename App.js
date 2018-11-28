import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';

import Account from './src/screens/account/index';
import Home from './src/screens/home/index';
import Product from './src/screens/product/index';
import Article from './src/screens/article/index';
import Test from './src/screens/account/test';
import FABExample from './src/screens/fab/index.js'
import Chat from './src/screens/chat/index.js'
import Search from './src/screens/search/index.js'
import { Root, Fab } from "native-base";
import Settings from './src/screens/settings/index.js';
import Terms from './src/screens/terms/index.js';
import Notifications from './src/screens/notifications/index.js';
import Mybadges from './src/screens/mybadges/index.js';
import SideMenu from './src/screens/Sidemenu/index.js';


const deviceWidth  = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const headerHeight = (deviceWidth >= 375 ? 55 : 48 );

const ElementsDesign = StackNavigator(
{
    Home: {
        screen: Home,    
    },
    Account: {
        screen: Account
    },
    Product: {
        screen: Product
    },
    Article:{
        screen: Article
    },
    Chat:{
        screen: Chat
    },
    Search:{
         screen: Search
    },
    Settings:{
        screen: Settings
    },
    Terms:{
        screen: Terms
    },
    Notifications: {
        screen: Notifications
    },
    Mybadges: {
        screen: Mybadges
    },
    Test: {
        screen: Test
    }
}
);

const MyDrawerNavigator = DrawerNavigator({
    ElementsDesign: { 
      screen: ElementsDesign,
    }
  },{      
    contentComponent: SideMenu,
    drawerWidth: 300,
});
  
  const AppNavigator = StackNavigator({
    Drawer: { screen: MyDrawerNavigator },
  }, {
    headerMode: 'none',
  });

export default () =>
  <Root>
    <AppNavigator />
  </Root>;

