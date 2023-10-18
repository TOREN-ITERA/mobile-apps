import { FlatList, HStack, Text, VStack } from "native-base";
import Layout from "../components/Layout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootParamList } from "../navigations";
import { useEffect, useState } from "react";
import { BASE_COLOR } from "../utilities/baseColor";
import EmptyAnimation from "../components/animations/Empty";
import ListSkeleton from "../components/skeleton/ListSkeleton";
import { useAppContext } from "../context/app.context";
import { COLLECTION, INotificationModel } from "../models";
import { FirestoreDB } from "../firebase/firebaseDB";

type NotificationScreenPropsTypes = NativeStackScreenProps<
  RootParamList,
  "Notification"
>;

const NotificationScreen = ({ navigation }: NotificationScreenPropsTypes) => {
  const { currentUser } = useAppContext();
  const [notificationList, setNotificationList] = useState<
    INotificationModel[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const notifications = new FirestoreDB(COLLECTION.NOTIFICATIONS);
      const getNotification = await notifications.getDocumentCollection();

      if (getNotification) {
        setNotificationList(getNotification);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <ListSkeleton />;

  return (
    <Layout>
      {notificationList.length === 0 && (
        <EmptyAnimation title="Belum ada notifikasi" />
      )}
      {notificationList.length !== 0 && (
        <FlatList
          data={notificationList}
          keyExtractor={(item) => item.notificationId}
          renderItem={({ item }) => (
            <VStack
              backgroundColor={"#FFF"}
              my="1"
              minH="20"
              borderWidth="1"
              borderColor="gray.200"
              p="2"
              justifyContent="space-between"
            >
              <HStack>
                <Text fontSize="16" color={BASE_COLOR.text.primary}>
                  {item.notificationMessage}
                </Text>
              </HStack>
              <HStack justifyContent="flex-end">
                <Text fontSize="11" color={BASE_COLOR.text.primary}>
                  {item.notificationCreatedAt.toString()}
                </Text>
              </HStack>
            </VStack>
          )}
        />
      )}
    </Layout>
  );
};

export default NotificationScreen;
