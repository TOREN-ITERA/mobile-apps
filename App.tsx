import React, { useEffect, useState } from 'react'
import AppNavigations from './apps/navigations'
import { NativeBaseProvider, extendTheme } from 'native-base'
import { StatusBar } from 'react-native'
import { useFonts } from 'expo-font'
import NetInfo from '@react-native-community/netinfo'
import { LogBox } from 'react-native'
import _ from 'lodash'
import NotInternetAnimation from './apps/components/animations/Ofline'
import 'expo-dev-client'
import { AppProvider } from './apps/context/app.context'

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
  const [isOffline, setIsOffLine] = useState<any>(false)

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable)
      setIsOffLine(offline)
    })
    return () => removeNetInfoSubscription()
  }, [])

  const [loaded] = useFonts({
    lora: require('./assets/Font/Lora-VariableFont_wght.ttf'),
    lato: require('./assets/Font/Lato-Black.ttf')
  })

  if (!loaded) {
    return null
  }

  // if (app?.appMaintenanceMode) return <MaintenanceAnimation />

  return (
    <NativeBaseProvider>
      <AppProvider>
        {isOffline ? <NotInternetAnimation /> : <AppNavigations />}
        <StatusBar barStyle='default' backgroundColor='#FFF' />
      </AppProvider>
    </NativeBaseProvider>
  )
}
