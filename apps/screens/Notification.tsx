import { FlatList, HStack, Text, VStack } from 'native-base'
import Layout from '../components/Layout'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootParamList } from '../navigations'
import { useEffect, useState } from 'react'
import { BASE_COLOR } from '../utilities/baseColor'
import EmptyAnimation from '../components/animations/Empty'
import {
  removeDataFromLocalStorage,
  saveDataToLocalStorage
} from '../localStorage/localStorageDB'
import ListSkeleton from '../components/skeleton/ListSkeleton'
import { useAppContext } from '../context/app.context'
import { INotificationModel } from '../models'

type NotificationScreenPropsTypes = NativeStackScreenProps<RootParamList, 'Notification'>

const NotificationScreen = ({ navigation }: NotificationScreenPropsTypes) => {
  const { currentUser } = useAppContext()
  const [notificationList, setNotificationList] = useState<INotificationModel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const LOCALSTORAGE_NOTIFICATION_KEY = `notification_${currentUser.userEmail}`

  // const removeNotificationFromFirestore = async () => {
  //   const user = new FirestoreDB(COLLECTION.USERS)
  //   await user.updateDocument({
  //     documentId: currentUser.email,
  //     newData: { notifications: [] }
  //   })
  // }

  const updateNotificationFromLocalStorage = async (newNotification: any) => {
    await removeDataFromLocalStorage({ key: LOCALSTORAGE_NOTIFICATION_KEY })
    await saveDataToLocalStorage({
      key: LOCALSTORAGE_NOTIFICATION_KEY,
      item: newNotification
    })
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
          keyExtractor={(item) => item.notificationId}
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
                  {item.notificationMessage}
                </Text>
              </HStack>
              <HStack justifyContent='flex-end'>
                <Text fontSize='11' color={BASE_COLOR.text.primary}>
                  {item.notificationCreatedAt}
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
