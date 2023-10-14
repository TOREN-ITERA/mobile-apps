import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Avatar, HStack, Text, VStack } from 'native-base'
import Layout from '../components/Layout'
import { RootParamList } from '../navigations'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { BASE_COLOR } from '../utilities/baseColor'
import { TouchableOpacity } from 'react-native'
import { signOut } from 'firebase/auth'
import ModalPrimary from '../components/Modal/ModalPrimary'
import * as Application from 'expo-application'
import { Share, Linking } from 'react-native'
import { useAppContext } from '../context/app.context'
import { firebaseConfigs } from '../configs'

type ProfilePropsTypes = NativeStackScreenProps<RootParamList, 'Profile'>

export default function ProfileScreen({ navigation }: ProfilePropsTypes) {
  const { currentUser } = useAppContext()
  const [openModal, setOpenModal] = useState(false)

  const lastUpdate = Application.getLastUpdateTimeAsync().then(console.log)

  const handleLogOut = async () => {
    await signOut(firebaseConfigs.auth)
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <HStack px={'10'}>
            <Ionicons name='exit-outline' size={24} color={BASE_COLOR.text.primary} />
            <Text mx={2} fontSize='md' fontWeight='bold' color={BASE_COLOR.text.primary}>
              Keluar
            </Text>
          </HStack>
        </TouchableOpacity>
      )
    })
  }, [])
  return (
    <Layout>
      <VStack
        backgroundColor='#FFF'
        p={3}
        px={3}
        space={2}
        borderWidth={1}
        borderColor='gray.200'
        my={5}
        borderRadius='5'
        rounded='md'
      >
        <VStack alignItems='center' space={2}>
          <Avatar
            backgroundColor={BASE_COLOR.primary}
            size='xl'
            source={{
              uri: 'https://vasundharaodisha.org/upload/84552no-user.jpg'
            }}
          />

          <Text fontFamily='lato' fontSize='xl' color={BASE_COLOR.text.primary}>
            {currentUser.userName}
          </Text>
          <Text color={BASE_COLOR.text.primary}>{currentUser.userEmail}</Text>
        </VStack>
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
