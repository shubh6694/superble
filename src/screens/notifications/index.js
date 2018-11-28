import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import { Container, Header, Button, Card, CardItem, Icon, CheckBox, Left, Right } from 'native-base';
 
export default class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          navigate: this.props.navigation.navigate,
        };
    }
    static navigationOptions = (navigation)=> ({
        title: 'Notifications',
        headerLeft: <Icon style={{marginLeft:15}} name="ios-arrow-round-back" onPress={(navigation)=> {

            Alert.alert(
                '',
                'Do you want to go back without saving?',
                [
                  {text: 'NO', style: 'cancel'},
                  {text: 'YES', onPress: (navigation) => this.goBack()},
                ],
                { cancelable: true }
              )
        }} />
    });
    goBack = () => {
        this.props.navigation.navigate('Settings')
    }
	render() {
        return (
	    	<Container style={{flex:1}}>
                <Card style={{flex:3}}>
                    <CardItem>
                        <Text style={styles.title}> Push Notifications </Text>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Text> Enable Notifications </Text>
                        </Left>
                        <Right style={styles.checkbox}>
                            <CheckBox />
                        </Right>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Text> RingTone </Text>
                        </Left>
                        <Right style={styles.checkbox}>
                            <CheckBox />
                        </Right>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Text> Vibrate </Text>
                        </Left>
                        <Right style={styles.checkbox}>
                            <CheckBox />
                        </Right>
                    </CardItem>                    
                </Card>

                <Card style={{flex:7}}>
                    <CardItem>
                        <Left>
                            <Text style={styles.title}> Points and Badges </Text>
                        </Left>
                        <Right>
                            <Icon name="md-phone-portrait" />
                        </Right>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Text> I unlocked a new badge </Text>
                        </Left>
                        <Right style={styles.checkbox}>
                            <CheckBox />
                        </Right>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Text> I am half way to a new badge </Text>
                        </Left>
                        <Right style={styles.checkbox}>
                            <CheckBox />
                        </Right>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Text> I am close to a new badge </Text>
                        </Left>
                        <Right style={styles.checkbox}>
                            <CheckBox />
                        </Right>
                    </CardItem>                    

                    <CardItem>
                        <Left>
                            <Text> I am very close to a new badge </Text>
                        </Left>
                        <Right style={styles.checkbox}>
                            <CheckBox />
                        </Right>
                    </CardItem>                    

                <View style={{position: 'absolute', bottom: 0, width:'100%'}}> 
                    <Button
                        block
                        style={{backgroundColor:'#c19c1b'}}
                        onPress={()=> alert('in dev')}
                    >
                        <Text style={{color: '#fff'}}> SAVE </Text>
                    </Button>
                </View>
                </Card>
            </Container>
		);
	}
}

const styles = StyleSheet.create({
    title:{
        color:'#7c6001',
    },
    checkbox:{
        paddingRight:5,
    }
})