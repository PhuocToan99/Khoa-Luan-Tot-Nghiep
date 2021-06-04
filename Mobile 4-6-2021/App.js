import * as React from 'react';
import { Button, Text, TextInput, View,StyleSheet,Image,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import StackHome from './src/component/Stack/StackHome'
import StackMyCourse from './src/component/Stack/StackMyCourse'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {people,onlinestudy} from './src/assets/index'
import IconTab from 'react-native-vector-icons/FontAwesome';
import SearchScreen from './src/component/Screen/SearchScreen'
import axios from 'axios'
const AuthContext = React.createContext();
function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
function SingUpScreen({navigation}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const { signIn } = React.useContext(AuthContext);
  return(
    <View >
      <View style={styles.imgContainer}>
      <Image style={styles.imgSignIn} source={onlinestudy}/>
      </View>
      <View style={styles.singInInfoContainer}>
      <TextInput
        style={styles.inputSingIn}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.inputSingIn}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.inputSingIn}
        placeholder="Comfirm Password"
        value={password2}
        onChangeText={setPassword2}
        secureTextEntry
      />
      <TouchableOpacity  onPress={() => signIn({ username, password })}>
              <View style={styles.btnSignIn} >
                  <Text style={styles.btnTxt}>Sign Up</Text>
              </View>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => navigation.navigate('SignIn')}>
              <View style={styles.btnSignIn} >
                  <Text style={styles.btnTxt}>Go back to Login</Text>
              </View>
      </TouchableOpacity>
      </View>
    </View>
  )
}
function AccountScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  
  return (
      <View style={styles.container}> 
          <View style={styles.accountInfo}>
          <Image style={styles.imageAccount} source={people}/>
          <Text style={styles.textInfo}>Tran Ngoc Hung</Text>
          <View style={styles.boxEmail}>
          <Icon name="email" size={25} color="red" style={{paddingTop:8,paddingRight:5}}></Icon>
          <Text style={styles.emailInfo}>tranngochung2109@gmail.com</Text>
          </View>
          <TouchableOpacity  onPress={signOut}>
              <View style={styles.btnLogOut} >
                  <Text style={styles.btnTxt}>Sign Out</Text>
              </View>
          </TouchableOpacity>
          </View>
      </View>
  )
}

function SignInScreen({navigation}) {
  axios({
    method: 'post',
    url:'http://10.0.2.2:5001/api/Signin',
    data: {
      username: 'chicong',
      password: 'Chicong123*'
    }
  })
  .then(res =>{
    console.log(res.data)
    // this.setState({
    //     courses:res.data
    // })
})
.catch (error =>console.log(error))
   const [username, setUsername] = React.useState('');
   const [password, setPassword] = React.useState('');
   const { signIn } = React.useContext(AuthContext);
   return (
    
     <View >
       <View style={styles.imgContainer}>
       <Image style={styles.imgSignIn} source={onlinestudy}/>
       </View>
       <View style={styles.singInInfoContainer}>
       <TextInput
         style={styles.inputSingIn}
         placeholder="Username"
         value={username}
         onChangeText={setUsername}
       />
       <TextInput
         style={styles.inputSingIn}
         placeholder="Password"
         value={password}
         onChangeText={setPassword}
         secureTextEntry
       />
      <TouchableOpacity  onPress={() => signIn({ username, password })}>
               <View style={styles.btnSignIn} >
                   <Text style={styles.btnTxt}>Sign In</Text>
               </View>
       </TouchableOpacity>
       <TouchableOpacity  onPress={() => navigation.navigate('SignUp')}>
               <View style={styles.btnSignIn} >
                   <Text style={styles.btnTxt}>Sign up</Text>
               </View>
       </TouchableOpacity>
       </View>
     </View>
   );
 }
const Stack = createStackNavigator();
export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
       // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );
  const Tab = createBottomTabNavigator();
  function TabBt() { 
        return (
                <Tab.Navigator
                tabBarOptions={{
                  keyboardHidesTabBar: true,
                    labelStyle:{
                        fontSize:15
                    },
                }}
                >
                    <Tab.Screen 
                    name="Home" 
                    component={StackHome}
                    options={{
                        tabBarIcon:({color})=><IconTab name='home' size={25} color={color}/>
                    }}
                    />
                    <Tab.Screen 
                    name="Search" 
                    component={SearchScreen}
                    options={{
                        tabBarIcon:({color})=><IconTab name='search' size={25} color={color}/>
                    }}
                    />
                    <Tab.Screen 
                    name="MyCourse" 
                    component={StackMyCourse}
                    options={{
                        tabBarIcon:({color})=><IconTab name='play-circle' size={25} color={color}/>
                    }}
                    />
                    <Tab.Screen 
                    name="Account" 
                    component={AccountScreen}
                    options={{
                        tabBarIcon:({color})=><IconTab name='user' size={25} color={color}/>
                    }}
                    />
                </Tab.Navigator>
        )
    }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
          headerShown: false}}
        >
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen name="SignUp" component={SingUpScreen} />
          </>
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={TabBt} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
  const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        paddingVertical:20
    },
    accountInfo:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    imageAccount:{
        width:150,
        height:150,
        borderRadius:80,
        borderWidth:2,
        borderColor:'#fff'
    },
    textInfo:{
        fontWeight:'bold',
        fontSize:25
    },
    emailInfo:{
        marginVertical:10,
        opacity:0.8,
        fontSize:15,
    },
    boxEmail:{
        flexDirection:'row',
        paddingVertical:10
    },
    btnLogOut:{
        width:200,
        height:50,
        backgroundColor:'#2596be',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8
    },
    btnTxt:{
        fontSize:20,
        color:'white',
        fontWeight:'bold'
    },
    imgContainer:{
      paddingHorizontal:20,
      paddingVertical:20,
      alignItems:'center',
      justifyContent:'center'
      
    },
    imgSignIn:{
      height:200,
      width:200,
    },
    singInInfoContainer:{
      paddingHorizontal:20,
      alignItems:'center'
    },
    btnSignIn:{
      width:300,
      height:50,
      backgroundColor:'#2596be',
      justifyContent:'center',
      alignItems:'center',
      margin:5,
      borderRadius:10
    },
    inputSingIn:{
      height:50,
      width:300,
      borderColor:"#cfcfcf",
      borderWidth:2,
      margin:8,
      borderRadius:8,
    }
})

