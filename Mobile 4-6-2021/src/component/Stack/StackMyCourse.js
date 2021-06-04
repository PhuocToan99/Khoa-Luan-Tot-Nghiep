import React, { Component } from 'react'
import { Text, View,StyleSheet,Image, ScrollView, ImageBackground,FlatList, TouchableOpacity } from 'react-native'
import DataMyCourse from '../../data/DataMyCourse'
import { createStackNavigator } from '@react-navigation/stack';
class FlatListItemColumn extends Component{
    render(){
        return(
            <>
                <Image style={styles.imgcolumn} source={{uri:this.props.item.imgdata}}></Image>
                <View style={styles.txtwrap}>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>{this.props.item.name}</Text>
                    <Text >{this.props.item.instructor}</Text>
                </View>
           </>
            
            
        );
    }
}
function MyCourseScreen({navigation}) {
        return (
            <View style={styles.container}>
                <FlatList
                horizontal={false}
                data={DataMyCourse}
                renderItem={({item,index})=>{
                return(
                    <TouchableOpacity style={styles.boxMyCourse} onPress={() => navigation.push('detail')}>
                    <FlatListItemColumn item={item} index={index}/>
                    </TouchableOpacity>
                    
                );
                }}
            />
            </View>
        )
    }


const Stack = createStackNavigator();
    export default class StackHome extends Component {
        render() {
            return (
                
                    <Stack.Navigator>
                        <Stack.Screen name="MyCourse" component={MyCourseScreen} />
                        <Stack.Screen name="detail" component={View} />
                    </Stack.Navigator>
            )
        }
    }

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        paddingHorizontal:20,
        
    },
    txt:{
        padding:20,
        fontWeight:'bold',
        fontSize:20,
        
    },
    imgcolumn:{
        width:100,
        height:100,
        margin:5,
       
    },
    txtwrap:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        paddingLeft:8
    },
    btnkb:{
        width:100,
        height:50,
        backgroundColor:'#bbf',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50,
        marginRight:10
    },
    boxMyCourse:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'#cfcfcf',
        marginBottom:12,
        borderRadius:10
    }
})
