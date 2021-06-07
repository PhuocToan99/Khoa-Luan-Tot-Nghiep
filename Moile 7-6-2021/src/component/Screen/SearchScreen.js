import React, { Component } from 'react'
import { Text, View,StyleSheet, TextInput,Input,FlatList,TouchableOpacity,Image, ScrollView } from 'react-native'
import IconSearch from 'react-native-vector-icons/FontAwesome';
import TopCourseData from '../../data/TopCourseData'
import {Search} from '../../assets/index'
class FlatListItemRow extends Component {
    render(){
        return(
            <>
            
                <Image style={styles.imgTopCourse} source={{uri:this.props.item.imgdata}}/>
                <Text style={styles.imgTxt}>{this.props.item.name}</Text>
                <Text style={styles.instructorTxt}>{this.props.item.instructor}</Text>
                <Text style={styles.imgTxt}>{this.props.item.price} USD</Text>
            
            </>
        );
    }
}
export default class SearchScreen extends Component {
    render() {
        return (      
        <View style={styles.searchScreenContainer}>
            <View style={styles.containerSearchBar}>
                <TextInput
                style={styles.inputSerch}
                placeholder="Search"
                >
                </TextInput>
                <View style={styles.boxSearchIcon}>
                <IconSearch name='search' size={20}/>
                </View>
            </View>
            <View style={styles.topImgSearch}>
                <Image style={styles.imgTopSearch} source={Search}/>
                <Text style={styles.DicoverTxt}>Discover Courses</Text>
                <Text>Try dicovering new courses with search or </Text>
                <Text>browse our categories</Text>
            </View>
            <View style={styles.topSearch}>
                <Text style={styles.topSearchTxt}>Top Search</Text>
                <View style={styles.topcontainer}>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>python</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>java</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>javascript</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>excel</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.topcontainer}>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>react</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>sql</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>aws</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>unity</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.topcontainer}>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>wordpress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>c#</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>photoshop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boxTopSearch}>
                        <Text>php</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.topSearchTxt}> Top Search Course</Text>
                <View style={styles.container}>
                    <FlatList
                    horizontal={true}
                    data={TopCourseData}
                    renderItem={({item,index})=>{
                    return(
                        <TouchableOpacity style={styles.boxImage} >
                            <FlatListItemRow item={item} index={index} />
                        </TouchableOpacity>
                    );
                    }}
                    />
                </View>
        </View>
        
        )
    }
}
 
const styles = StyleSheet.create({
    inputSerch:{
        height:50,
        width:300,
        borderColor:"#cfcfcf",
        borderWidth:2,
        borderRadius:8,
    },
    containerSearchBar:{
        flexDirection:'row'
    },
    boxSearchIcon:{
        backgroundColor:'#cfcfcf',
        height:50,
        width:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        marginLeft:5
    },
    searchScreenContainer:{
        paddingVertical:20,
        paddingHorizontal:20
    },
    boxTopSearch:{
        width:80,
        height:40,
        backgroundColor:'#d8d8d8',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    topcontainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginVertical:5
    },
    topSearchTxt:{
        fontSize:22,
        fontWeight:'bold',
        marginVertical:10
    },
    imgTopCourse:{
        height:150,
        width:230,
        borderRadius:20
    },
    imgTxt:{
        fontSize:15,
        fontWeight:'bold'
    },
    instructorTxt:{
        color:'#33334d'
    },
    boxImage:{
        width:250,
        flexWrap:'nowrap',
        
    },
    imgTopSearch:{
        height:100,
        width:100
    },
    topImgSearch:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:20
    },
    DicoverTxt:{
        fontSize:25,
        fontWeight:'bold'
    }
})
