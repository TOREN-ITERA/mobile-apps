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
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import { useAppContext } from "../context/app.context";
import { FirestoreDB } from "../firebase/firebaseDB";
import { COLLECTION, IDeviceModel } from "../models";
import {
  AntDesign,
  Feather,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { heightPercentage, widthPercentage } from "../utilities/dimension";

type HomeScreenPropsTypes = NativeStackScreenProps<RootParamList, "Home">;

export default function HomeScreen({ navigation }: HomeScreenPropsTypes) {
  const { currentUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [currentDevice, setCurrentDevice] = useState<IDeviceModel>();
  const [controleDevice, setControleDevice] = useState(false);
  const [waterPumpStatus, setWaterPumpStatus] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const handleUpdateDeviceStatus = async () => {
    const deviceDB = new FirestoreDB(COLLECTION.DEVICES);
    const previousDevice = await deviceDB.getDocument({ documentId: "device" });
    setControleDevice(!controleDevice);

    if (previousDevice) {
      await deviceDB.updateDocument({
        documentId: "device",
        newData: { deviceStatus: !controleDevice },
      });
      setCurrentDevice(previousDevice);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <HStack px="2" alignItems="center" space={2}>
          <Text color={BASE_COLOR.primary} fontSize="2xl">
            Torantis
          </Text>
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
          <VStack space={2} my={2}>
            <Box
              borderWidth={1}
              borderColor="gray.200"
              p={5}
              h="48"
              bgColor="white"
              display="flex"
              alignItems="center"
              flexDirection="row"
            >
              <LottieView
                style={{
                  width: widthPercentage(30),
                  height: heightPercentage(15),
                }}
                source={require("../../assets/animations/water.json")}
                autoPlay
                loop={true}
                duration={2000}
              />
              <Heading>{waterPumpStatus ? "Sedang Mengisi" : "Penuh"}</Heading>
            </Box>
            <HStack justifyContent="space-between" space={2}>
              <CardStyle
                onClick={() => setWaterPumpStatus(!waterPumpStatus)}
                status={waterPumpStatus}
              >
                <MaterialCommunityIcons
                  name="water-pump"
                  size={24}
                  color={waterPumpStatus ? "white" : "red"}
                />
              </CardStyle>

              <CardStyle
                onClick={() => setWaterPumpStatus(!waterPumpStatus)}
                status={waterPumpStatus}
              >
                <Ionicons
                  name="flash"
                  size={24}
                  color={waterPumpStatus ? "white" : "red"}
                />
              </CardStyle>
            </HStack>

            <HStack justifyContent="space-between" space={2}>
              <CardStyle
                onClick={() => setWaterPumpStatus(!waterPumpStatus)}
                status={waterPumpStatus}
              >
                <Entypo
                  name="signal"
                  size={24}
                  color={waterPumpStatus ? "white" : "red"}
                />
              </CardStyle>

              <CardStyle
                onClick={() => setWaterPumpStatus(!waterPumpStatus)}
                status={waterPumpStatus}
              >
                <AntDesign
                  name="poweroff"
                  size={24}
                  color={waterPumpStatus ? "white" : "red"}
                />
              </CardStyle>
            </HStack>
          </VStack>
        </ScrollView>
      )}
    </Layout>
  );
}

interface ICardStyleModel {
  onClick: (value: boolean) => void;
  status: boolean;
  children: React.FC<PropsWithChildren>;
}

const CardStyle: any = (props: ICardStyleModel) => {
  return (
    <Pressable onPress={() => props.onClick(!props.status)}>
      <Box
        borderWidth={1}
        borderColor="gray.200"
        p={5}
        h={heightPercentage(30)}
        bgColor="white"
        width={widthPercentage(47)}
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
        <Text mt="2">{props.status ? "ON" : "OFF"}</Text>
      </Box>
    </Pressable>
  );
};
