import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HStack, Text, VStack } from "native-base";
import Layout from "../components/Layout";
import { RootParamList } from "../navigations";
import { BASE_COLOR } from "../utilities/baseColor";
import { FlatList, RefreshControl } from "react-native";
import EmptyAnimation from "../components/animations/Empty";
import { COLLECTION, IHistoryModel, IUserModel } from "../models";
import { FirestoreDB } from "../firebase/firebaseDB";
import ListSkeleton from "../components/skeleton/ListSkeleton";

type UserListPropsTypes = NativeStackScreenProps<RootParamList, "UsersList">;

export default function UsersListScreen({ navigation }: UserListPropsTypes) {
  const [userList, setUserList] = useState<IUserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = async () => {
    const historyDb = new FirestoreDB(COLLECTION.USERS);
    const result = await historyDb.getDocumentCollection();
    if (result) {
      setUserList(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (isLoading) return <ListSkeleton />;

  return (
    <Layout>
      {userList.length === 0 && <EmptyAnimation title="Belum ada notifikasi" />}
      {userList.length !== 0 && (
        <FlatList
          data={userList}
          keyExtractor={(item) => item.userId}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getUsers} />
          }
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
                  {item.userName}
                </Text>
              </HStack>
              <HStack justifyContent="flex-end">
                <Text fontSize="11" color={BASE_COLOR.text.primary}>
                  {item.userEmail}
                </Text>
              </HStack>
            </VStack>
          )}
        />
      )}
    </Layout>
  );
}
