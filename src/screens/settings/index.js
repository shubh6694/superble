import React from 'react';
import { Dimensions, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, Linking, Share, AsyncStorage } from 'react-native';
import {  Container, Header, Left, Body, Right, Button, Icon, Content, Card, CardItem, Item, ListItem } from 'native-base';
import FABExample from '../fab/index.js'

const deviceWidth  = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

let currentEmail = 'abc@xyz.com'
	
export default class Settings extends React.Component {

    static navigationOptions = {
        title: 'Settings',
        // headerLeft: <Icon style={{marginLeft:15}} name="ios-arrow-round-back" onPress={()=> this.props.navigation.goBack()} />
    };

    constructor(props){
        super(props);
        this.state={
            pwModalVisible: false,
            emailModalVisible: false,
        }
    }

    _changePwModelOpen = () =>{
        this.setState({pwModalVisible: true})
    }

    _changeEmailModelOpen = () =>{
        this.setState({emailModalVisible: true})
    }

    _closeModal = () => {
        this.setState({pwModalVisible: false})
        this.setState({emailModalVisible: false})
    } 

    _shareFunction = () =>{
        let content_share = {
            message: 'Hi',
            title: 'Hello'  
          };
          let options_share = {};
          Share.share(content_share, options_share);
    }
     signOutUser = () => {
        AsyncStorage.setItem('isLoggedIn', '');
        AsyncStorage.setItem('loggedinUserData', '');   
        this.setState({isLoggedIn: null});
        this.props.navigation.navigate('Home',{ item: '1' });    
      }

	render() {
        return (
	    	<Container>

                <Text style={styles.titles}>Basic Settings</Text>
                <ListItem style={{flexDirection:'column'}}>
                   
                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="md-mail" />
                        </Left>
                        <View style={styles.textView}>
                        <TouchableOpacity onPress={() => this._changeEmailModelOpen()} >
                                <Text> Change Email </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="md-key" />
                        </Left>
                        <View style={styles.textView}>
                            <TouchableOpacity onPress={() => this._changePwModelOpen() } >
                                <Text> Change Password </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="md-notifications-outline" />
                        </Left>
                        <View style={styles.textView}>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Notifications')} >
                                <Text> Notifications </Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                </ListItem>

                <Text style={styles.titles}>Details</Text>
                <ListItem style={{flexDirection:'column'}}>
                    
                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="md-information-circle" />
                        </Left>
                        <View style={styles.textView}>
                            <TouchableOpacity onPress={() => Linking.openURL('https://superble.com/about-us')}>
                                <Text> About Us </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        
                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="ios-unlock" />
                        </Left> 
                        <View style={styles.textView}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://superble.com/privacy-policy')}>
                                <Text> Privacy </Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="ios-help-circle" />
                        </Left>
                        <View style={styles.textView}>
                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Terms')} >
                                <Text> Terms </Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                </ListItem>

                <Text style={styles.titles}> Profile </Text>
                
                <ListItem style={{flexDirection:'column'}}>

                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="md-send" />
                        </Left>
                        <View style={styles.textView}>
                            <TouchableOpacity onPress={()=> this._shareFunction()} >
                                <Text> Send Feedback </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.mainView}>
                        <Left style={{width:'5%'}}>
                            <Icon style={styles.icons} name="md-person" />
                        </Left>
                        <View style={styles.textView}>
                             <TouchableOpacity onPress={()=>this.signOutUser()}>
                                <Text> Logout </Text>
                             </TouchableOpacity>  
                        </View>
                    </View>

                </ListItem>

                {/* Change Password Model */}
                    <Modal
                        visible={this.state.pwModalVisible}
                        animationType={'fade'}
                        transparent={true}
                        presentationStyle="overFullScreen"
                        onRequestClose={() => this._closeModal()}
                    >
                        <TouchableWithoutFeedback onPress={() => { this._closeModal()}}>
                            <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", height: deviceHeight, width:deviceWidth }}>

                                <TouchableWithoutFeedback>
                                    <View style={{ backgroundColor: "#fff", position: 'absolute', left: '5%', right: '5%', top: '20%', height: '50%', paddingLeft: 10, paddingRight: 10,}}> 
                                        <Text>Change Password</Text>
                                        <TextInput
                                            placeholder='Old Password'
                                        />
                                        <TextInput
                                            placeholder='New Password (6-20 chars)'
                                        />
                                        <TextInput
                                            placeholder='Re-Confirm Password'
                                        />
                                        <TouchableOpacity onPress={()=> alert('In Dev')} >
                                            <Text> CONFIRM </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> this._closeModal()} >
                                            <Text> CANCEL </Text>
                                        </TouchableOpacity>

                                    </View>
                                </TouchableWithoutFeedback>

                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {/* Chnage Email Modal */}
                    <Modal
                        visible={this.state.emailModalVisible}
                        animationType={'fade'}
                        transparent={true}
                        presentationStyle="overFullScreen"
                        onRequestClose={() => this._closeModal()}
                    >
                        <TouchableWithoutFeedback onPress={() => { this._closeModal()}}>
                            <View style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", height: deviceHeight, width:deviceWidth }}>

                                <TouchableWithoutFeedback>
                                    <View style={{ backgroundColor: "#fff", position: 'absolute', left: '5%', right: '5%', top: '20%', height: '50%', paddingLeft: 10, paddingRight: 10,}}> 
                                        <Text>Change Email</Text>
                                        <TextInput
                                            placeholder={currentEmail}
                                        />
                                        <TextInput
                                            placeholder='Password'
                                        />
                                        <TextInput
                                            placeholder='New Email Address'
                                        />
                                        <TextInput
                                            placeholder='Re-Confirm New Email Address'
                                        />
                                        <TouchableOpacity onPress={()=> alert('In Dev')} >
                                            <Text> CONFIRM </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={()=> this._closeModal()} >
                                            <Text> CANCEL </Text>
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

const styles= StyleSheet.create({
    icons:{
        marginLeft:5,
        color:'gray',
    },
    mainView:{
        flexDirection:'row', 
        alignSelf:'flex-start',
        paddingVertical:10,
        width:'100%',
    },
    titles:{
        marginLeft: 10,
        paddingTop:12,
        paddingBottom: 3,
        color:'#7c6001',
    },
    textView:{
        width:'90%',
    }
})