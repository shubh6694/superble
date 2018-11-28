import React from 'react';
import {DrawerNavigator, addNavigationHelpers, StackNavigator} from 'react-navigation';
import SideMenu from '../Sidemenu';
import Home from './home';

export default DrawerNavigator({
    Home: {
      screen: Home,
    }
      },{
      contentComponent: SideMenu,
      drawerWidth: 300,
      header: 'none',
  });
  