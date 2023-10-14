import React, { useEffect, useState } from 'react'
import { Feather, AntDesign } from '@expo/vector-icons'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/Home'
import ProfileScreen from '../screens/Profile'
import SignUpScreen from '../screens/SignUp'
import LoginScreen from '../screens/Login'
import { BASE_COLOR } from '../utilities/baseColor'
import NotificationScreen from '../screens/Notification'
import { heightPercentage } from '../utilities/dimension'
import { useAppContext } from '../context/app.context'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseConfigs } from '../configs'
import { FirestoreDB } from '../firebase/firebaseDB'
import { COLLECTION, IUserModel } from '../models'
import { StatusBar, View } from 'react-native'
import { Text } from 'native-base'

export type RootParamList = {
  Main: undefined
  Home: undefined
  Profile: undefined
  Login: undefined
  SignUp: undefined
  Notification: undefined
}

const Tab = createBottomTabNavigator<RootParamList>()

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { minHeight: heightPercentage(7) },
        headerTitleStyle: { fontFamily: 'lato', color: BASE_COLOR.text.primary },
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case 'Home':
              return <Feather name='home' size={24} color={color} />
            case 'Profile':
              return <AntDesign name='user' size={30} color={color} />
            default:
              break
          }
        },
        tabBarActiveTintColor: BASE_COLOR.primary,
        tabBarInactiveTintColor: BASE_COLOR.gray
      })}
    >
      <Tab.Screen
        name='Home'
        options={{ tabBarLabel: 'Beranda' }}
        component={HomeScreen}
      />

      <Tab.Screen
        name='Profile'
        options={{ tabBarLabel: 'Profile' }}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  )
}

const Stack = createNativeStackNavigator<RootParamList>()

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 85)'
  }
}

export default function AppNavigations() {
  const { currentUser, setCurrentUser, setDevice } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(firebaseConfigs.auth, (user) => {
      ;(async () => {
        if (user) {
          const userDb = new FirestoreDB(COLLECTION.USERS)
          const userData: IUserModel = await userDb.getDocument({
            documentId: user.email + ''
          })
          userData.userAuthentication = true
          console.log(userData)
          setCurrentUser(userData)
        }

        if (!user) {
          const userData: IUserModel = {
            userAuthentication: false,
            userEmail: '',
            userName: '',
            userId: '',
            userPassword: ''
          }
          setCurrentUser(userData)
        }

        const appInfoDB = new FirestoreDB(COLLECTION.APP)

        setIsLoading(false)
      })()
    })
  }, [])

  if (isLoading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFF'
        }}
      >
        <Text style={{ color: BASE_COLOR.text.primary }}>Loading...</Text>
        <StatusBar barStyle='default' backgroundColor='#FFF' />
      </View>
    )

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName='Main'
        screenOptions={{
          headerTitleStyle: { fontFamily: 'lato', color: BASE_COLOR.text.primary }
        }}
      >
        {currentUser.userAuthentication && (
          <>
            <Stack.Screen
              name='Main'
              component={TabNavigation}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen name='Notification' component={NotificationScreen} />
          </>
        )}
        {!currentUser.userAuthentication && (
          <>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
