import React, { useEffect, useState } from 'react'
import AppNavigations from './apps/navigations'
import { NativeBaseProvider, extendTheme } from 'native-base'
import { StatusBar, Text, View } from 'react-native'
import { RootContext } from './apps/utilities/rootContext'
import { useFonts } from 'expo-font'
import NetInfo from '@react-native-community/netinfo'
import { onAuthStateChanged } from 'firebase/auth'

import { LogBox } from 'react-native'
import _ from 'lodash'
import NotInternetAnimation from './apps/components/animations/Ofline'
import { FirestoreDB } from './apps/firebase/firebaseDB'
import MaintenanceAnimation from './apps/components/animations/Maintenance'
import { BASE_COLOR } from './apps/utilities/baseColor'

import 'expo-dev-client'
import { COLLECTION, IAppModel, IUserModel } from './apps/models'
import { firebaseConfigs } from './apps/configs'

LogBox.ignoreLogs(['Warning:...'])
LogBox.ignoreAllLogs()
const _console = _.clone(console)
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message)
  }
}

const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark'
}

export const theme = extendTheme({ config })

type MyThemeType = typeof theme

declare module 'native-base' {
  interface ICustomTheme extends MyThemeType {}
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<IUserModel>()
  const [app, setApp] = useState<IAppModel>()

  const [isOffline, setIsOffLine] = useState<any>(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable)
      setIsOffLine(offline)
    })
    return () => removeNetInfoSubscription()
  }, [])

  useEffect(() => {
    onAuthStateChanged(firebaseConfigs.auth, (user) => {
      ;(async () => {
        if (user) {
          const userDb = new FirestoreDB(COLLECTION.USERS)
          const userData: IUserModel = await userDb.getDocument({
            documentId: user.email!
          })
          userData.userAuthentication = true
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
        const appData = await appInfoDB.getDocument({ documentId: 'general' })
        setApp(appData)
        setIsLoading(false)
      })()
    })
  }, [])

  const [loaded] = useFonts({
    lora: require('./assets/Font/Lora-VariableFont_wght.ttf'),
    lato: require('./assets/Font/Lato-Black.ttf')
  })

  if (!loaded) {
    return null
  }

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

  if (app?.appMaintenanceMode) return <MaintenanceAnimation />

  return (
    <NativeBaseProvider>
      <RootContext.Provider value={{ currentUser, setCurrentUser, app }}>
        {isOffline ? <NotInternetAnimation /> : <AppNavigations />}
        <StatusBar barStyle='default' backgroundColor='#FFF' />
      </RootContext.Provider>
    </NativeBaseProvider>
  )
}
