import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import DataMyCourse from '../../data/DataMyCourse'
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';
import axios from 'axios'
import { ListItem, Avatar } from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign'
import YoutubePlayer from 'react-native-youtube-iframe';
import QuizeSingleChoice from "react-native-react-native-quiz-single-choice";
import EntypoIcon from 'react-native-vector-icons/Entypo'
class FlatListItemColumn extends Component {
    render() {
        return (
            <>
                <Image style={styles.imgcolumn} source={{ uri: "data:image/png;base64," + this.props.item.thumbnailImage }} />
                <View style={styles.txtwrap}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.props.item.courseName}</Text>
                    <Text >{this.props.item.hastag}</Text>
                </View>
            </>
        );
    }
}

function MyCourseScreen({ navigation }) {
    const [result, setResult] = React.useState('');
  
    React.useEffect(async () => {
        try {
            const value = await AsyncStorage.getItem('accountId');
            if (value !== null) {
                axios({
                    method: 'GET',
                    url: 'http://10.0.2.2:5001/api/GetMyCourseList?id=' + value 
                })
                    .then(res => {
                        setResult(res.data)

                    })
                    .catch(error => console.log(error))
            }
        } catch (error) {
        }
    }, [result])
    return (
        <>
        <View style={{ alignItems: 'center',}}>
                    <Text style={styles.courseDetailName}>MY COURSE</Text>     
        </View>
        <View style={styles.container}>
            <FlatList
                horizontal={false}
                data={result}
                keyExtractor={item => item.courseId}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={styles.boxMyCourse}  onPress={() => navigation.navigate('detail',
                            {
                                coursedetailId: item.courseId,
                                coursedetailImg: item.thumbnailImage,
                                coursedetailName: item.courseName,
                                coursedetailDes: item.description,
                            }
                        )}>
                            <FlatListItemColumn item={item} index={index} />
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
        </>
    )
}


class MyCourseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            coursesId: this.props.route.params.coursedetailId,
            Exam:[]
        })
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: 'http://10.0.2.2:5001/api/GetTopicByCourseId/' + this.state.coursesId
        })
            .then(res => {
                //console.log(res.data)
                this.setState({
                    Topic: res.data
                })
            })
            .catch(error => console.log(error))
        
            axios({
                method: 'GET',
                url: 'http://10.0.2.2:5001/api/GetExamQuizInfoMobile?courseId=' + this.state.coursesId
            })
                .then(resExam => {
                    //console.log(resExam.data)
                    this.setState({
                        Exam: resExam.data
                    })
                })
                .catch(error => console.log(error))
    }
    render() {
        if(this.state.Exam.length > 0){
            return (
                <>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                       <EntypoIcon name='back' size={25}/>
                    </TouchableOpacity>
                    <View style={styles.courseDetailContainer}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.courseDetailName}>{this.props.route.params.coursedetailName}</Text>
                            <Image style={styles.imgCourseDetail} source={{ uri: "data:image/png;base64," + this.props.route.params.coursedetailImg }} />
                        </View>
                        {/* <Text style={styles.coursedetailDes}>{this.props.route.params.coursedetailDes} </Text> */}
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 24,  }}>Lecture</Text>
                        </View>
                    </View>
                    <FlatList
                        style={{ paddingVertical: 10 }}
                        horizontal={false}
                        data={this.state.Topic}
                        keyExtractor={item => item.topicId}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity style={styles.topicButton} onPress={() => this.props.navigation.navigate('lessondetail',
                                        {
                                            topicId: item.topicId
                                        }
                                    )}>
                                        <FlatListItem item={item} index={index} />
                                       
                                    </TouchableOpacity>
                                </>
                            );
                        }}
                    />
                    <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, marginBottom: 5 }}>Pratice</Text>
                        </View>
                     <FlatList
                        style={{ paddingVertical: 10 }}
                        horizontal={false}
                        data={this.state.Exam}
                        keyExtractor={item => item.examQuizId}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity style={styles.topicButton} onPress={() => this.props.navigation.navigate('examdetail',
                                        {
                                            examQuizCode: item.examQuizCode
                                        }
                                    )}>
                                        <FlatListItemExam item={item} index={index} />
                                       
                                    </TouchableOpacity>
                                </>
                            );
                        }}
                    />
                </>
            )
        }
        else{
            return (
                <>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                       <EntypoIcon name='back' size={25}/>
                    </TouchableOpacity>
                    <View style={styles.courseDetailContainer}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.courseDetailName}>{this.props.route.params.coursedetailName}</Text>
                            <Image style={styles.imgCourseDetail} source={{ uri: "data:image/png;base64," + this.props.route.params.coursedetailImg }} />
                        </View>
                        {/* <Text style={styles.coursedetailDes}>{this.props.route.params.coursedetailDes} </Text> */}
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 24,  }}>Lecture</Text>
                        </View>
                    </View>
                    <FlatList
                        style={{ paddingVertical: 10 }}
                        horizontal={false}
                        data={this.state.Topic}
                        keyExtractor={item => item.topicId}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity style={styles.topicButton} onPress={() => this.props.navigation.navigate('lessondetail',
                                        {
                                            topicId: item.topicId
                                        }
                                    )}>
                                        <FlatListItem item={item} index={index} />
                                       
                                    </TouchableOpacity>
                                </>
                            );
                        }}
                    />
                </>
            )
        }
    }
}

class FlatListItem extends Component {
    render() {
        return (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center' , justifyContent:'space-between'}}>
                    <Text style={styles.topicButtonTxt}>{this.props.item.topicTitle} </Text>
                    <AntIcon  name="right" size={25} color="white" />
                </View>
            </>
        );
    }
}
class FlatListItemExam extends Component {
    render() {
        return (
            <>
                <View style={{ flexDirection: 'row', alignItems: 'center' , justifyContent:'space-between'}}>
                    <Text style={styles.topicButtonTxt}>{this.props.item.examQuizName} </Text>
                    <AntIcon  name="right" size={25} color="white" />
                </View>
            </>
        );
    }
}

class LessonScreen extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            topicId: this.props.route.params.topicId
        })
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: 'http://10.0.2.2:5001/api/GetSubtopicMobileByTopic?id=' + this.state.topicId
        })
            .then(res => {
                //console.log(res.data[0])
                this.setState({
                    Lesson: res.data
                })
            })
            .catch(error => console.log(error))
    }
    render() {
        return (
            <>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                       <EntypoIcon name='back' size={25}/>
                    </TouchableOpacity>
            <FlatList
                style={{ padding: 10 }}
                horizontal={false}
                data={this.state.Lesson}
                keyExtractor={item => item.subtopics.topicId}
                renderItem={({ item, index }) => {
                    return (
                        <FlatListItemLesson item={item} index={index} />
                    );
                }}
            />
        </>
        )
    }
}
class FlatListItemLesson extends Component {
    render() {
        return (
            <>
                <Text style={{fontSize:25,paddingVertical:5}}>{this.props.item.subtopics.subTopicTitle}</Text>
                <View>
                    <YoutubePlayer
                        height={300}
                        play={false}
                        videoId={this.props.item.videoURL}
                    />
                </View>
            </>
        );
    }
}

  class ExamScreen extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            examId: this.props.route.params.examQuizCode,
            ExamQuiz:null
        });
        
    }
    async getData(){
        await axios({
            method: 'GET',
            url: 'http://10.0.2.2:5001/api/GetExamQuizListByExamCodeMobile?examCode=' + this.state.examId
        })
            .then(async  res => {
                 //console.log(res.data)
            
                 await this.setState({
                    ExamQuiz: res.data
                })
                
            })
            .catch(error => console.log(error))
    }
     async componentDidMount() {
        await this.getData();
    }
    render(){
        if (this.state.ExamQuiz === null) {
            return(
                <View style={{backgroundColor: "#61dafb",flex:1}}></View>
            )
          } else {
            return(
                <QuizeSingleChoice
                containerStyle={{ backgroundColor: "#61dafb", paddingTop: 30 }}
                questionTitleStyle={{ fontSize: 22, color: "#FFF" }}
                responseStyle={{
                  borderRadius: 15,
                }}
                responseTextStyle={{ fontSize: 12, fontWeight: "normal" }}
                selectedResponseStyle={{
                  borderRadius: 15,
                  backgroundColor: "#fa5541",
                }}
                selectedResponseTextStyle={{
                  fontSize: 14,
                  fontWeight: "normal",
                }}
                responseRequired={true}
                nextButtonText={"Next"}
                nextButtonStyle={{ backgroundColor: "#06d755" }}
                nextButtonTextStyle={{ color: "#FFF" }}
                prevButtonText={"Prev"}
                prevButtonStyle={{ backgroundColor: "#fa5541" }}
                prevButtonTextStyle={{ color: "#FFF" }}
                endButtonText={"Done"}
                endButtonStyle={{ backgroundColor: "#000" }}
                endButtonTextStyle={{ color: "#FFF" }}
                buttonsContainerStyle={{ marginTop: "auto" }}
                onEnd={(results) => {
                    console.log(results)
                  this.props.navigation.navigate('resultexam',
                  {name:results[0].answer})
                }}
                data={this.state.ExamQuiz}
              />
            )
          }
    }
}
class ResultExam extends Component{
    render(){
        return(
            <>
            <Text>Ket qua</Text>
            <TouchableOpacity onPress={() => this.props.navigation.popToTop()}>
                <Text>button</Text>
            </TouchableOpacity>
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
                <Stack.Screen name="MyCourse" component={MyCourseScreen} />
                <Stack.Screen name="detail" component={MyCourseDetail} />
                <Stack.Screen name="lessondetail" component={LessonScreen} />
                <Stack.Screen name="examdetail" component={ExamScreen} />
                <Stack.Screen name="resultexam" component={ResultExam} />
            </Stack.Navigator>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20,

    },
    txt: {
        padding: 20,
        fontWeight: 'bold',
        fontSize: 20,

    },
    imgcolumn: {
        width: 100,
        height: 100,
        margin: 5,

    },
    txtwrap: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 8
    },
    btnkb: {
        width: 100,
        height: 50,
        backgroundColor: '#bbf',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginRight: 10
    },
    boxMyCourse: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#cfcfcf',
        marginBottom: 12,
        borderRadius: 10
    },
    courseDetailContainer: {
        padding: 10
    },
    imgCourseDetail: {
        width: 370,
        height: 170
    },
    courseDetailName: {
        fontSize: 35,
        fontWeight: '900',
        marginBottom: 10
    },
    coursedetailDes: {
        fontSize: 18,
        opacity: 0.7,
        marginVertical: 10
    },
    topicButton: {
        padding: 20,
        backgroundColor: '#747678',
        marginVertical: 5
    },
    topicButtonTxt: {
        color: '#fff'
    }
})
