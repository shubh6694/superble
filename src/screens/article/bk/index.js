import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
} from 'react-native';
import {
	Card,
	Left,
	Right,
	Fab,
	Icon,
	Button,
	Container,
} from 'native-base';
import {
	DrawerNavigator,
	addNavigationHelpers,
	StackNavigator
} from 'react-navigation';
import HTMLView from 'react-native-htmlview';

let API= 'https://api-staging.superble.com/api/v1';

// function renderNode(node, index, siblings, parent, defaultRenderer) {
// 	if (node.name == 'figure') {
// 		const a = node.attribs;
// 		alert(JSON.stringify(a.data))
// 	}
//   }

export default class Article extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title:'',
			desc:'',
			descCss:'',
			tags:[],
			relatedArticles:[],
			active: 'false'
		};
	}

	componentDidMount(){
		const { params } = this.props.navigation.state;
		let articleID = params.item;
		
		//fetch title and description
		fetch(`${API}/discoveries/${articleID}/products?page=1&per_page=999`,{
			method:'GET'
		})
		.then((res)=>res.json())
		.then(resData =>{
			this.setState({title: resData.product_discovery.title})
			this.setState({desc: resData.product_discovery.description})
			this.setState({descCss: resData.product_discovery.descriptionCss})
			this.setState({tags: resData.product_discovery.tags})
		})

		this.fetchRelatedArticles(articleID);
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
		// const temp = '<img src=\"https://s3-us-west-2.amazonaws.com/superble-images-stage/images/photos/000/007/512/original/1519629608_compressed.jpg\"/><img src=\"https://s3-us-west-2.amazonaws.com/superble-images-stage/images/photos/000/007/513/original/1519629667_compressed.jpeg\"/><img src=\"https://s3-us-west-2.amazonaws.com/superble-images-stage/images/photos/000/007/514/original/1519629699_compressed.jpeg\"/>';
		return (
			<Container>
				<ScrollView style={{paddingHorizontal: 20, backgroundColor:'white'}} >
					
					<Text style={styles.title}>{this.state.title}</Text>  
					
					 <HTMLView
						value={this.state.desc}
						// stylesheet={this.state.descCss}
						// renderNode={renderNode}
					/>

					{/* <HTMLView
						value={temp}
					/> */}
					
					
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
      							onPress={() => alert(item.id)}>
  								{item.title}
							</Text>
						}
					/>
					</Card>

					 {/* <View>
						<Fab
							active={this.state.active}
							direction="up"
							style={{ backgroundColor: '#5067FF' }}
							position="bottomRight"
							onPress={() => this.setState({ active: !this.state.active })}>
							
							<Icon name="share" />

							<Button style={{ backgroundColor: '#34A34F' }}>
							<Icon name="logo-whatsapp" />
							</Button>
							
							<Button style={{ backgroundColor: '#3B5998' }}>
							<Icon name="logo-facebook" />
							</Button>

							<Button disabled style={{ backgroundColor: '#DD5144' }}>
							<Icon name="mail" />
							</Button>
						</Fab>
						</View> */}
				</ScrollView>
			</Container>
		);
	}
}

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
	}
})