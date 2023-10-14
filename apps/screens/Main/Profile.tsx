import React, { ReactNode, useContext, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Avatar, HStack, Text, VStack } from 'native-base'
import Layout from '../../components/Layout'
import { RootParamList } from '../../navigations'
import {
  FontAwesome5,
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons'
import { BASE_COLOR } from '../../utilities/baseColor'
import { TouchableOpacity } from 'react-native'
import { RootContext } from '../../utilities/rootContext'
import { ContextApiTypes } from '../../types'
import { signOut } from 'firebase/auth'
import { auth } from '../../configs/firebase'
import ModalPrimary from '../../components/Modal/ModalPrimary'
import * as Application from 'expo-application'
import { Share, Linking } from 'react-native'

type ProfilePropsTypes = NativeStackScreenProps<RootParamList, 'Profile'>

export default function ProfileScreen({ navigation }: ProfilePropsTypes) {
  const { userInfo } = useContext<ContextApiTypes>(RootContext)
  const [openModal, setOpenModal] = useState(false)

  const lastUpdate = Application.getLastUpdateTimeAsync().then(console.log)

  const handleLogOut = async () => {
    await signOut(auth)
  }

  const ratingPlayStore = () => {
    Linking.openURL(`market://details?id=com.misdar.utbk&showAllReviews=true`)
  }

  const onShare = async () => {
    try {
      await Share.share({
        message: 'https://play.google.com/store/apps/details?id=com.misdar.utbk'
      })
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <Layout>
      <VStack
        backgroundColor='#FFF'
        p={3}
        px={3}
        space={2}
        borderWidth={1}
        borderColor='gray.200'
        my={1}
        borderRadius='5'
        rounded='md'
      >
        <HStack alignItems='center' space={2}>
          <Avatar backgroundColor={BASE_COLOR.green}>{userInfo.name[0]}</Avatar>
          <Text fontFamily='lato' fontSize='xl' color={BASE_COLOR.text.primary}>
            {userInfo.name}
          </Text>
          <Text color={BASE_COLOR.text.primary}>{userInfo.email}</Text>
        </HStack>
      </VStack>

      <VStack mt={8}>
        <CardProfileList onPress={ratingPlayStore}>
          <AntDesign name='star' size={24} color={BASE_COLOR.text.primary} />
          <Text fontSize='md' fontWeight='bold' color={BASE_COLOR.text.primary}>
            Beri Rating
          </Text>
          <Text fontSize='sm' fontWeight='bold' color={BASE_COLOR.text.primary}>
            v{Application.nativeApplicationVersion}
          </Text>
        </CardProfileList>

        <CardProfileList onPress={onShare}>
          <Ionicons name='ios-people' size={24} color={BASE_COLOR.text.primary} />
          <Text fontSize='md' fontWeight='bold' color={BASE_COLOR.text.primary}>
            Bagikan ke teman mu
          </Text>
        </CardProfileList>

        <CardProfileList onPress={() => setOpenModal(true)}>
          <Ionicons name='exit-outline' size={24} color={BASE_COLOR.text.primary} />
          <Text fontSize='md' fontWeight='bold' color={BASE_COLOR.text.primary}>
            Keluar
          </Text>
        </CardProfileList>
      </VStack>

      <ModalPrimary
        openModel={openModal}
        onCloseModal={setOpenModal}
        modalHeaderTitle='Keluar'
        modalText='Apakah anda yakin ingin keluar?'
        btnNoTitle='cancel'
        btnYesTitle='keluar'
        onBtnYesClick={handleLogOut}
      />
    </Layout>
  )
}

type CardProfileListTypes = {
  onPress: any
  children: ReactNode
}

const CardProfileList = ({ children, onPress }: CardProfileListTypes) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <HStack
        backgroundColor='#FFF'
        p={5}
        space={5}
        alignItems='flex-end'
        borderWidth={1}
        borderColor='gray.200'
        my={1}
        borderRadius='5'
        rounded='md'
      >
        {children}
      </HStack>
    </TouchableOpacity>
  )
}
