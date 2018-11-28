import React from 'react';
import {View, Text, WebView} from 'react-native';
import { Icon } from 'native-base';
 
export default class Terms extends React.Component {

    static navigationOptions = {
        title: 'Terms',
    };

    
	render() {
        return (
	    	<WebView
                source={{uri: 'https://superble.com/terms'}}
            />
		);
	}

}
