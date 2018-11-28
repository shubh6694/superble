import React from 'react';
import {Dimensions, Image, Modal, StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity,ScrollView,TouchableHighlight,AsyncStorage} from 'react-native';
import { Button, Container, Content, Form, H1, H2, Header, Item, Input, Label, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from './accountStyle';
import {LoginManager} from 'react-native-fbsdk';
import {GoogleSignin} from 'react-native-google-signin';
import { Switch } from 'react-native-switch';
import InstagramLogin from 'react-native-instagram-login';
import Ins from 'react-native-instagram-login';
const API = 'https://api-staging.superble.com/api/v1/';
var ImagePicker = require('react-native-image-picker');
// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photos from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};


const deviceWidth  = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;


export default class Account extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }
  getPhotos = () => {
    // Open Image Library:
    ImagePicker.launchImageLibrary(options, (response)  => {
      // Same code as in above section!
    });
  }

 fbAuth = () => {
    LoginManager.logInWithReadPermissions(['public_profile','email','user_birthday']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('Login was cancelled');
        } else {
          console.log('Login was successful with permissions: '
            + result.grantedPermissions.toString());
             this.setState({isLoggedIn: true});
  
        }
      },
      function (error) {
        console.log('Login failed with error: ' + error);
      }
    );
  }
  constructor(props){
    super(props);
    this.state = {
      syncData: false,
      token: null,
      syncDataScreen2: false,
      syncDataScreen3: true,
      photos: [],
      record: null,
      topicsId: [],
      buttonEnable: false,
     
    }
  
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }
  getIndex(value, arr) {
      for(var i = 0; i < arr.length; i++) {
          if(arr[i]=== value) {
              return i;
          }
      }
      return -1; //to handle the case where the value doesn't exist
  }
  onPressBox(index,id,flag){
      let data = this.state.record;
      let dataId = this.state.topicsId;
      if(flag){
        var index1 = this.getIndex(id, dataId);
        dataId.splice(index1, 1);
        data[index]['flag'] = false;
      }else{
        dataId.push(id);
        data[index]['flag'] = true;
      }

      this.setState({topicsId: dataId});
      this.setState({record: data});
      if(dataId.length > 2){
        this.setState({buttonEnable: true});  
      }else{
        this.setState({buttonEnable: false});  
      }      
    
  }

  loggedOutUser = () => {
   alert(LoginManager.logOut());
    alert('logoutUser');
  }
  setModalVisibleSyncData(visible) {
    this.setState({syncData: visible});
  } 
  setModalVisibleSyncDataScreen(visible) {
    this.setState({syncData: false});
    this.setState({syncDataScreen2: visible});
  } 
  setModalVisibleSyncDataScreen3(visible) {
    this.setState({syncData: false});
    this.setState({syncDataScreen3: visible});
  } 
  submitTopics(isAble){
    if(isAble){
      let dataId = this.state.topicsId;
      this.setState({syncDataScreen3: false});
      this.props.navigation.navigate('Home');    
      return false;
      let token = 'ee2bd22f-03e1-4dd1-9a0f-2d6d4583daa7';
      let data = JSON.stringify({ status: 'unlike' });
      fetch(API+'categories/follow',{ 
          method:'PUT',
          headers:{
            'Authorization':'Token token='+token+';device_id=08ff1c34-26bc-4f37-9c52-8fd097ca4128',
            'Content-Type':'application/json'
          },
          body: data
        })
       .then(response => response.json())
       .then(responseData => { 
          //console.log(JSON.stringify(responseData.topics));
          let topics = responseData.topics;
          let updated= [];
          topics.map((data) => {
            data['flag'] = false;
            updated.push(data);
          });
          this.setState({record: updated});
       });
    }else{
      return false;
    }
  }
  componentDidMount(){
        AsyncStorage.getItem('isLoggedIn')
        .then( (token) => {
            if(token === null) {
              return this.props.navigate('Account');
            } else {
            
              fetch(API+'categories/topics',{ 
                  method:'GET',
                  headers:{
                    'Authorization':'Token token='+token+';device_id=08ff1c34-26bc-4f37-9c52-8fd097ca4128',
                    'Content-Type':'application/json'
                  }
                })
               .then(response => response.json())
               .then(responseData => { 
                  //console.log(JSON.stringify(responseData.topics));
                  let topics = responseData.topics;
                  let updated= [];
                  topics.map((data) => {
                    data['flag'] = false;
                    updated.push(data);
                  });
                  this.setState({record: updated});
               });
            }
          });
  }
  render() {
    let record = this.state.record;
    return (
    <Container>
      {record != null ? (
        <View style={{flex:1,flexDirection: 'column'}}>
            <Modal
              transparent={true}
              visible={this.state.syncDataScreen3}
              presentationStyle={'overFullScreen'}
              onRequestClose={() => {this.setModalVisibleSyncDataScreen3(!this.state.syncDataScreen3)}}
            >
              <TouchableWithoutFeedback onPress={() => { this.setModalVisibleSyncDataScreen3(!this.state.syncDataScreen3) }}>
                <View style={styles.syncDatatMainView}>
                  <TouchableWithoutFeedback>
                    <View style={styles.syncDataStyle}>
                      <Container>
                        <View style={{height:'10%',width:'100%'}}>  
                          <View style={{alignItems: 'center',}}><Text style={{paddingTop:10,paddingBottom:10,fontSize:18,fontWeight:'600',color:'#666666'}}>Pick 3 topics to follow</Text></View>
                        </View>
                        <View style={{maxHeight:'76%',overflow:'hidden'}}>
                        <ScrollView>
                            <View style={{alignItems: 'center',flexDirection: 'row', flexWrap: 'wrap',}}>                         
                              {record.map((i,v)=>                                                           
                                  <View style={{width: '50%', alignItems: 'center'}}>
                                      <TouchableOpacity onPress={() => this.onPressBox(v,i.id,i.flag)}>  
                                        <View style={ (i.flag == true) ? styles.boxStyleGreen : styles.boxStyle}>
                                          <Text style={{fontSize:15,color:'white',paddingLeft:15,paddingRight:15}}>{i.name}</Text>
                                        </View>
                                      </TouchableOpacity>
                                  </View>                                
                              )}                                        
                            </View>
                        </ScrollView>    
                        </View> 
                        
                        <View style={{marginTop:10}}>    
                          <View style={styles.buttonContainer}>     
                            <Button
                                style={(this.state.buttonEnable) ? styles.buttonStyleNext : styles.buttonStyleNextDisable}
                                onPress={() => { this.submitTopics(this.state.buttonEnable)}}
                              ><Text style={styles.buttonStyleText}>Next</Text>
                            </Button>
                          </View>
                        </View>
                      </Container>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
            <Modal
              animationType={'fade'}
              transparent={true}
              visible={this.state.syncData}
              presentationStyle={'overFullScreen'}
              onRequestClose={() => {this.setModalVisibleSyncData(!this.state.syncData)}}
            >
              <TouchableWithoutFeedback onPress={() => { this.setModalVisibleSyncData(!this.state.syncData) }}>
                <View style={styles.syncDatatMainView}>
                  <TouchableWithoutFeedback>
                    <View style={styles.syncDataStyle}>
                      <Container>
                      <H2 style={styles.syncDataHeader}>Sync your accounts and start earning now</H2>
                        <Content >
                          <View style={styles.imageCommentWrap}>                          
                              <View style={styles.avatarContainer}>
                                <Image style={styles.facebookIcon} source={require('../../assets/facebook1.png')} />
                              </View>                         
                              <View style={styles.contentContainer}>
                                <Text>Facebook</Text>
                              </View>
                              <View style={styles.likeImgContainer}>
                                   <Switch
                                      value={false}
                                      onValueChange={(val) => this.fbAuth(val)}
                                      disabled={false}
                                      activeText={'On'}
                                      inActiveText={'Off'}
                                      circleSize={20}
                                      barHeight={1}
                                      circleBorderWidth={3}
                                      backgroundActive={'gray'}
                                      backgroundInactive={'gray'}
                                      circleActiveColor={'green'}
                                      circleInActiveColor={'#ffffff'}
                                    />
                              </View> 

                          </View>
                          <View style={styles.imageCommentWrap}>                          
                              <View style={styles.avatarContainer}>
                                <Image style={styles.facebookIcon} source={require('../../assets/instagram1.png')} />
                              </View>                         
                              <View style={styles.contentContainer}>
                                <Text>Instagram</Text>
                              </View>
                              <View style={styles.likeImgContainer}>
                                  
                                  <Switch
                                      value={false}
                                      onValueChange={(val) => this.refs.ins.show()}
                                      disabled={false}
                                      activeText={'On'}
                                      inActiveText={'Off'}
                                      circleSize={20}
                                      barHeight={1}
                                      circleBorderWidth={3}
                                      backgroundActive={'gray'}
                                      backgroundInactive={'gray'}
                                      circleActiveColor={'green'}
                                      circleInActiveColor={'#ffffff'}
                                    />
                                    <Ins
                                      ref='ins'
                                      clientId='0656207d48c64a98b6dcdaac4fa8b8b1'
                                      scopes={['public_content+follower_list']}
                                      onLoginSuccess={(token) => {alert(token);}}
                                      onLoginFailure={(data)  => {alert('fail-'+data);}}
                                    />
                                    
                              </View> 

                          </View>
                          <View style={styles.imageCommentWrap}>                          
                              <View style={styles.avatarContainer}>
                               <Image style={styles.facebookIcon} source={require('../../assets/pinterest1.png')} />
                              </View>                         
                              <View style={styles.contentContainer}>
                                <Text>Pinterest</Text>
                              </View>
                              <View style={styles.likeImgContainer}>
                                  <Switch
                                      value={false}
                                      onValueChange={(val) => console.log(val)}
                                      disabled={false}
                                      activeText={'On'}
                                      inActiveText={'Off'}
                                      circleSize={20}
                                      barHeight={1}
                                      circleBorderWidth={3}
                                      backgroundActive={'gray'}
                                      backgroundInactive={'gray'}
                                      circleActiveColor={'green'}
                                      circleInActiveColor={'#ffffff'}
                                      style={{ fontSize:22,padding:20 }}
                                    />
                              </View> 

                          </View>

                          <View style={styles.nextButtonWrap}>    
                            <View style={styles.buttonContainer}>     
                              <Button
                                  style={styles.buttonStyleNext}
                                  onPress={() => { this.setModalVisibleSyncDataScreen2(!this.state.syncDataScreen2) }}
                                ><Text style={styles.buttonStyleText}>Next</Text>
                              </Button>
                            </View>
                          </View>
                            
                        </Content>
                      </Container>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <Modal
              transparent={true}
              visible={this.state.syncDataScreen2}
              presentationStyle={'overFullScreen'}
              onRequestClose={() => {this.setModalVisibleSyncDataScreen2(!this.state.syncDataScreen2)}}
            >
              <TouchableWithoutFeedback onPress={() => { this.setModalVisibleSyncDataScreen2(!this.state.syncDataScreen2) }}>
                <View style={styles.syncDatatMainView}>
                  <TouchableWithoutFeedback>
                    <View style={styles.syncDataStyle}>
                      <Container>
                        <View style={{height:'70%',width:'100%'}}>  
                          <H2 style={styles.syncDataHeader}>Screen 2</H2>
                          <View style={{width: '100%',}}>
                            <Button
                                style={{padding:20,alignItems: 'center',justifyContent: 'center'}}
                                onPress={() => { this.getPhotos() }}
                              ><Text style={styles.buttonStyleText}>Gallery</Text>
                            </Button>
                          </View>
                        </View>

                          <View style={styles.nextButtonWrapBottom}>    
                            <View style={styles.buttonContainer}>     
                              <Button
                                  style={styles.buttonStyleNext}
                                  onPress={() => { this.setModalVisibleSyncDataScreen2(!this.state.syncDataScreen2) }}
                                ><Text style={styles.buttonStyleText}>Next</Text>
                              </Button>
                            </View>
                          </View>
                      </Container>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>


            
        </View>
      ) : (
        <View>
          <Text>Loading...</Text>
        </View>
      )}
    </Container>
    );
  }

}
