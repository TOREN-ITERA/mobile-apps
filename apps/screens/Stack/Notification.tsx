import { FlatList, HStack, Text, VStack } from 'native-base'
import Layout from '../../components/Layout'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootParamList } from '../../navigations'
import { useContext, useEffect, useState } from 'react'
import { BASE_COLOR } from '../../utilities/baseColor'
import { RootContext } from '../../utilities/rootContext'
import { ContextApiTypes, NotificationsTypes } from '../../types'
import { FirestoreDB } from '../../firebase/firebaseDB'
import EmptyAnimation from '../../components/animations/Empty'
import {
  getDataFromLocalStorage,
  removeDataFromLocalStorage,
  saveDataToLocalStorage
} from '../../localStorage/localStorageDB'
import ListSkeleton from '../../components/skeleton/ListSkeleton'

type NotificationScreenPropsTypes = NativeStackScreenProps<RootParamList, 'Notification'>

const NotificationScreen = ({ navigation }: NotificationScreenPropsTypes) => {
  const { userInfo } = useContext<ContextApiTypes>(RootContext)
  const { setUserInfo }: any = useContext(RootContext)
  const [notificationList, setNotificationList] = useState<NotificationsTypes[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const LOCALSTORAGE_NOTIFICATION_KEY = `notification_${userInfo.email}`

  const removeNotificationFromFirestore = async () => {
    const updateCoin = new FirestoreDB('User')
    await updateCoin.update({
      documentId: userInfo.email,
      newData: { notifications: [] }
    })
  }

  const updateNotificationFromLocalStorage = async (newNotification: any) => {
    await removeDataFromLocalStorage({ key: LOCALSTORAGE_NOTIFICATION_KEY })
    await saveDataToLocalStorage({
      key: LOCALSTORAGE_NOTIFICATION_KEY,
      item: newNotification
    })
    await removeNotificationFromFirestore()
  }

  const updateUserInfo = () => {
    setUserInfo({ ...userInfo, notifications: [] })
  }

  useEffect(() => {
    ;(async () => {
      // const localNotification =
      // 	(await getDataFromLocalStorage({ key: LOCALSTORAGE_NOTIFICATION_KEY })) || [];

      // if (userInfo.notifications.length === 0) {
      // 	localNotification.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
      // 	setNotificationList(localNotification);
      // }

      // if (userInfo.notifications.length !== 0) {
      // 	const notificationUpdated = [...localNotification, ...userInfo.notifications];
      // 	notificationUpdated.sort((a: any, b: any) => parseInt(b.id) - parseInt(a.id));
      // 	setNotificationList(notificationUpdated);
      // 	await updateNotificationFromLocalStorage(notificationUpdated);
      // 	updateUserInfo();
      // }

      setIsLoading(false)
    })()
  }, [])

  if (isLoading) return <ListSkeleton />

  return (
    <Layout>
      {notificationList.length === 0 && <EmptyAnimation title='Belum ada notifikasi' />}
      {notificationList.length !== 0 && (
        <FlatList
          data={notificationList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VStack
              backgroundColor={'#FFF'}
              my='1'
              minH='20'
              borderWidth='1'
              borderColor='gray.200'
              p='2'
              justifyContent='space-between'
            >
              <HStack>
                <Text fontSize='16' color={BASE_COLOR.text.primary}>
                  {item.message}
                </Text>
              </HStack>
              <HStack justifyContent='flex-end'>
                <Text fontSize='11' color={BASE_COLOR.text.primary}>
                  {item.createdAt}
                </Text>
              </HStack>
            </VStack>
          )}
        />
      )}
    </Layout>
  )
}

export default NotificationScreen
