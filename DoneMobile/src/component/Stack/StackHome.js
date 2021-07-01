import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, ImageBackground, FlatList, TouchableOpacity,Modal } from 'react-native'
import { hero } from '../../assets/index'
import Icon1 from 'react-native-vector-icons/Entypo'
import DataHome from '../../data/DataHome'
import DataFreeCourse from '../../data/DataFreeCourse'
import DataCategory from '../../data/DataCategory'
import { createStackNavigator } from '@react-navigation/stack'
import { getCourseFromSever } from '../../networking/Server'
import axios from 'axios'
import { getCourse } from '../../data/DataCourse'
import { AirbnbRating } from 'react-native-elements';
import { AsyncStorage } from 'react-native';
import { WebView } from 'react-native-webview';
import Moment from 'moment';

class FlatListItemRow extends Component {
    render() {


        return (

            <>


                <Image style={styles.imgHome} source={{ uri: "data:image/png;base64," + this.props.item.thumbnailImage }} />
                <Text style={styles.imgTxt}>{this.props.item.courseName}</Text>
                <Text style={styles.instructorTxt}>{this.props.item.courseDuration}</Text>
                <Text style={styles.imgTxt}>{this.props.item.price} USD</Text>

            </>
        );
    }
}

class FlatListItemRowFree extends Component {
    render() {
        return (
            <>
                <Image style={styles.imgHome} source={{ uri: "data:image/png;base64," + this.props.item.course.thumbnailImage }} />
                <Text style={styles.imgTxt}>{this.props.item.course.courseName}</Text>
                <Text style={styles.instructorTxt}>{this.props.item.course.courseDuration}</Text>
                <Text style={styles.imgTxt}>{this.props.item.course.price} USD</Text>

            </>
        );
    }
}

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            courses: []
        })
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: 'http://10.0.2.2:5001/api/GetCourseList'
        })
            .then(res => {
                //console.log(res.data[0].courseId)
                this.setState({
                    courses: res.data
                })
            })
            .catch(error => console.log(error))

        axios({
            method: 'GET',
            url: 'http://10.0.2.2:5001/api/TopCourses'
        })
            .then(resTop => {
                //console.log(resTop.data[0].courseId)
                this.setState({
                    coursesTop: resTop.data
                })
            })
            .catch(error => console.log(error))

        axios({
            method: 'GET',
            url: 'http://10.0.2.2:5001/api/GetTop6CourseDesktop?option=1'
        })
            .then(resFree => {
                //console.log(resFree.data)
                this.setState({
                    coursesFree: resFree.data
                })
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <ImageBackground style={styles.backgroundTop} source={hero}>
                        <Text style={styles.imgTopTxt}>Study worldwide</Text>
                        <Text style={styles.imgTopTxt}>Find your future</Text>
                    </ImageBackground>
                    <Text style={styles.txt}> Featured</Text>
                    <View style={styles.container}>
                        <FlatList
                            horizontal={true}
                            data={this.state.coursesTop}
                            keyExtractor={item => item.courseId}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.boxImage} onPress={() => this.props.navigation.navigate('detail',
                                        {
                                            courseName: item.courseName,
                                            courseImg: item.thumbnailImage,
                                            courseDes: item.description,
                                            courseNameInstructor: item.courseDuration,
                                            courseCreate: item.startDate,
                                            priceCourse: item.price,
                                            courseRating:item.rating,
                                            courseDetailId: item.courseId,
                                            instructorId:item.accountId
                                        }
                                    )}>
                                        <FlatListItemRow item={item} index={index} />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                    <Text style={styles.txt}> Free Course</Text>
                    <View style={styles.container}>
                        <FlatList
                            horizontal={true}
                            data={this.state.coursesFree}
                            keyExtractor={item => item.course.courseId}
                            // data = {this.state.courseFromSever}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.boxImage} onPress={() =>
                                        this.props.navigation.navigate('detail', {
                                            courseName: item.course.courseName,
                                            courseImg: item.course.thumbnailImage,
                                            courseDes: item.course.description,
                                            courseNameInstructor: item.course.courseDuration,
                                            courseCreate: item.course.startDate,
                                            priceCourse: item.course.price,
                                            courseRating:item.course.rating,
                                            courseDetailId: item.course.courseId,
                                            instructorId:item.course.accountId
                                        })}>
                                        <FlatListItemRowFree item={item} index={index} />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                    <Text style={styles.txt}> Category</Text>
                    <View style={styles.container}>
                        <FlatList
                            horizontal={true}
                            data={this.state.courses}
                            keyExtractor={item => item.courseId}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.boxImage}
                                        onPress={() =>
                                            this.props.navigation.navigate('detail', {
                                                courseName: item.courseName,
                                                courseImg: item.thumbnailImage,
                                                courseDes: item.description,
                                                courseNameInstructor: item.courseDuration,
                                                courseCreate: item.startDate,
                                                priceCourse: item.price,
                                                courseRating:item.rating,
                                                courseDetailId: item.courseId,
                                                instructorId:item.accountId
                                            })}>
                                        <FlatListItemRow item={item} index={index} />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
class CourseDetail extends Component {
    state = {
        showModal: false,
        status: "Pending"
    };
    handleResponse = async data => {
        if (data.title === "success") {
            this.setState({ showModal: false, status: "Complete" })
            await this.buyCourse();
            this.props.navigation.navigate('HomeScreen');
        } else if (data.title === "cancel") {
            this.setState({ showModal: false, status: "Cancelled" });
        } else {
            return;
        }
    };

    async buyCourse(){
        try {
            const value = await AsyncStorage.getItem('accountId');
            var result = ' ';
            const charactersLength = characters.length;
            for ( let i = 0; i < 6; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            var date = new Date();
            var invoiceDateTime = Moment(date).format("YYYY-MM-DD HH:mm:ss");
            console.log(invoiceDateTime);
            if (value !== null) {
                axios.post(
                    'http://10.0.2.2:5001/api/AddAccountInCourse',
                    {
                      'accountId': value,
                      'courseId': this.props.route.params.courseDetailId,
                      'isBought': true,
                      'getPayment': false,
                      'invoiceCode': result,
                      'createdDate': invoiceDateTime,
                      'paymentMethod':"Paypal"
                    }
                  )
                    .then(res => {
                        axios.post(
                            'http://10.0.2.2:5001/api/AddAccountInCourse',
                            {
                              'accountId':  this.props.route.params.instructorId,
                              'courseId': this.props.route.params.courseDetailId,
                              'isBought': false,
                              'getPayment': true,
                              'invoiceCode': result,
                              'createdDate': invoiceDateTime,
                              'paymentMethod':"Paypal"
                            }
                          )
                            .then(async res => {
                                // this.props.navigation.goBack();
                                alert('Buy success');
                            })
                            .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
            }
        } catch (error) {
        }
    }
    render() {
        const rating = Math.floor(this.props.route.params.courseRating)
        return (
            <>
            <View style={{ flex: 1, padding: 5 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.detailCourseName}>{this.props.route.params.courseName}</Text>
                    <Image style={styles.imgHome} source={{ uri: "data:image/png;base64," + this.props.route.params.courseImg }} />
                </View>
                <Text style={styles.detailCoursDes}>{this.props.route.params.courseDes}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, marginRight: 5,color:'orange' }}>({rating}.0)</Text>
                    <AirbnbRating
                        count={5}
                        size={25}
                        showRating={false}
                        isDisabled={true}
                        defaultRating={this.props.route.params.courseRating}
                    />
                </View>
                <Text style={{fontSize:20}}>Duration: {this.props.route.params.courseNameInstructor}</Text>
                <Text style={styles.detailPrice}>Total Cost: {this.props.route.params.priceCourse}</Text>
                <TouchableOpacity style={styles.btnBuyNow} onPress={() => this.setState({ showModal: true })}>
                    <Text style={styles.txtBuyNow}>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSearch} onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.txtSearch}>Back to Home</Text>
                </TouchableOpacity>
            </View>
            <View>
              <Modal
                  visible={this.state.showModal}
                  onRequestClose={() => this.setState({ showModal: false })}
              >
                  <WebView
                      source={{ uri: "http://10.0.2.2:3000",
                      headers: { 
                        'Access-Control-Allow-Methods': '*', 
                        'Access-Control-Allow-Origin': '*' 
                       }
                     }}
                      onNavigationStateChange={data =>
                          this.handleResponse(data)
                      }
                       injectedJavaScript={`document.f1.submit()`}
                  />
              </Modal>
          </View>
          </>
        )
    }
}












const Stack = createStackNavigator();
export default class StackHome extends Component {

    render() {
        return (
            <Stack.Navigator 
            screenOptions={{
                headerShown: false
              }}
            >
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="detail" component={CourseDetail} />
            </Stack.Navigator>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10
    },
    backgroundTop: {
        height: 200,
        justifyContent: 'center',
        paddingLeft: 30
    },
    imgTopTxt: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',

    },
    imgHome: {
        height: 150,
        width: 230,
        borderRadius: 20
    },
    boxImage: {
        width: 250,
        flexWrap: 'nowrap',
        paddingLeft: 20
    },
    imgTxt: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    instructorTxt: {
        color: '#33334d'
    },
    txt: {
        paddingLeft: 20,
        fontSize: 25,
        fontWeight: "bold"
    },
    detailCourseName: {
        fontSize: 35,
        fontWeight: 'bold',
    },
    detailCoursDes: {
        fontSize: 20,
        fontWeight: '600',
        opacity: 0.7
    },
    detailPrice: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    btnBuyNow: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:10,
        borderRadius:10
    },
    txtBuyNow: {
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        
    },
    btnSearch:{
        backgroundColor: '#c3c3c3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10
    },
    txtSearch:{
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    }
})
