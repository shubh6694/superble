import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import { Container, Header, Button, Card, CardItem, Icon, CheckBox, Left, Right } from 'native-base';
 
export default class Mybadges extends React.Component {
    
    static navigationOptions = ({ navigation, screenProps }) => ({
        header:null
	});	

	render() {
        return (
	    	<Container style={{flex:1}}>

                <Header>
                    <Text> Images will be here </Text>
                </Header>

                <Card>
                    <CardItem>
                        <Text>Email address</Text>
                    </CardItem>

                    <CardItem>
                        <Text> Description </Text>
                    </CardItem>
                    
                    <CardItem>
                        <Text> Welcome! Don't waste time and start collection points. Quick trick: like_count 20 products, upload 5 new or invite 10 friends! </Text>
                    </CardItem>
                </Card>

                <Card>
                    <CardItem>
                        <Left>
                            <Text> Current points </Text>
                        </Left>
                        <Right>
                            <Text> 0 </Text>
                        </Right>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Text> Points to next badge </Text>
                        </Left>
                        <Right>
                            <Text> 25 </Text>
                        </Right>
                    </CardItem>
                </Card>

            </Container>
		);
	}
}

const styles = StyleSheet.create({

})