import React, { useContext } from 'react'
import { Feather, AntDesign } from '@expo/vector-icons'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/Main/Home'
import ProfileScreen from '../screens/Main/Profile'
import SignUpScreen from '../screens/Auth/SignUp'
import LoginScreen from '../screens/Auth/Login'
import { BASE_COLOR } from '../utilities/baseColor'
import NotificationScreen from '../screens/Stack/Notification'
import { RootContext } from '../utilities/rootContext'
import { ContextApiTypes } from '../types'
import { heightPercentage } from '../utilities/dimension'

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
  const { userInfo } = useContext<ContextApiTypes>(RootContext)
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

      {userInfo.isAuth && (
        <>
          <Tab.Screen
            name='Profile'
            options={{ tabBarLabel: 'Profile' }}
            component={ProfileScreen}
          />
        </>
      )}
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
  const { userInfo } = useContext<ContextApiTypes>(RootContext)

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName='Main'
        screenOptions={{
          headerTitleStyle: { fontFamily: 'lato', color: BASE_COLOR.text.primary }
        }}
      >
        <Stack.Screen
          name='Main'
          component={TabNavigation}
          options={{
            headerShown: false
          }}
        />
        {userInfo.isAuth && (
          <>
            <Stack.Screen name='Notification' component={NotificationScreen} />
          </>
        )}
        {!userInfo.isAuth && (
          <>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
