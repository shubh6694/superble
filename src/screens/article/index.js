import React from 'react';
import {Dimensions, 
		Image, 
		Modal, 
		StyleSheet, 
		Text, 
		TextInput, 
		TouchableWithoutFeedback, 
		TouchableHighlight, 
		TouchableOpacity, 
		View, 
		ScrollView, 
		Picker,
		FlatList,
		Linking,
		Animated,
		Share,
		AsyncStorage
	} from 'react-native';

import {
	Card,
	Left,
	Right,
	Fab,
	Icon,
	Button,
	Container,
	Content,
	Header
} from 'native-base';
import {
	DrawerNavigator,
	addNavigationHelpers,
	NavigationActions,
	StackNavigator,
	navigation
} from 'react-navigation';
import HTMLView from 'react-native-htmlview';
import { TabNavigator } from 'react-navigation';
import RobotItem from './robotItem';
import FABExample from '../fab/index.js'

const { width } = Dimensions.get('window');
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

let API= 'https://api-staging.superble.com/api/v1';
const _this = null;

class Article extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title:'',
			desc:'',
			descCss:'',
			tags:[],
			relatedArticles:[],
			active: 'false',
			datasetState: null,
			navigate: this.props.navigation.navigate,
			threedotsmodalVisible: false,
			ownerImg: null,
			ownerName: '',
		};
	}


	static navigationOptions = ({ navigation }) => {
		//alert(JSON.stringify(navigation))
		return {
			header: (
			    <Header>
			      <Left>
					<Button transparent onPress={ () => { navigation.dispatch(NavigationActions.back()) }}>
			          <Icon name="ios-arrow-round-back" style={{ color:"black"}}/>
			        </Button>
			      </Left>
			    
			      <Right>
			      	<Button 
			      	onPress={()=> _this.setModalVisibleForThreeDots(true)}
			      	transparent>
			          <Icon name="md-more" style={{ color:"black"}} />
			        </Button>
			       </Right>
			    </Header>
			 )
		}
	};

	setModalVisibleForThreeDots(visible) {
		this.setState({threedotsmodalVisible: visible});
	}
	componentDidMount(){
		//alert(1)
		const { params } = this.props.navigation.state;
		let articleID = params.item;
	
       _this = this;
       //alert(articleID)
 
		//fetch title and description
		fetch(`${API}/discoveries/${articleID}/products?page=1&per_page=999`,{
			method:'GET'
		})
		.then((res)=>res.json())
		.then(resData =>{
			//alert(resData.product_discovery.description);
			this.setState({title: resData.product_discovery.title})
			this.setState({desc: resData.product_discovery.description})
			this.setState({descCss: resData.product_discovery.descriptionCss})
			this.setState({tags: resData.product_discovery.tags})
			this.setState({ownerImg: resData.product_discovery.owner.image_url})
			this.setState({ownerName: resData.product_discovery.owner.first_name})
		})

		this.fetchRelatedArticles(articleID);
	}

	articleClick(event){
		this.props.navigation.navigate('Article',{ item: event });
	}

	shareFunction(){
		let content_share = {
		  message: 'Hello World',
		  title: 'How are you?'  
		};
		let options_share = {};
		Share.share(content_share, options_share);
	 }

	fetchRelatedArticles=(articleID)=>{
		fetch(`${API}/discoveries/${articleID}/related_articles`,{
			method:'GET'
		})
		.then((ress)=>ress.json())
		.then(resDataa =>{
			this.setState({relatedArticles: resDataa.data})
		})
	}

	

	render() {
		var imgUrl = 'https://forums.iboats.com/user/avatar?userid=503684&type=large';
		if(this.state.ownerImg != null){
			imgUrl = this.state.ownerImg;
		}
		
		return (
			<Container>

				<ScrollView style={{paddingHorizontal: 20, backgroundColor:'white'}} >
					
					<Text style={styles.title}>{this.state.title}</Text>  
					
					 <HTMLView
						value={this.state.desc}
						// stylesheet={this.state.descCss}
						// renderNode={renderNode}
					/>
					
					{this.state.tags.map((item)=>
						<View key={item} style={{flexDirection:'row'}}>
						<Text style={{color:'#40c4ff', paddingBottom:30, paddingLeft:15}}>{item}</Text>
						</View>
					)}
					
					<Card style={{paddingBottom:18, marginBottom:30}}>
						<View style={{flexDirection:'row', 
							justifyContent:'space-between',
							paddingVertical :20,
							paddingHorizontal:10}}>
							<Text> Related Articles </Text> 
							<Text style={{color: '#40c4ff'}}> View All </Text>
						</View>

					<FlatList
						data={this.state.relatedArticles}
						keyExtractor={(item, index) => index}
						renderItem={({item}) =>
							<Text style={{color: '#40c4ff',fontSize:15, paddingBottom:15, paddingHorizontal :10}}
      							onPress={() => this.articleClick(item.id)}>
  								{item.title}
							</Text>
						}
					/>
					</Card>
				</ScrollView>
				<Modal 
					// animationType="slide"
					transparent={true}
					visible={this.state.threedotsmodalVisible}
					onRequestClose={() => { alert('Modal has been closed.');
				}}>

					<TouchableWithoutFeedback onPress={()=> this.setModalVisibleForThreeDots(!this.state.threedotsmodalVisible)} >
						<View style={{height: deviceHeight, width:deviceWidth }}>
							<TouchableWithoutFeedback>
								<View style={styles.innerViewofModel}> 
									<View style={{flexDirection:'row',}}>
										<View style={styles.avatarWrap1}>					               												
				      								 <Image 
				      									style={styles.avatarWrap}
				      									resizeMode='cover'
				      									source={{uri : imgUrl}}
				      								/> 	
				      					</View>	
				      					<View style={{top:20,left:20}}><Text style={styles.authorNameText}>{this.state.ownerName}</Text></View>
			      					</View>

									<TouchableOpacity onPress={()=>this.shareFunction()}>
										<Text style={{color:'black', marginTop:'15%', marginBottom:'9%', fontSize:15}}> Share </Text>
									</TouchableOpacity>
								
								
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
				 <FABExample navigator={this.props.navigation} />
			</Container>
		);
	}
}
class Products extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			datasetState: null,
			navigate: this.props.navigation.navigate,
			threedotsmodalVisible: false,
			ownerImg: null,
			ownerName: '',
		};
	}
	static navigationOptions = ({ navigation }) => {
		//alert(JSON.stringify(navigation))
		return {
			header: (
			    <Header>
			      <Left>
					<Button transparent onPress={ () => { navigation.dispatch(NavigationActions.back()) }}>
			          <Icon name="ios-arrow-round-back" style={{ color:"black"}}/>
			        </Button>
			      </Left>
			    
			      <Right>
			      	<Button 
			      	onPress={()=> _this.setModalVisibleForThreeDots(true)}
			      	transparent>
			          <Icon name="md-more" style={{ color:"black"}} />
			        </Button>
			       </Right>
			    </Header>
			 )
		}
	};

	setModalVisibleForThreeDots(visible) {
		this.setState({threedotsmodalVisible: visible});
	}

	componentWillMount(){
		const { params } = this.props.navigation.state;
		let articleID = params.item;
		_this = this;
		//fetch title and description
		fetch(`${API}/discoveries/${articleID}/products?page=1&per_page=999`,{
			method:'GET'
		})
		.then((res)=>res.json())
		.then(resData =>{
		//	console.log("test="+JSON.stringify(resData.products))
			 this.setState({datasetState: resData.products});
			 this.setState({ownerImg: resData.product_discovery.owner.image_url})
			 this.setState({ownerName: resData.product_discovery.owner.first_name})
		})
	}

	renderItem = () => {
	  	var count = 0;
	  	if(this.state.datasetState != null){
	    return this.state.datasetState.map(record => {

	      if(record.isPending && !record.isSettled) {
	      	//this.setState({isContent: true});
	        return false;
	      }
	      record['type'] = 'product';
	       count++;
	      return (
	        <RobotItem record={record} navigate={this.state.navigate} />
	      );
	     
	    });
		}
	 }
    setCurrentReadOffset = (event) => {
	    let itemHeight = 402;
	    let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
	    let currentItemIndex = Math.ceil(currentOffset / itemHeight);
	    // this.state.dataset.setReadOffset(currentItemIndex);
	}
	shareFunction(){
		let content_share = {
		  message: 'Hello World',
		  title: 'How are you?'  
		};
		let options_share = {};
		Share.share(content_share, options_share);
	 }
	render() {
		var imgUrl = 'https://forums.iboats.com/user/avatar?userid=503684&type=large';
	  return (
		<Container style={{marginLeft:-3,marginTop:-6}}>
				<Content style={styles.cardOuterContainer} scrollEventThrottle={3000} >
		          {this.renderItem()} 			       
		        </Content>
		        <Modal 
					// animationType="slide"
					transparent={true}
					visible={this.state.threedotsmodalVisible}
					onRequestClose={() => { alert('Modal has been closed.');
				}}>

					<TouchableWithoutFeedback onPress={()=> this.setModalVisibleForThreeDots(!this.state.threedotsmodalVisible)} >
						<View style={{height: deviceHeight, width:deviceWidth }}>
							<TouchableWithoutFeedback>
								<View style={styles.innerViewofModel}> 
									<View style={{flexDirection:'row',}}>
										<View style={styles.avatarWrap1}>					               												
				      								 <Image 
				      									style={styles.avatarWrap}
				      									resizeMode='cover'
				      									source={{uri : imgUrl}}
				      								/> 	
				      					</View>	
				      					<View style={{top:20,left:20}}><Text style={styles.authorNameText}>{this.state.ownerName}</Text></View>
			      					</View>

									<TouchableOpacity onPress={()=>this.shareFunction()}>
										<Text style={{color:'black', marginTop:'15%', marginBottom:'9%', fontSize:15}}> Share </Text>
									</TouchableOpacity>
								
								
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
				 <FABExample navigator={this.props.navigation} />
		</Container>
	  );
	}
  }
  

export default TabNavigator({
	Products: { screen: Products },
	Article: { screen: Article },
  },
  {
  	  tabBarOptions: {
	      activeTintColor: 'white',
	      inactiveTintColor: 'black',
	      activeBackgroundColor: 'black',
	      inactiveBackgroundColor: 'white',
	      labelStyle:{
		  		fontSize: 15,
		  		fontWeight: 'bold',
		  	    marginBottom: 15,
		  	    borderBottom: 4,
		  	},
	      tabStyle: {
		  	width: '100%',
		  	borderBottom: 4,
		  },
	  },

  	  tabBarPosition: 'top',
  	  animationEnabled: true,
   	  swipeEnabled: true,
   	  initialRouteName: 'Article'
  }
  );

const styles = StyleSheet.create({
	title:{
		fontSize:35,
		paddingBottom: 30,
		fontWeight:'300',
		paddingTop:15
	},
	desc:{
		fontSize: 25,
		paddingBottom:18
	},
	innerViewofModel:{
		  backgroundColor: "#fff", 
		  position: 'absolute', 
		  right: '4%', 
		  top: '2%', 
		  height: '18%', 
		  width:'45%',
		  paddingLeft: 15, 
		  paddingRight: 10,
		  borderRadius: 6,
		  borderColor: '#666666',
		  borderWidth: 1,
	  },
	  avatarWrap1:{
		width: 40,
		height: 40,
		borderRadius: 50,
		zIndex:99,
		overflow: 'hidden',
		marginTop: 10,
	},
	avatarWrap:{
		width: 40,
		height: 40,
		zIndex:0,
	},
})