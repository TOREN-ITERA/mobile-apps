import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { HStack, Text, ScrollView, Pressable, View, Center } from 'native-base'
import Layout from '../components/Layout'
import { Ionicons } from '@expo/vector-icons'
import { RootParamList } from '../navigations'
import { RefreshControl, TouchableOpacity } from 'react-native'
import { BASE_COLOR } from '../utilities/baseColor'
import { useEffect, useLayoutEffect, useState } from 'react'
import SkeletonHomeScreen from '../components/skeleton/HomeScreenSkeleton'
import { StyleSheet } from 'react-native'
import { useAppContext } from '../context/app.context'
import { FirestoreDB } from '../firebase/firebaseDB'
import { COLLECTION, IDeviceModel } from '../models'

type HomeScreenPropsTypes = NativeStackScreenProps<RootParamList, 'Home'>

export default function HomeScreen({ navigation }: HomeScreenPropsTypes) {
  const { currentUser } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)
  const [currentDevice, setCurrentDevice] = useState<IDeviceModel>()
  const [controleDevice, setControleDevice] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  const handleUpdateDeviceStatus = async () => {
    const deviceDB = new FirestoreDB(COLLECTION.DEVICES)
    const previousDevice = await deviceDB.getDocument({ documentId: 'device' })
    setControleDevice(!controleDevice)

    if (previousDevice) {
      await deviceDB.updateDocument({
        documentId: 'device',
        newData: { deviceStatus: !controleDevice }
      })
      setCurrentDevice(previousDevice)
    }
  }

  console.log(currentDevice)

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <HStack px='2' alignItems='center' space={2}>
          <Text color={BASE_COLOR.text.primary} fontSize='xl'>
            {currentUser.userAuthentication ? `Hi, ${currentUser.userName} ` : 'Welcome'}
          </Text>
        </HStack>
      ),
      headerRight: () => (
        <HStack px='3' alignItems='center' space={2}>
          {currentUser.userAuthentication && (
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Ionicons
                name='ios-notifications'
                size={25}
                color={BASE_COLOR.text.primary}
              />
              {/* {userInfo.notifications?.length !== 0 && (
                <Box
                  rounded='full'
                  backgroundColor='red.500'
                  top='0'
                  right='0'
                  p='2'
                  position='absolute'
                  zIndex='2'
                />
              )} */}
            </TouchableOpacity>
          )}
          {!currentUser.userAuthentication && (
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
  }, [currentUser])

  return (
    <Layout>
      {isLoading && <SkeletonHomeScreen />}
      {!isLoading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => {}} />}
        >
          <Center flex={1} alignItems='center' justifyContent='center'>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleUpdateDeviceStatus}
            >
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: controleDevice ? BASE_COLOR.primary : BASE_COLOR.gray
                  }
                ]}
              >
                <Text style={styles.buttonText}>{controleDevice ? 'On' : 'Off'}</Text>
              </View>
            </TouchableOpacity>
          </Center>
        </ScrollView>
      )}
    </Layout>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 250,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
})
