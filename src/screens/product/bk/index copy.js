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

import { Container,
		Header, 
		Left, 
		Body, 
		Right, 
		Button, 
		Icon, 
		Title, 
		H1, 
		H3, 
		H2, 
		Item, 
		Input, 
		Thumbnail,
		Label, 
		Content,  
		Card, 
		CardItem, 
		Toast,
		Spinner,
		CheckBox
	} from 'native-base';
import GridView from "react-native-super-grid";
import { Col, Row, Grid } from 'react-native-easy-grid';
import {DrawerNavigator, addNavigationHelpers, StackNavigator} from 'react-navigation';
import styles from './productStyle';
import {Select, Option} from "react-native-chooser";
import ModalDropdown from 'react-native-modal-dropdown';
import FABExample from '../fab/index.js'

const { width } = Dimensions.get('window');
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

// import DeviceInfo from 'react-native-device-info';
// const deviceId = DeviceInfo.getUniqueID();
	
// const API = `https://api-dev.superble.com/api/v1/`;
const API = `https://api-staging.superble.com/api/v1/`;
const device_id ='Y2QzZjJjNjU5N2YxNzM=';
let selectedFriendsList = [];
let selectAllFriendsList= [];

function abbrNum(number, decPlaces) {
    decPlaces = Math.pow(10,decPlaces);
    var abbrev = [ "k", "m", "b", "t" ];
    	for (var i=abbrev.length-1; i>=0; i--) {
        	var size = Math.pow(10,(i+1)*3);
			if(size <= number) {
				number = Math.round(number*decPlaces/size)/decPlaces;
				if((number == 1000) && (i < abbrev.length - 1)) {
					number = 1;
					i++;
				}
				number += abbrev[i];
				break;
			}
    }
    return number;
}
export default class Product extends React.Component {

	scrollX = new Animated.Value(0);

	constructor(props) {
		super(props);
	    this.state = {
	    	dataShow: false,
            record: null,
            commentData: null,
            productId: null,
            searchText: '',
            commentHtml: '',
			saveCommentText: '',
			relatedArticles:[],
			similerProductsCategories:[],
			similerProductsBrands:[],
			contry:"US",
			modalVisible: false,
			friendsData:[],
			selectAllCheckBoxes: false,
			threedotsmodalVisible: false,
			showToast: false,
			likedHeart: false
        };
	}
	static navigationOptions = ({ navigation, screenProps }) => ({
        header:null
	});	
	
	articleClick(event){
		this.props.navigation.navigate('Article',{ item: event });
	}
//https://api-dev.superble.com/api/v1/products/1732/questions
    componentDidMount() {
		const { params } = this.props.navigation.state;
		let productId    = params.item;
		// let productId = 5346;
		this.setState({ productId: productId});

		// Get comments data
        fetch(API+"products/"+productId+"/questions")
		.then(response => response.json())
		.then(record => {
			this.setState({ commentData: record});
			this.commentLaps();
		});

		// Get product data
		fetch(API+"products/"+productId)
		.then(response => response.json())
		.then(record => {
			this.setState({ record });
		});   
		
		this.fetchRelatedArticles(productId);
		this.getSimilerProductsCategories(productId);
		this.getSimilerProductsBrands(productId);

	}

	getSimilerProductsCategories = (productId) =>{
		fetch(API+"/products/"+productId+"/related_products?type=category_id",{
			method:"GET"
		})
		.then((res)=>res.json())
		.then(resdata=>{
			resdata.data.splice(resdata.data.length, 0, {"image_url": "../../assets/viewall.jpeg"});
			this.setState({similerProductsCategories: resdata.data})
		})
	}

	getSimilerProductsBrands = (productId) =>{
		fetch(API+"/products/"+productId+"/related_products?type=brand_id",{
			method:"GET"
		})
		.then((responce)=>responce.json())
		.then(responcedata=>{
			responcedata.data.splice(responcedata.data.length, 0, {"image_url": "../../assets/viewall.jpeg"});
			this.setState({similerProductsBrands: responcedata.data})
		})
	}
	
	fetchRelatedArticles=(productId)=>{
		fetch(API+"/products/"+productId+"/related_articles",{
			method:'GET'
		})
		.then((ress)=>ress.json())
		.then(resDataa =>{
			this.setState({relatedArticles: resDataa.data})
		})
	}

    commentLaps = (commentDataNew = null) => { 
    	var commentData  = this.state.commentData;
    	if(commentDataNew != null){
    		var commentData  = commentDataNew;
    	}
    	
    	let articles     = null;
    	if(commentData !== null){
    		var comments = (commentData.questions);
    		if(comments != undefined){
    		var count = 0;
		    articles     = comments.map((articleData, index) => {	
		    // alert(articleData.question_text);
		    //alert(count)
		    	if(count>= 0 && count<= 10){
		    		return false;
		    	}
		    	count++;
                return (
                  <View key={articleData.id} style={styles.imageCommentWrap}>
                  		
							<View style={styles.avatarContainer}>
								
									
										<View style={styles.avatarWrap1}>
										{articleData.user.image_url != null && 					
											 <Image 
												style={styles.avatarWrap}
												resizeMode='cover'
												source={{uri: articleData.user.image_url}} 
											/> 
										}
										</View>	
									
								
							</View>		
															
							<View style={styles.contentContainer}>
							{articleData.user.user_name != null && 	
								<Text style={{lineHeight:0}}>
									<H1 style={[styles.text, styles.name]}>{articleData.user.user_name}</H1>
								</Text>
							}
							{articleData.question_text != null && 
								<Text style={styles.commentText}>{articleData.question_text}</Text> 
							}
							</View>
							<View style={styles.likeImgContainer}>
								<TouchableHighlight onPress={() => this.searchComment('for')}>
									<Image 
										style={styles.likeImage}
										resizeMode='contain'
										source={require('../../assets/ic-superble-00.png')} 
									/>
								</TouchableHighlight>
								{articleData.likes != null && 	
									<Text style={styles.likeText}>{articleData.likes} like</Text>
								}
							</View>	

					</View>
                )
                
            });
			}
		}

		//return articles;
		this.setState({ commentHtml: articles});
    }

    likeComment = (value) =>{
    	alert(value);
    }
  	
  	searchComment = (text) => {

  	  this.setState({ searchText: text});
  	  //alert(text)
  	  let productId = this.state.productId;
	  	  fetch(API+`search/question_search?product_id=${productId}&text=${text}`)
	      .then(response => response.json())
	      .then(responseData => {
	      		if(responseData.message){
	      			//alert(responseData.message)
	      			this.commentLaps(null);
	      		}else{
	      			this.commentLaps(responseData);
	      		}
		   });
  	}

  	syncComment = () => {
  		let productId = this.state.productId;
  		fetch(API+"products/"+productId+"/questions")
		.then(response => response.json())
		.then(record => {
			//alert(JSON.stringify(record.questions));
			this.setState({ commentData: record});
			this.commentLaps();
        });
  	}

  	saveComment = () => {
  		AsyncStorage.getItem('isLoggedIn')
		.then( (value) => {
		if(value === null) {
	          return this.props.navigation.navigate('Account');
	     } else {

  		let text 	  = this.state.saveCommentText;
  		let productId = this.state.productId;
  		var data =  JSON.stringify({
          				text  	: text,
	      		    });
	   	    
	      fetch("https://api-staging.superble.com/api/v1/products/"+productId+"/questions/comment", {
	          method: 'POST',
	          headers: {
				  'Authorization': 'Token token='+value+';device_id=Y2QzZjJjNjU5N2YxNzM=',
				// 'Authorization': 'Token token=bb6b2728-ceb4-4b19-b9ec-833b0e66a7d3;device_id='+device_id,
	            'Content-Type': 'application/json',
	          },
	          body: data
	      })
	      .then(response => response.json())
	      .then(responseData => {
	      			// alert(responseData.message)	      		
	      			this.syncComment();
	      			this.setState({ saveCommentText: ''});
	      });
	  	  }
	      });
  	}

	openModal() {
		AsyncStorage.getItem('isLoggedIn')
		.then( (value) => {
		if(value === null) {
	          return this.props.navigation.navigate('Account');
	     } else {
		let productId = this.state.productId;
		this.setState({modalVisible:true});
		fetch("https://api-staging.superble.com/api/v1/friends?product_id="+productId,{
			headers:{
				'Authorization':'Token token='+value+';device_id=Y2QzZjJjNjU5N2YxNzM=',
				// 'Authorization':'Token token=bb6b2728-ceb4-4b19-b9ec-833b0e66a7d3;device_id='+deviceId,
				'Content-Type':'application/json'
			}
		})
		.then((responce)=>responce.json())
		.then((resData)=>{
			let modifiedData = [];
			for(i=0; i<resData.friends.length; i++){
				let item = resData.friends[i];
				item.index = i;
				item.isSelect = false;
				modifiedData.push(item);
			}
			this.setState({friendsData:modifiedData});
		})
		}
		});
	}
	
	closeModal = () => {
		this.setState({modalVisible:false});
		// Toast.show({
		// 	text: 'Invited successfully!',
		// 	position: 'bottom'
		//   })
		// alert('Invited successfully!')
	}

	setModalVisibleForThreeDots(visible) {
		this.setState({threedotsmodalVisible: visible});
	 }

	checkAllBoxes = () =>{
		const { friendsData, selectAllCheckBoxes } = this.state;
		friendsData.map(i =>{
			selectAllFriendsList.push(i.user.id)
			i.isSelect = !selectAllCheckBoxes;
		})
		this.setState(friendsData);
		this.setState({ selectAllCheckBoxes: !selectAllCheckBoxes })
	} 

	clickOnSingleCheckbox = (item) =>{
		const { friendsData }= this.state;
		selectedFriendsList.push(item.user.id);
		// alert(JSON.stringify(selectedFriendsList))
		friendsData[item.index]['isSelect'] = !friendsData[item.index]['isSelect'];
 		this.setState(friendsData);
	}

	sendAPItoPostFriendsList= () =>{
		AsyncStorage.getItem('isLoggedIn')
		.then( (value) => {
		if(value === null) {
	          return this.props.navigation.navigate('Account');
	     } else {
		let mainArray=[]
		let productId = this.state.productId;
		selectedFriendsList.length>=1  ? mainArray = selectedFriendsList  : null;
		selectAllFriendsList.length>=1 ? mainArray = selectAllFriendsList : null;

		selectedFriendsList = []
		selectAllFriendsList= []

		var arrString = mainArray.join('&user_ids[]='); 
		arrString = '&user_ids[]=' + arrString;

		fetch(`https://api-staging.superble.com/api/v1/requests?product_id=${productId}${arrString}`,{
			method: 'POST',		
			headers:{
				'Authorization':'Token token='+value+';device_id=Y2QzZjJjNjU5N2YxNzM=',
				// 'Authorization':'Token token=bb6b2728-ceb4-4b19-b9ec-833b0e66a7d3;device_id='+deviceId,
				'Content-Type':'application/json'
			}
		}).then(function(responce){
			if(responce.ok){
					alert('Invited successfully !')
					// this.closeModal();
			}
		}).catch(function() {
			alert('Some error occured!')
			// this.closeModal();
		});

		mainArray=[]
		}
		});
	}

	likeProduct = (itemID)=>{
		AsyncStorage.getItem('isLoggedIn')
		.then( (value) => {
		 if(value === null) {
	          return this.props.navigation.navigate('Account');
	      } else {

		let that = this;
		// itemID= rec.product.product_id
		let { record, likedHeart } = this.state
		this.setState({likedHeart: !likedHeart})

		if(likedHeart == false){

		let statusData = JSON.stringify({ status: 'like' });
		fetch(API+'products/'+itemID+'/likes',{ 
			method:'POST',
			headers:{
			'Authorization':'Token token='+value+';device_id=Y2QzZjJjNjU5N2YxNzM=',
			'Content-Type':'application/json'
			},
			body: statusData
		}).then(function(res){
			if(res.ok){
				let arrayD = record
				arrayD.product.like_count = record.product.like_count+1
				that.setState({record: arrayD});
			}
		}).catch(function(e){
			alert(e)
		})
		
		}else{
		let statusData = JSON.stringify({ status: 'nolike' });
		fetch(API+'products/'+itemID+'/likes',{ 
			method:'POST',
			headers:{
			'Authorization':'Token token='+value+';device_id=Y2QzZjJjNjU5N2YxNzM=',
			'Content-Type':'application/json'
			},
			body: statusData
		}).then(function(res){
			if(res.ok){
				let arrayD = record
				arrayD.product.like_count = record.product.like_count-1
				that.setState({record: arrayD});
			}
		}).catch(function(e){
			alert(e)
		})

		}
		}

		});
	}
	removeDuplicates = (arr) =>{
	    let unique_array = []
	    for(let i = 0;i < arr.length; i++){
	        if(unique_array.indexOf(arr[i]) == -1){
	            unique_array.push(arr[i])
	        }
	    }
	    return unique_array
	}

	shareFunction(){
		let content_share = {
		  message: 'Hello World',
		  title: 'How are you?'  
		};
		let options_share = {};
		Share.share(content_share, options_share);
	 }

	 changeContry(contryName){
		// alert(contryName)
		if(contryName == "Singapore"){
			this.setState({contry: "SGP"})
		}
		if(contryName == "United States"){
			this.setState({contry: "US"})
		}
	 }

	// renderRow(){
	// 	return(
	// 		<View>
	// 			<Image
	// 				scorce={require("../../assets/user.jpg")}
	// 				style={{height:50, width:50}}
	// 			/>
	// 		</View>
	// 		);
	// }

	render() {
		const { record } = this.state;		
		const { commentHtml } = this.state;
		let heart, heartIconColor;	
		let imgArr = null;
		let dotsFlag = 0;
		
		if(this.state.likedHeart == true) {
			heart = 'ios-heart';
			heartIconColor= 'red'; 
		}else{ 
			heart = 'md-heart-outline';
			heartIconColor='black';
		}

		record !== null ? imgArr = record.product.image_urls : imgArr=null;
		
		// Duplicate product images
		if(record !== null){
		    var duplicateData = record.product.duplicate_products;
		    if(duplicateData !== undefined || duplicateData !== null){      
		      duplicateData.map((item, i) => {
		          imgArr.push(item.image_url);
		      });
		    }
		    imgArr = this.removeDuplicates(imgArr);
		}


		let position = Animated.divide(this.scrollX, width);
			
        return (
	    	<View style={styles.pageContainer}>
	    	
			{record !== null && commentHtml !== null ? (
				<ScrollView	> 
					<Modal
						visible={this.state.modalVisible}
						animationType={'fade'}
						transparent={true}
						presentationStyle="overFullScreen"
						onRequestClose={() => this.closeModal()}
          			>
      			  <TouchableWithoutFeedback onPress={() => { this.closeModal() }}>
		            <View style={styles.createAccountMainView}>
		              {this.state.friendsData.length > 0 &&
					  <ScrollView>
						<Card style={{maxHeight: 470, marginTop:70, marginLeft:15, marginRight:15}}>
							<CardItem>
								<Left>
									<Text style={{color:'#000'}}>Select All</Text>
								</Left>
								<Right>
									<CheckBox style={{marginRight:3}} checked={this.state.selectAllCheckBoxes} onPress={()=>{this.checkAllBoxes()}} />
								</Right>
							</CardItem>
							<View style={{marginTop: 5, marginBottom: 5,backgroundColor: 'gray',height: 1,width: '100%'}} />
							<FlatList
								data={this.state.friendsData}
								extraData={this.state}
								keyExtractor={(item, index) => index}
								renderItem={({item}) =>								
								<CardItem>
									<Left>
										<Thumbnail small source={{uri: item.user.profile_pic_url}} />

										<View style={{flexDirection:'column', marginLeft:17}}>
											<Text style={{color:'#000', fontSize:15}}> {item.user.name} </Text>
											<View style={{flexDirection:'row', paddingTop:4}}>
												<Image
													source={require('../../assets/diamond.png')} 
													style={{height:22, width:22}}
												/>
												<Text style={{color:'#333333'}}> {item.points} </Text>
											</View>
										</View>
									</Left>

									<Right style={{flexDirection:'row', marginRight:-100}}>
										<Thumbnail
											small
											source={{uri : item.badge.image_url}}
										/>
										<View> 
											<CheckBox style={{top:-8}} checked={item.isSelect} onPress={()=> this.clickOnSingleCheckbox(item)} />
										</View>
									</Right>
								</CardItem>
								}
							/>
							<View>
								<Button
									transparent
									block
									style={{borderRadius: 10, borderWidth: 1, borderColor: 'black', marginBottom:10, marginHorizontal:12}}
									onPress={()=>this.sendAPItoPostFriendsList() } >
									<Text> Invite to chat </Text>
								</Button>
							</View>
						</Card>	
						</ScrollView>	
						}
						{this.state.friendsData.length <= 0 &&
							<Card style={{maxHeight: 360, marginTop:85, marginLeft:17, marginRight:17}}>
								<CardItem style={{flexDirection:'column', marginTop: '35%'}}>
									<Text> Hold on! </Text>
									<Text> You already invited everyone </Text>
									<Text> who's interested in this product </Text>
								</CardItem>
							</Card>
						}
			            </View>
			          </TouchableWithoutFeedback>
					</Modal>

					<Content style={{height:300}}>
						<View style={{height:300}}>
							<View style={styles.productImg}>
							{/* {alert( JSON.stringify(record.product.image_urls))} */}
							
								{/* <Image 
									style={{width: 432, height: 300}} 
									// resizeMode='contain'
									source={{uri: record.product.image_urls[0]}} 
								/> */}
								 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
              						<View style={{ width, height: width }}> 

								<ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}
									onScroll={Animated.event( 
									[{ nativeEvent: { contentOffset: { x: this.scrollX } } }] 
									)}
									scrollEventThrottle={16}
									>
									{

									imgArr.map((item, index)=>(
										<TouchableOpacity key = {item}>
										<Image style={{height: 400, width:400}} source={{uri : item}} />
										<Image style={{position:'absolute', height:'100%', width:'100%'}} source={require('../../assets/overlayimg.png')} />
									</TouchableOpacity> 
				
									))
									}
									</ScrollView>
									</View>
									{imgArr.length >= 2 &&
									<View style={{ flexDirection: 'row', position:'absolute', zIndex:99999, bottom:80 }}>
										{imgArr.map((_, i) => {
											let opacity = position.interpolate({
												inputRange: [i - 1, i, i + 1], 
												outputRange: [0.3, 1, 0.3], 
												extrapolate: 'clamp'
											});
											return (
											<Animated.View
												key={i}
												style={{opacity, height: 10, width: 10, backgroundColor: '#ffffff', marginLeft: 4,marginBottom:6, borderRadius: 5 }}
											/>
											);
										})}
                					</View>
									}
									</View>


							</View>
							<View style={styles.backArrow}>	
								<View style={styles.backArrowWrap}>
									<TouchableOpacity 
										style={styles.backArrow} 
										onPress={ () => { this.props.navigation.goBack() }}>
										<Icon name='md-arrow-back' />
									</TouchableOpacity>
								</View>
								<View style={styles.dotsWrap}>
								<TouchableOpacity
									onPress={()=> this.setModalVisibleForThreeDots(true)}
								>
									<Icon name='ios-more' style={styles.settingArrowImg}  />
								</TouchableOpacity>
								</View>
							</View>
						</View>
					</Content>					
							<View style={styles.viewIcon}>
								<View style={styles.viewPro}>
									<Image 
										style={styles.backArrowImg} 
										source={require('../../assets/visibility.png')} />
								</View>
								<Text style={styles.viewProText}> {abbrNum(record.product.view_count , 2)} </Text>

								<View style={styles.heartPro}>
								<TouchableHighlight onPress={() => this.likeProduct(record.product.product_id)}>
										<Icon name={heart} style={{color:heartIconColor, fontSize:22,}} />
								</TouchableHighlight>
								</View>
								
								<Text style={styles.heartProText}> {record.product.like_count} </Text>
							</View>
							
							<View style={styles.proDetailWrap}>
								<View>
									<Text style={styles.proTitle}>{record.product.title}</Text>
								</View>
							</View>
							
							<View style={styles.askBtnWrap}>
								<View style={styles.askBtn}>
									<Button 
										block
										transparent
										onPress={()=>this.openModal()}
									>
										<Text
											style={styles.askBtnText}											
											>ASK HERE!</Text> 
									</Button>					
								</View>			
								<View style={{marginTop: 17, marginBottom: 10,backgroundColor: '#C7C9C8',height: 1,width: '92%'}} />						
							</View>
							
							<View style={styles.commentWrap}>
								<View style={styles.commentContainer}>
												                          
									<View style={styles.inputContainer}>
										<TextInput underlineColorAndroid='transparent' placeholder="Search" style={styles.searchInput} onChangeText={(searchText) => {this.searchComment(searchText); }} value={this.state.searchText}														
										/>
							
									</View>												
									
									<View style={{maxHeight:500,overflow:'hidden'}}>
										<ScrollView	> 										
											  {commentHtml}  
										</ScrollView> 
									</View>	
									
									<View style={styles.imageCommentWrap}>
										<View style={styles.writeCommentWrap}>
											<TextInput placeholder="Write a comment" style={styles.commentInput} underlineColorAndroid='transparent' onChangeText={(saveCommentText) => {this.setState({saveCommentText}); }} value={this.state.saveCommentText}/>
										</View>
										<View style={styles.sendButtonWrap}>
											<Button style={styles.sendButton} onPress={ () => { this.saveComment() }}><Text style={styles.sendBtnText}>SEND</Text></Button>	
										</View>
									</View>										
											
								</View>
								
							</View>

							<View style={{alignItems: 'center'}}>
								<Card style={{width:'95%', marginTop: 20}}>
									<CardItem 
										style={{borderBottomWidth:2,  borderBottomColor:'#C7C9C8', borderRadius: 1, paddingBottom:8, paddingTop:8}}
									>
										
										<ModalDropdown 
											options={['Select Contry','United States', 'Singapore']}
											dropdownStyle={{ paddingVertical:20, paddingHorizontal:30}}
											style={{paddingVertical:5, paddingHorizontal:20}}
											textStyle={{color:'black', fontSize:16}}
											defaultIndex='1'
											defaultValue='United States'
											dropdownTextStyle={{fontSize:14, color:'black',}}
											onSelect={(index, value)=> this.changeContry(value)}
											/>


										{/* <ModalDropdown 
											options={['Select Contry','United States', 'Singapore']}
											dropdownStyle={{ paddingVertical:20, paddingHorizontal:30}}
											style={{paddingVertical:5, paddingHorizontal:20}}
											textStyle={{color:'black', fontSize:16}}
											defaultIndex='1'
											defaultValue='United States'
											dropdownTextStyle={{fontSize:14, color:'black',}}
											onSelect={(index, value)=> this.changeContry(value)}
											renderRow={this.renderRow.bind(this)}
										/> */}






								    </CardItem >
									<CardItem 
										style={{borderBottomWidth:2, borderBottomColor:'#C7C9C8', borderRadius: 1, paddingBottom:30, paddingTop:20}}
									>
										<Left>
											<Image 
												source={require('../../assets/logo.png')}
												resizeMode="contain"
												style={{width:120, height:50}}/>
										</Left>
										
											<Text style={{fontSize:13, paddingLeft:20, fontWeight:'400',alignItems: 'center'}}>ONLY {record.product.points} {'\n'} POINTS !!!</Text>
										<Right>		
												<Text style={{color: '#40c4ff',fontSize:15}}
													onPress={() => alert('in dev')}>
													BUY NOW
												</Text>
										</Right>
									</CardItem>
									
									{record.product.multi_url.map((e)=>(
										e.country_code == this.state.contry &&
									<View key={e.url}>
											<CardItem style={{paddingTop:27, paddingBottom:27}}>
												<Left>
													<Image 
														source={{uri: e.url_img}}
														resizeMode="contain"
														style={{width:120, height:50}}/>
												</Left>

												{e.price !== null &&
												<Body>
													<Text style={{fontSize:14, paddingLeft:'40%', paddingTop:15, fontWeight:'400',alignItems: 'center'}}>{e.price} {e.currency}  </Text>
												</Body>
												}

											<Right>
												<Text style={{color: '#40c4ff',fontSize:15}}
													onPress={() => Linking.openURL(e.url)}>
													BUY NOW
												</Text>
											</Right>
											</CardItem>
									</View>
										
									))}
								</Card>
								<View style={{marginTop: 17, marginBottom: 10,backgroundColor: '#C7C9C8',height: 1,width: '97%'}} />
							</View>

							
							{ this.state.similerProductsCategories.length > 1 &&
							<View style={{alignItems: 'center'}}>
								
								<Card style={{width:'95%',paddingBottom:15, paddingTop:15}} >
										<Text style={{color:'black', fontSize:15, paddingBottom:10, paddingTop:15, paddingLeft:20}}>
											Others from {record.product.category.name}
										</Text>
										
									<GridView
										itemDimension={1000}
										horizontal={true}
										items={this.state.similerProductsCategories}
										renderItem={item => (
											<View style={{flexDirection:'row'}}>
										
											{item.image_url !== '../../assets/viewall.jpeg' && 
												<Image
													resizeMode="contain"
													source={{ uri: item.image_url }} 
													style={{ height: 100, width: 100, marginLeft: -10 }} />
											}

											{item.image_url == '../../assets/viewall.jpeg' &&
											
											<TouchableOpacity onPress={()=> alert('In Dev')}>
											<Image
												resizeMode="contain"	
												source={require('../../assets/viewall.jpeg')} 
												style={{ height: 100, width: 100, marginLeft: -10 }} />
											</TouchableOpacity>
											
											}
									    </View>

										)}
									/>
								</Card>
							</View>
							}
							{ this.state.similerProductsBrands.length > 1 &&
							<View style={{alignItems: 'center'}}>
								
								<Card style={{width:'95%'}}>
									<Text style={{color:'black', fontSize:15, paddingBottom:10, paddingTop:15, paddingLeft:20}}>
										Others from {record.product.brand.name}
									</Text>

									<GridView
										itemDimension={1000}
										horizontal={true}
										items={this.state.similerProductsBrands}
										renderItem={item => (

										// <Image 
										// 	resizeMode="contain" 
										// 	source={{ uri: item.image_url }} 
										// 	style={{ height: 100, width: 100, marginLeft: -10 }} />
										
										<View style={{flexDirection:'row'}}>
										
										{item.image_url !== '../../assets/viewall.jpeg' && 
											<Image
												resizeMode="contain"
												source={{ uri: item.image_url }} 
												style={{ height: 100, width: 100, marginLeft: -10 }} />
										}

										{item.image_url == '../../assets/viewall.jpeg' &&
										
										<TouchableOpacity onPress={()=> alert('In Dev')}>
										<Image
											resizeMode="contain"	
											source={require('../../assets/viewall.jpeg')} 
											style={{ height: 100, width: 100, marginLeft: -10 }} />
										</TouchableOpacity>
										
										}
										
									</View>

										)}

									/>

								</Card>
							</View>
							}
 
							{ /* Related article section */ }
							<View style={{alignItems: 'center'}}>
								
								<Card style={{width:'95%',paddingBottom:18, marginBottom:30}}>
									<View style={{flexDirection:'row', 
										justifyContent:'space-between',
										paddingVertical :20,
										paddingHorizontal:10}}>
										<Text style={{color:'#000'}}> Related Articles </Text>
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
							</View>


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
										
											<TouchableOpacity onPress={()=>this.shareFunction()}>
												<Text style={{color:'black', marginTop:'15%', marginBottom:'9%', fontSize:15}}> Share </Text>
											</TouchableOpacity>
										
											<TouchableOpacity onPress={()=>alert('In Development')}>
												<Text style={{color:'black', marginTop:'11%', marginBottom:'9%', fontSize:15}}> Add to list </Text>
											</TouchableOpacity>
										
											<TouchableOpacity onPress={()=>this.shareFunction()}>
												<Text style={{color:'black', marginTop:'11%', marginBottom:'9%', fontSize:15}}> Report </Text>
											</TouchableOpacity>
										
										</View>
									</TouchableWithoutFeedback>
								</View>
							</TouchableWithoutFeedback>
						</Modal>

							<FABExample navigator={this.props.navigation} />
					</ScrollView>
				
				) : (
					<View style={{flex:1, flexDirection: 'column',justifyContent: 'center',alignItems: 'center',}}>
						<Spinner color="#00C497" key={Math.random()}/>
					</View>
				)}
		    </View>
			
		);
	}

}
