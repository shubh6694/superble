import React, { Component } from 'react';
import { Image, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Container, Header, Icon, Left, Body, Right, Content, Card, CardItem } from 'native-base';
import FABExample from '../fab/index.js'
import styles from './searchStyleCss';
import RobotItemforsearch from './robotItemforsearch';

const API = `https://api-staging.superble.com/api/v1/`;
const device_id ='Y2QzZjJjNjU5N2YxNzM=';
const token = 'bb6b2728-ceb4-4b19-b9ec-833b0e66a7d3';

class Search extends Component {

	static navigationOptions = ({ navigation }) => {
		return {
			header: null
		}
	};

	constructor(props){
		super(props);
		this.state={
			searchListArray : [],
			record: [],
			testClick: true,
			defValueOfInput: '',
			navigate: this.props.navigation.navigate,
			isDataAvailable: true,
		}
	}

	_deleteText = () => {
		this.setState({defValueOfInput: ''})
	}

	_getSearchList = (text) =>{

		let { searchListArray, defValueOfInput, isDataAvailable, testClick } = this.state;
		this.setState({defValueOfInput: text})
		searchListArray.length <= 0 ? this.setState({isDataAvailable: false}) : this.setState({isDataAvailable: true})
		
		fetch(API+"search/auto_suggest?text="+text,{
			method:'GET',
			headers:{
				'Authorization': 'Token token=bb6b2728-ceb4-4b19-b9ec-833b0e66a7d3;device_id=Y2QzZjJjNjU5N2YxNzM=',
				'Content-Type': 'application/json'
			}
		}).then((responce)=> responce.json()).then((resData)=>{
			resData.suggestions.length <= 0 ? this.setState({isDataAvailable: false}) : this.setState({isDataAvailable: true})
			this.setState({searchListArray: resData.suggestions}) 
			this.setState({testClick: true});
		} )
	}

	_callProductsonTouch = () =>{
		fetch(API+"/search?categories=all&page=1&per_page=5&source=product")
		.then((responeForAllProduct)=> responeForAllProduct.json())
		.then((responceData)=>{
			this.setState({record: responceData.results})
			this.setState({testClick: false})
		})
	}

	_renderRobotItem = () =>{
		let { record } = this.state;
		let count = 3;
		return record.map((i, x)=>{
			return( <RobotItemforsearch record={i} navigate={this.state.navigate} isLoggedIn={true} count={count} /> );
		});
	}

	render() {
		let { searchListArray, testClick, record, defValueOfInput, isDataAvailable } = this.state;
		return (  
			<Container>
				<Header style={{backgroundColor:'#fff'}}>
					<Left style={{width: '10%',marginLeft:15}} >
						<TouchableOpacity onPress={()=> this.props.navigation.goBack()} >
							<Icon name="ios-arrow-round-back-outline" />
						</TouchableOpacity>
					</Left>
					<View style={{width: '70%'}}>
				
						<TextInput
							style={{width:'100%',marginTop:10,}}
							placeholder='Search'
							value= {defValueOfInput}
							onChangeText={(text)=> this._getSearchList(text)}
						/>
					
					</View>
					

					<Right style={{width: '20%',marginRight:15}}>
						<Icon name="ios-close-outline" 
							onPress={()=> this._deleteText()}
						/>
					</Right>
				</Header>
				
				{testClick == true &&
					<Content>
						<Card>
						{isDataAvailable == true &&
						 <FlatList
							data={searchListArray}
							keyExtractor={(item, index) => index}
							renderItem={({item}) =>
							<CardItem>
								<Left style={{width: '10%'}} ><Icon name="ios-search" /></Left>
								<TouchableOpacity style={{width: '80%'}} onPress={()=> this._callProductsonTouch()} > 
								<Body style={{textAlign:'left'}}>									
										<Text > {item.text} </Text>									
								</Body>
								</TouchableOpacity>
								
								<Right style={{width: '10%'}}><Icon name="md-arrow-round-up" /></Right>							
							</CardItem>
							}
						/>
						}

						{isDataAvailable == false &&
							<CardItem style={{flexDirection:'column'}}>
								<Text>No product found :( </Text>
								<Text> Upload it yourself and win points! </Text>
							</CardItem>
						}

						</Card>
					</Content>
				}

				{testClick == false &&
				<Content scrollEventThrottle={3000} removeClippedSubviews={true}>
					{ this._renderRobotItem()}      
				</Content>
				}
				
				<FABExample navigator={this.props.navigation} />
			</Container>
		);
	}
};

export default Search;