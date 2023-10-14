import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Box, HStack, Text, ScrollView, Pressable } from 'native-base'
import Layout from '../../components/Layout'
import { Ionicons } from '@expo/vector-icons'
import { RootParamList } from '../../navigations'
import { RefreshControl, TouchableOpacity } from 'react-native'
import { BASE_COLOR } from '../../utilities/baseColor'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import SkeletonHomeScreen from '../../components/skeleton/HomeScreenSkeleton'
import { RootContext } from '../../utilities/rootContext'
import { ContextApiTypes } from '../../types'
import { View, StyleSheet } from 'react-native'

type HomeScreenPropsTypes = NativeStackScreenProps<RootParamList, 'Home'>

export default function HomeScreen({ navigation }: HomeScreenPropsTypes) {
  const { userInfo, appInfo } = useContext<ContextApiTypes>(RootContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 5000)
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HStack px='2' alignItems='center' space={2}>
          <Text color={BASE_COLOR.text.primary} fontSize='xl'>
            {userInfo.isAuth ? `Hi, Test` : 'Welcome'}
          </Text>
        </HStack>
      ),
      headerRight: () => (
        <HStack px='3' alignItems='center' space={2}>
          {userInfo.isAuth && (
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Ionicons
                name='ios-notifications'
                size={25}
                color={BASE_COLOR.text.primary}
              />
              {userInfo.notifications?.length !== 0 && (
                <Box
                  rounded='full'
                  backgroundColor='red.500'
                  top='0'
                  right='0'
                  p='2'
                  position='absolute'
                  zIndex='2'
                />
              )}
            </TouchableOpacity>
          )}
          {!userInfo.isAuth && (
            <Pressable
              borderWidth='1'
              borderColor={BASE_COLOR.text.primary}
              px='2'
              mx='2'
              p='1'
              rounded='md'
              onPress={() => navigation.navigate('Login')}
              _pressed={{
                backgroundColor: BASE_COLOR.blue[100]
              }}
            >
              <Text color={BASE_COLOR.text.primary} fontSize='md' fontWeight='bold'>
                Login
              </Text>
            </Pressable>
          )}
        </HStack>
      )
    })
  }, [userInfo.isAuth])
  const [isOn, setIsOn] = useState(false)

  return (
    <Layout>
      {isLoading && <SkeletonHomeScreen />}
      {!isLoading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => {}} />}
        >
          <TouchableOpacity style={styles.buttonContainer} onPress={() => setIsOn(!isOn)}>
            <View style={[styles.circle, { backgroundColor: isOn ? 'green' : 'red' }]}>
              <Text style={styles.buttonText}>{isOn ? 'On' : 'Off'}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}
    </Layout>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
})
