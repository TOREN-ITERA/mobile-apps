import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  HStack,
  Text,
  ScrollView,
  Pressable,
  Box,
  VStack,
  Heading,
} from "native-base";
import Layout from "../components/Layout";
import { RootParamList } from "../navigations";
import { RefreshControl } from "react-native";
import { BASE_COLOR } from "../utilities/baseColor";
import React, {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import SkeletonHomeScreen from "../components/skeleton/HomeScreenSkeleton";
import { useAppContext } from "../context/app.context";
import { FirestoreDB } from "../firebase/firebaseDB";
import { COLLECTION, IDeviceModel, IHistoryModel } from "../models";
import {
  AntDesign,
  Feather,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { heightPercentage, widthPercentage } from "../utilities/dimension";
import LottieView from "lottie-react-native";

type HomeScreenPropsTypes = NativeStackScreenProps<RootParamList, "Home">;

export default function HomeScreen({ navigation }: HomeScreenPropsTypes) {
  const { currentUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState<boolean>(false);
  const [waterPumpStatus, setWaterPumpStatus] = useState<boolean>(false);
  const [electricityStatus, setElectricityStatus] = useState<boolean>(false);
  const [internetConnectionStatus, setInternetConnectionStatus] =
    useState<boolean>(false);
  const deviceDB = new FirestoreDB(COLLECTION.DEVICES);
  const historyDB = new FirestoreDB(COLLECTION.HISTORY);

  useEffect(() => {
    const unsub = deviceDB.getRealtimeData({
      documentId: "device",
      getData: (deviceData: IDeviceModel) => {
        if (deviceData) {
          setDeviceStatus(deviceData.deviceStatus);
          setWaterPumpStatus(deviceData.deviceWaterPumpStatus);
          setElectricityStatus(deviceData.deviceElectricityStatus);
          setInternetConnectionStatus(deviceData.deviceInternetStatus);
        }
      },
    });
    setIsLoading(false);
    return () => {
      unsub();
    };
  }, []);

  const handleCreateHistory = async ({ message }: { message: string }) => {
    const payload = {
      historyMessage: message,
      historyCreatedAt: Date.now() + "",
    } as IHistoryModel;

    historyDB.setDocumentWithGeneratedId({
      data: payload,
    });
  };

  const handleUpdateDeviceStatus = async () => {
    await deviceDB.updateDocument({
      documentId: "device",
      newData: {
        deviceStatus: !deviceStatus,
      },
    });
    await handleCreateHistory({
      message: `pompa air ${deviceStatus ? "menyala" : "mati"}`,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <HStack px="2" alignItems="center" space={2}>
          <Heading color={BASE_COLOR.primary} fontSize="2xl">
            Torantis
          </Heading>
          <Feather name="droplet" size={24} color={BASE_COLOR.primary} />
        </HStack>
      ),
      headerRight: () => (
        <HStack px="3" alignItems="center" space={2}>
          {currentUser.userAuthentication && (
            <Pressable onPress={() => navigation.navigate("Notification")}>
              <Ionicons
                name="ios-notifications"
                size={25}
                color={BASE_COLOR.text.primary}
              />
              <Box
                rounded="full"
                backgroundColor="red.500"
                top="0"
                right="0"
                p="2"
                position="absolute"
                zIndex="2"
              />
            </Pressable>
          )}
          {!currentUser.userAuthentication && (
            <Pressable
              borderWidth="1"
              borderColor={BASE_COLOR.text.primary}
              px="2"
              mx="2"
              p="1"
              rounded="md"
              onPress={() => navigation.navigate("Login")}
              _pressed={{
                backgroundColor: BASE_COLOR.blue[100],
              }}
            >
              <Text
                color={BASE_COLOR.text.primary}
                fontSize="md"
                fontWeight="bold"
              >
                Login
              </Text>
            </Pressable>
          )}
        </HStack>
      ),
    });
  }, [currentUser]);

  return (
    <Layout>
      {isLoading && <SkeletonHomeScreen />}
      {!isLoading && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={() => {}} />
          }
        >
          <ScrollView
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={() => {}} />
            }
            horizontal
          >
            <HStack justifyContent="space-between" space={2} my={5}>
              <CardStyle
                onClick={handleUpdateDeviceStatus}
                status={deviceStatus}
                title={deviceStatus ? "on" : "off"}
              >
                <AntDesign
                  name="poweroff"
                  size={24}
                  color={deviceStatus ? "white" : "red"}
                />
              </CardStyle>
              <CardStyle
                onClick={() => setWaterPumpStatus(!waterPumpStatus)}
                status={waterPumpStatus}
                title="water pump"
              >
                <MaterialCommunityIcons
                  name="water-pump"
                  size={24}
                  color={waterPumpStatus ? "white" : "red"}
                />
              </CardStyle>
              <CardStyle
                onClick={() => setElectricityStatus(!electricityStatus)}
                status={electricityStatus}
                title="electricity"
              >
                <Ionicons
                  name="flash"
                  size={24}
                  color={electricityStatus ? "white" : "red"}
                />
              </CardStyle>
              <CardStyle
                onClick={() =>
                  setInternetConnectionStatus(!internetConnectionStatus)
                }
                status={internetConnectionStatus}
                title="internet connection"
              >
                <Entypo
                  name="signal"
                  size={24}
                  color={internetConnectionStatus ? "white" : "red"}
                />
              </CardStyle>
            </HStack>
          </ScrollView>

          <Box
            borderWidth={1}
            borderColor="gray.200"
            rounded="xl"
            backgroundColor="blue.200"
            p={5}
            h={heightPercentage(20)}
            bgColor="white"
            width={widthPercentage(96)}
            display="flex"
            justifyContent="center"
            alignItems="center"
          ></Box>
        </ScrollView>
      )}
    </Layout>
  );
}

interface ICardStyleModel {
  onClick: (value: boolean) => void;
  status: boolean;
  children: React.FC<PropsWithChildren>;
  title: string;
}

const CardStyle: any = (props: ICardStyleModel) => {
  return (
    <Pressable onPress={() => props.onClick(!props.status)}>
      <Box
        borderWidth={1}
        borderColor="gray.200"
        p={5}
        h={heightPercentage(20)}
        bgColor="white"
        rounded="xl"
        width={widthPercentage(40)}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          backgroundColor={props.status ? "lightBlue.400" : "red.100"}
          p="10"
          rounded="full"
        >
          {props.children}
        </Box>
        <Text mt="2">{props.title ?? "title"}</Text>
      </Box>
    </Pressable>
  );
};
