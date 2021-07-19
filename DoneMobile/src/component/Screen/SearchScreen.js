import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Input, TouchableOpacity, Image, ScrollView, Dimensions, StatusBar, Modal } from 'react-native'
import IconSearch from 'react-native-vector-icons/FontAwesome';
import TopCourseData from '../../data/TopCourseData'
import { Search } from '../../assets/index'
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios'
import { createStackNavigator } from '@react-navigation/stack';
import { AirbnbRating } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import Moment from 'moment';
import { AsyncStorage } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const SearchScreen = ({ props }) => {
  const [search, setSearch] = React.useState('');
  const [filteredDataSource, setFilteredDataSource] = React.useState([]);
  const [masterDataSource, setMasterDataSource] = React.useState([]);
  const navigation = useNavigation()
  React.useEffect(() => {

    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const value = await AsyncStorage.getItem('accountId');
        console.log("search");
        fetch('http://10.0.2.2:5001/api/GetCourseNonBuyList?accountId=' + value)
          .then((response) => response.json())
          .then((responseJson) => {
            setFilteredDataSource(responseJson);
            setMasterDataSource(responseJson);
            setSearch('');
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
      }
    });
    return unsubscribe;
  }, [navigation]);



  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(item => {
        // Applying filter for the inserted text in search bar
        const itemData = item.courseName
          ? item.courseName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        console.log(itemData.indexOf(textData) > -1)
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />
      <View style={styles.header}>
        <TextInput
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
          placeholderTextColor="#707070"
          style={styles.input}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredDataSource}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity style={styles.bookContainer} onPress={() => navigation.navigate('detail',
              {
                courseDetailId: item.courseId,
                courseName: item.courseName,
                courseImg: item.thumbnailImage,
                courseDes: item.description,
                courseNameInstructor: item.courseDuration,
                courseCreate: item.startDate,
                priceCourse: item.price,
                courseRating: item.rating,
                instructorId: item.accountId
              }
            )}>
              <Image style={styles.image} source={{ uri: "data:image/png;base64," + item.thumbnailImage }} />
              <View style={styles.dataContainer}>
                <Text style={styles.title}>
                  {item.courseName}
                </Text>

                <Text style={styles.author}>{item.hastag}</Text>
                <Text style={styles.txtPirce}>{item.price} USD</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  )
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
class CourseDetail extends Component {
  state = {
    showModal: false,
    status: "Pending"
  };
  handleResponse = async data => {
    if (data.title === "success") {
      this.setState({ showModal: false, status: "Complete" })
      await this.buyCourse();
      await this.props.navigation.goBack();
      alert('Buy success');
    } else if (data.title === "cancel") {
      this.setState({ showModal: false, status: "Cancelled" });
    } else {
      return;
    }
  };

  async buyCourse() {
    try {
      const value = await AsyncStorage.getItem('accountId');
      var result = ' ';
      const charactersLength = characters.length;
      for (let i = 0; i < 6; i++) {
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
            'paymentMethod': "Paypal"
          }
        )
          .then(res => {
            axios.post(
              'http://10.0.2.2:5001/api/AddAccountInCourse',
              {
                'accountId': this.props.route.params.instructorId,
                'courseId': this.props.route.params.courseDetailId,
                'isBought': false,
                'getPayment': true,
                'invoiceCode': result,
                'createdDate': invoiceDateTime,
                'paymentMethod': "Paypal"
              }
            )
              .then(async res => {
                // this.props.navigation.goBack();

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
            <Text style={{ fontSize: 25, marginRight: 5, color: 'orange' }}>({rating}.0)</Text>
            <AirbnbRating
              count={5}
              size={25}
              showRating={false}
              isDisabled={true}
              defaultRating={this.props.route.params.courseRating}
            />
          </View>
          <Text style={{ fontSize: 20 }}>Duration: {this.props.route.params.courseNameInstructor}</Text>
          <Text style={styles.detailPrice}>Total Cost: {this.props.route.params.priceCourse} USD</Text>
          <TouchableOpacity style={styles.btnBuyNow} onPress={() => this.setState({ showModal: true })}>
            <Text style={styles.txtBuyNow}>Buy Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSearch} onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.txtSearch}>Back to Search</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Modal
            visible={this.state.showModal}
            onRequestClose={() => this.setState({ showModal: false })}
          >
            <WebView
              source={{
                uri: "http://10.0.2.2:3000",
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
export default class StackScreen extends Component {
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="detail" component={CourseDetail} />
      </Stack.Navigator>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 45,
    width: '90%',
    backgroundColor: '#ccc',
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,
  },
  bookContainer: {
    flexDirection: 'row',
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff'
  },
  image: {
    height: 100,
    width: 150,
  },
  dataContainer: {
    padding: 10,
    paddingTop: 5,
    width: 250,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: 'gray',
  },
  author: {
    fontSize: 16,
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
    marginVertical: 10,
    borderRadius: 10
  },
  txtBuyNow: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',

  },
  imgHome: {
    height: 150,
    width: 350,
    borderRadius: 20
  },
  btnSearch: {
    backgroundColor: '#c3c3c3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  txtSearch: {
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  txtPirce: {
    fontSize: 15,
    fontWeight: 'bold'
},
})
