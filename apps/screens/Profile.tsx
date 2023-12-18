import React, { ReactNode, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Avatar, HStack, Text, VStack } from "native-base";
import Layout from "../components/Layout";
import { RootParamList } from "../navigations";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import { BASE_COLOR } from "../utilities/baseColor";
import { TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import ModalPrimary from "../components/Modal/ModalPrimary";
import { useAppContext } from "../context/app.context";
import { firebaseConfigs } from "../configs";

type ProfilePropsTypes = NativeStackScreenProps<RootParamList, "Profile">;

export default function ProfileScreen({ navigation }: ProfilePropsTypes) {
  const { currentUser, appState } = useAppContext();

  console.log(currentUser);
  const [openModal, setOpenModal] = useState(false);

  const handleLogOut = async () => {
    await signOut(firebaseConfigs.auth);
  };

  return (
    <Layout>
      <VStack
        backgroundColor="#FFF"
        p={3}
        px={3}
        space={2}
        borderWidth={1}
        borderColor="gray.200"
        my={5}
        borderRadius="5"
        rounded="md"
      >
        <VStack alignItems="center" space={2}>
          <Avatar
            backgroundColor={BASE_COLOR.primary}
            size="xl"
            source={{
              uri: "https://vasundharaodisha.org/upload/84552no-user.jpg",
            }}
          />

          <Text fontFamily="lato" fontSize="xl" color={BASE_COLOR.text.primary}>
            {currentUser.userName}
          </Text>
          <Text color={BASE_COLOR.text.primary}>{currentUser.userEmail}</Text>
        </VStack>
      </VStack>
      <CardProfileList onPress={() => null}>
        <AntDesign name="setting" size={24} color={BASE_COLOR.text.primary} />
        <Text fontSize="md" fontWeight="bold" color={BASE_COLOR.text.primary}>
          Settings
        </Text>
      </CardProfileList>
      <CardProfileList onPress={() => {}}>
        <Entypo name="code" size={24} color={BASE_COLOR.text.primary} />
        <Text fontSize="md" fontWeight="bold" color={BASE_COLOR.text.primary}>
          Version {appState.appVersion ?? "1.0"}
        </Text>
      </CardProfileList>
      <CardProfileList onPress={() => setOpenModal(true)}>
        <Ionicons
          name="exit-outline"
          size={24}
          color={BASE_COLOR.text.primary}
        />
        <Text fontSize="md" fontWeight="bold" color={BASE_COLOR.text.primary}>
          Logout
        </Text>
      </CardProfileList>

      <ModalPrimary
        openModel={openModal}
        onCloseModal={setOpenModal}
        modalHeaderTitle="Keluar"
        modalText="Apakah anda yakin ingin keluar?"
        btnNoTitle="cancel"
        btnYesTitle="keluar"
        onBtnYesClick={handleLogOut}
      />
    </Layout>
  );
}

type CardProfileListTypes = {
  onPress: (value: any) => void;
  children: ReactNode;
};

const CardProfileList = ({ children, onPress }: CardProfileListTypes) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <HStack
        backgroundColor="#FFF"
        p={5}
        space={5}
        alignItems="flex-end"
        borderWidth={1}
        borderColor="gray.200"
        my={1}
        borderRadius="5"
        rounded="md"
      >
        {children}
      </HStack>
    </TouchableOpacity>
  );
};
