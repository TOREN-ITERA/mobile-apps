import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HStack, Text, VStack } from "native-base";
import Layout from "../components/Layout";
import { RootParamList } from "../navigations";
import { BASE_COLOR } from "../utilities/baseColor";
import { FlatList, RefreshControl } from "react-native";
import EmptyAnimation from "../components/animations/Empty";
import { COLLECTION, IHistoryModel } from "../models";
import { FirestoreDB } from "../firebase/firebaseDB";
import ListSkeleton from "../components/skeleton/ListSkeleton";

type HistoryPropsTypes = NativeStackScreenProps<RootParamList, "History">;

export default function HistoryScreen({ navigation }: HistoryPropsTypes) {
  const [historyList, setHistoryList] = useState<IHistoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getHistory = async () => {
    const historyDb = new FirestoreDB(COLLECTION.HISTORY);
    const result = await historyDb.getDocumentCollection();
    if (result) {
      setHistoryList(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getHistory();
  }, []);

  if (isLoading) return <ListSkeleton />;

  return (
    <Layout>
      {historyList.length === 0 && (
        <EmptyAnimation title="Belum ada notifikasi" />
      )}
      {historyList.length !== 0 && (
        <FlatList
          data={historyList}
          keyExtractor={(item) => item.historyId}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getHistory} />
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
                  {item.historyMessage}
                </Text>
              </HStack>
              <HStack justifyContent="flex-end">
                <Text fontSize="11" color={BASE_COLOR.text.primary}>
                  {item.historyCreatedAt.toString()}
                </Text>
              </HStack>
            </VStack>
          )}
        />
      )}
    </Layout>
  );
}
