import React from 'react';
import {Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, View, ScrollView, Picker, FlatList, Linking, Animated, Share, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, H1, H3, H2, Item, Input, Thumbnail, Label, Content, Card, CardItem, Toast, Spinner, CheckBox } from 'native-base'; import GridView from "react-native-super-grid";
import { Col, Row, Grid } from 'react-native-easy-grid';
import {DrawerNavigator, addNavigationHelpers, StackNavigator} from 'react-navigation';
import styles from './productStyle';


const { width } = Dimensions.get('window');
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;



class CommentComponent extends React.Component {

	scrollX = new Animated.Value(0);

	constructor(props) {
		super(props);
	    this.state = {
	    	likedHeart: false
        };
	}

    componentDidMount() {
	

	}

	
	render() {
		
        return (
        		<Container>
        			<Text>Hello</Text>
        		</Container>
        	);
	}

}
