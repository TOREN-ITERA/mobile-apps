import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  HStack,
  Text,
  ScrollView,
  Pressable,
  Box,
  Heading,
  Modal,
  FormControl,
  Input,
  Button,
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
import CircularProgress from "react-native-circular-progress-indicator";

type HomeScreenPropsTypes = NativeStackScreenProps<RootParamList, "Home">;

export default function HomeScreen({ navigation }: HomeScreenPropsTypes) {
  const { currentUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState<boolean>(false);
  const [waterPumpStatus, setWaterPumpStatus] = useState<boolean>(false);
  const [internetConnectionStatus, setInternetConnectionStatus] =
    useState<boolean>(false);
  const [waterPumpProgress, setWaterPumpProgress] = useState<number>(0);
  const [deviceCurrentSensor, setDeviceCurrentSensor] = useState<number>(0);
  const [deviceWaterFlowProgress, setDeviceWaterFlowProgress] =
    useState<number>(0);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [deviceConnectionType, setDeviceConnectionType] =
    useState<string>("Loading...");

  const [showModalPasswordVerification, setShowModalPasswordVerification] =
    useState(false);
  const [passwordVerification, setPasswordVerification] = useState<string>("");

  const deviceDB = new FirestoreDB(COLLECTION.DEVICES);
  const historyDB = new FirestoreDB(COLLECTION.HISTORY);

  const getUsers = async () => {
    const historyDb = new FirestoreDB(COLLECTION.USERS);
    const result = await historyDb.getDocumentCollection();
    if (result) {
      setTotalUser(result.length);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getUsers();
    const unsub = deviceDB.getRealtimeData({
      documentId: "device",
      getData: (deviceData: IDeviceModel) => {
        if (deviceData) {
          setDeviceStatus(deviceData.deviceStatus);
          setWaterPumpStatus(deviceData.deviceWaterPumpStatus);
          setInternetConnectionStatus(deviceData.deviceInternetStatus);
          setWaterPumpProgress(deviceData.deviceWaterPumpProgress ?? 0);
          setDeviceCurrentSensor(deviceData.deviceCurrentSensor);
          setDeviceWaterFlowProgress(deviceData.deviceWaterFlowProgress);
          setDeviceConnectionType(deviceData.deviceConnectionType);
        }
      },
    });
    setIsLoading(false);
    return () => {
      unsub();
    };
  }, []);

  const handleCreateHistory = async ({ message }: { message: string }) => {
    const date = new Date();
    const payload = {
      historyMessage: message,
      historyCreatedAt: date.toLocaleString(),
    } as IHistoryModel;

    historyDB.setDocumentWithGeneratedId({
      data: payload,
    });
  };

  const handleUpdateDeviceStatus = async () => {
    if (deviceStatus === true) {
      if (passwordVerification !== currentUser.userPassword) {
        return;
      }
    }

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
      // headerRight: () => (
      //   <HStack px="3" alignItems="center" space={2}>
      //     <Pressable onPress={() => navigation.navigate("Notification")}>
      //       <Ionicons name="ios-notifications" size={30} color={"gray"} />
      //       <Box
      //         rounded="full"
      //         backgroundColor="red.500"
      //         top="0"
      //         right="0"
      //         p="2"
      //         position="absolute"
      //         zIndex="2"
      //       />
      //     </Pressable>
      //   </HStack>
      // ),
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
          <Text fontWeight="bold" color={"gray.500"}>
            Summary
          </Text>
          <Box
            borderWidth={1}
            borderColor="gray.200"
            rounded="xl"
            backgroundColor="blue.200"
            p={2}
            bgColor="white"
            width={widthPercentage(96)}
            display="flex"
            flexWrap="wrap"
          >
            <HStack padding={1} space={2} alignItems={"center"}>
              <HStack padding={1} space={2} alignItems={"center"}>
                <Box bg={"blue.50"} rounded="full" p={1}>
                  <Ionicons name="flash" size={20} color={BASE_COLOR.primary} />
                </Box>
                <Text>current {deviceCurrentSensor}</Text>
              </HStack>
              <HStack padding={1} space={2} alignItems={"center"}>
                <Box bg={"blue.50"} rounded="full" p={1}>
                  <AntDesign
                    name="dashboard"
                    size={20}
                    color={BASE_COLOR.primary}
                  />
                </Box>
                <Text>water flow {deviceWaterFlowProgress}</Text>
              </HStack>
              <HStack padding={1} space={2} alignItems={"center"}>
                <Box bg={"blue.50"} rounded="full" p={1}>
                  <Feather name="users" size={20} color={BASE_COLOR.primary} />
                </Box>
                <Text>users {totalUser}</Text>
              </HStack>
            </HStack>

            <HStack padding={1} space={2} alignItems={"center"}>
              <HStack padding={1} space={2} alignItems={"center"}>
                <Box bg={"blue.50"} rounded="full" p={1}>
                  <Entypo name="signal" size={18} color={BASE_COLOR.primary} />
                </Box>
                <Text>{deviceConnectionType}</Text>
              </HStack>
            </HStack>
          </Box>

          <Text fontWeight="bold" color={"gray.500"}>
            Control
          </Text>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal my={2}>
            <HStack justifyContent="space-between" space={2}>
              <CardStyle
                onClick={() => {
                  if (deviceStatus === true) {
                    setShowModalPasswordVerification(
                      !showModalPasswordVerification
                    );
                  } else {
                    handleUpdateDeviceStatus();
                  }
                }}
                status={deviceStatus}
                title={deviceStatus ? "on" : "off"}
              >
                <AntDesign
                  name="poweroff"
                  size={24}
                  color={deviceStatus ? "white" : "red"}
                />
              </CardStyle>
              <CardStyle status={waterPumpStatus} title="water pump">
                <MaterialCommunityIcons
                  name="water-pump"
                  size={24}
                  color={waterPumpStatus ? "white" : "red"}
                />
              </CardStyle>

              <CardStyle status={internetConnectionStatus} title="connection">
                <Entypo
                  name="signal"
                  size={24}
                  color={internetConnectionStatus ? "white" : "red"}
                />
              </CardStyle>
            </HStack>
          </ScrollView>
          <Text fontWeight="bold" color={"gray.500"}>
            Progress
          </Text>
          <Box
            borderWidth={1}
            my={2}
            borderColor="gray.200"
            rounded="xl"
            backgroundColor="blue.200"
            p={5}
            h={heightPercentage(45)}
            bgColor="white"
            width={widthPercentage(96)}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress
              value={waterPumpProgress}
              progressValueColor={BASE_COLOR.primary}
              activeStrokeColor={BASE_COLOR.primary}
              valueSuffix={"%"}
            />
          </Box>
        </ScrollView>
      )}

      <Modal
        isOpen={showModalPasswordVerification}
        onClose={() => setShowModalPasswordVerification(false)}
      >
        <Modal.Content>
          <Modal.Header>Verification</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                size={"lg"}
                placeholder="masukan password"
                onChangeText={(value) => setPasswordVerification(value)}
              />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                size={"lg"}
                onPress={() => {
                  setShowModalPasswordVerification(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size={"lg"}
                onPress={() => {
                  handleUpdateDeviceStatus();
                  setShowModalPasswordVerification(false);
                }}
              >
                Submit
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

interface ICardStyleModel {
  onClick?: (value: boolean) => void;
  status: boolean;
  children: React.FC<PropsWithChildren>;
  title: string;
}

const CardStyle: any = (props: ICardStyleModel) => {
  return (
    <Pressable
      onPress={() =>
        props.onClick ? props.onClick(!props.status) : () => null
      }
    >
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
          backgroundColor={props.status ? BASE_COLOR.primary : "red.100"}
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
