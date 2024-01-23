import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Button, HStack, Input, Text, VStack } from "native-base";
import Layout from "../components/Layout";
import { RootParamList } from "../navigations";
import { BASE_COLOR } from "../utilities/baseColor";
import { FlatList, RefreshControl } from "react-native";
import EmptyAnimation from "../components/animations/Empty";
import { COLLECTION, IHistoryModel } from "../models";
import { FirestoreDB } from "../firebase/firebaseDB";
import ListSkeleton from "../components/skeleton/ListSkeleton";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import { firebaseConfigs } from "../configs";

type NotificationScreenPropsTypes = NativeStackScreenProps<
  RootParamList,
  "Notification"
>;

const NotificationScreen = ({ navigation }: NotificationScreenPropsTypes) => {
  const [historyList, setHistoryList] = useState<IHistoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [lastVisibleData, setlastVisibleData] = useState<any>();

  const [filterBy, setFilterBy] = useState("");
  const [search, setSearch] = useState("");

  const getFirstDocument = async () => {
    const first = query(
      collection(firebaseConfigs.dataBase, COLLECTION.HISTORY),
      orderBy("historyCreatedAt"),
      limit(2)
    );

    const data: any[] = [];
    const documentSnapshots = await getDocs(first);
    documentSnapshots.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setlastVisibleData(lastVisible);
  };

  const getNextDocument = async () => {
    const next = query(
      collection(firebaseConfigs.dataBase, COLLECTION.HISTORY),
      orderBy("historyCreatedAt"),
      startAfter(lastVisibleData),
      limit(5)
    );

    const data: any[] = [];
    const documentSnapshots = await getDocs(next);
    documentSnapshots.forEach((doc: any) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setlastVisibleData(lastVisible);
  };

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

  const getData = async () => {
    console.log("get data");
  };

  useEffect(() => {
    getData();
  }, [filterBy]);

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
          ListHeaderComponent={() => (
            <Box>
              <Input
                w="100%"
                shadow="1"
                my={"2"}
                onChangeText={(value) => setSearch(value)}
                size="md"
                bg="white"
                _focus={{
                  bgColor: "white",
                  borderColor: "gray.100",
                }}
                rounded={"md"}
                InputRightElement={
                  <Button
                    rounded="none"
                    size="lg"
                    bgColor={BASE_COLOR.primary}
                    onPress={getData}
                    w="1/4"
                  >
                    Search
                  </Button>
                }
                placeholder="masukan keyword..."
              />
              <HStack my={2} space={2}>
                <Button
                  variant="subtle"
                  borderColor={"gray.200"}
                  borderWidth={1}
                  colorScheme={"gray"}
                  size={"md"}
                  rounded={"xl"}
                  onPress={() => setFilterBy("all")}
                >
                  Semua
                </Button>
                <Button
                  variant="subtle"
                  borderColor={"gray.200"}
                  borderWidth={1}
                  colorScheme={"gray"}
                  size={"md"}
                  rounded={"xl"}
                  onPress={() => setFilterBy("new")}
                >
                  Terbaru
                </Button>
                <Button
                  variant="subtle"
                  borderColor={"gray.200"}
                  borderWidth={1}
                  colorScheme={"gray"}
                  size={"md"}
                  rounded={"xl"}
                  onPress={() => setFilterBy("new")}
                >
                  Terbaru
                </Button>
              </HStack>
            </Box>
          )}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getHistory} />
          }
          ListFooterComponent={() => (
            <HStack
              backgroundColor="white"
              p="5"
              my="1"
              borderWidth="1"
              borderColor="gray.200"
              justifyContent="space-between"
            >
              <Button>Previous</Button>
              <Button onPress={getFirstDocument}>start</Button>
              <Button onPress={getNextDocument}>Next</Button>
            </HStack>
          )}
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
};

export default NotificationScreen;
