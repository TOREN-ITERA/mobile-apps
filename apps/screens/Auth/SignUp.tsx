import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../configs/firebase'

import {
  Box,
  FormControl,
  Heading,
  HStack,
  Icon,
  Input,
  Link,
  Pressable,
  ScrollView,
  Text,
  VStack,
  WarningOutlineIcon
} from 'native-base'

import { useContext, useState } from 'react'
import Layout from '../../components/Layout'
import { RootParamList } from '../../navigations'
import { BASE_COLOR } from '../../utilities/baseColor'
import { MaterialIcons } from '@expo/vector-icons'
import { FirestoreDB } from '../../firebase/firebaseDB'
import { NotificationsTypes, UserInfoTypes } from '../../types/index'
import * as Application from 'expo-application'
import { uniqueId } from '../../utilities/generateUniqueId'
import { generateDateTime } from '../../utilities/generateDateTime'
import { RootContext } from '../../utilities/rootContext'
import { ContextApiTypes } from '../../types/index'

type SignUpScreenPropsTypes = NativeStackScreenProps<RootParamList, 'SignUp'>

export default function SignUpScreen({ navigation }: SignUpScreenPropsTypes) {
  const { appInfo } = useContext<ContextApiTypes>(RootContext)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  const [errorInput, setErrorInput] = useState({
    inputName: '',
    isError: false,
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSetEmail = (input: string) => {
    setEmail(input)
    setErrorInput({ inputName: '', isError: false, message: '' })
  }

  const handleSetName = (input: string) => {
    setName(input)
    setErrorInput({ inputName: '', isError: false, message: '' })
  }

  const handleSetPassword = (input: string) => {
    setPassword(input)
    setErrorInput({ inputName: '', isError: false, message: '' })
  }

  const handleSetReferralCode = (input: string) => {
    setReferralCode(input)
    setErrorInput({ inputName: '', isError: false, message: '' })
  }

  interface ValidateReferralCodeTypes {
    referralCode: string
    currentUserName: string
  }

  const validateReferralCode = async ({
    referralCode,
    currentUserName
  }: ValidateReferralCodeTypes) => {
    const userDB = new FirestoreDB('User')

    const checkReferralCode = await userDB.queryCollection({
      params_1: 'referralCode',
      params_2: referralCode
    })

    console.log(checkReferralCode)

    if (checkReferralCode.length === 0) throw Error('kode referral tidak ditemukan!')

    const checkDeviceId = await userDB.queryCollection({
      params_1: 'deviceId',
      params_2: Application.androidId
    })

    console.log(checkDeviceId)

    if (checkDeviceId.length !== 0)
      throw Error(
        'kode referral telah digunakan, kamu tidak bisa memakai kode referral lebih dari satu dalam satu device yang sama'
      )

    const documentIdUserReferrer = referralCode.split('-')[1]

    const notification: NotificationsTypes = {
      id: Date.now() + '',
      message: `${currentUserName} telah menggunakan kode referral mu, selamat koin mu telah bertambah ${appInfo.payment.totalCoinReferral}`,
      createdAt: generateDateTime()
    }

    const newData = {
      coin: userDB.incrementValue(appInfo.payment.totalCoinReferral),
      notifications: userDB.pushArray(notification)
    }

    await userDB.update({
      documentId: documentIdUserReferrer,
      newData: newData
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    let inputName = 'default'
    try {
      if (email === '') {
        inputName = 'email'
        throw Error('email tidak boleh kosong!')
      }

      if (name === '') {
        inputName = 'name'
        throw Error('nama tidak boleh kosong!')
      }

      if (name.length < 5 || name.length > 15) {
        inputName = 'name'
        throw Error('panjang nama min 5 - 15 karakter !')
      }

      if (password === '') {
        inputName = 'password'
        throw Error('password tidak boleh kosong!')
      }

      if (password.length < 6) {
        inputName = 'password'
        throw Error('gunakan password minimal 6 karakter!')
      }

      if (referralCode !== '') {
        inputName = 'referralCode'
        await validateReferralCode({ referralCode: referralCode, currentUserName: name })
      }

      await createUserWithEmailAndPassword(auth, email, password)

      const currentDateTime = new Date()
      const userDb = new FirestoreDB('User')

      const userData: UserInfoTypes = {
        name: name,
        email: email.toLocaleLowerCase(),
        password: password,
        coin: appInfo.payment.totalFreeCoin || 0,
        deviceId: Application.androidId + '',
        referralCode: `${uniqueId()}-${email.toLocaleLowerCase()}`,
        notifications: [
          {
            id: Date.now() + '',
            message: `Hi ${name}.. selamat datang di Edufire`,
            createdAt: currentDateTime.toDateString()
          }
        ],
        waitingListTransaction: [],
        transactionHistory: []
      }

      await userDb.set({
        documentId: email.toLocaleLowerCase(),
        data: userData
      })
    } catch (error: any) {
      console.log(error)
      switch (error.code) {
        case 'auth/invalid-email':
          inputName = 'email'
          error.message = 'Opss... email tidak valid'
          break
        case 'auth/email-already-in-use':
          inputName = 'email'
          error.message = 'email sudah digunakan'
          break
        case 'auth/weak-password':
          inputName = 'password'
          error.message = 'password tidak aman. gunakan password lain!'
          break
      }
      setErrorInput({ inputName: inputName, isError: true, message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box safeArea p='2' py='8'>
          <Heading
            size='lg'
            fontWeight='600'
            color='coolGray.800'
            _dark={{
              color: 'warmGray.50'
            }}
          >
            Welcome
          </Heading>
          <Heading
            mt='1'
            _dark={{
              color: 'warmGray.200'
            }}
            color='coolGray.600'
            fontWeight='medium'
            size='xs'
          >
            Sign up to continue!
          </Heading>

          <VStack space={1} mt='5'>
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                isInvalid={errorInput.isError && errorInput.inputName === 'email'}
                onChangeText={handleSetEmail}
                bgColor='#FFF'
                InputLeftElement={
                  <Icon
                    as={<MaterialIcons name='email' />}
                    size={5}
                    ml='2'
                    color='muted.400'
                  />
                }
                placeholder='E-mail'
                _focus={{
                  bg: BASE_COLOR.blue[100],
                  borderColor: BASE_COLOR.primary
                }}
              />
              <FormControl.ErrorMessage
                isInvalid={errorInput.isError && errorInput.inputName === 'email'}
                leftIcon={<WarningOutlineIcon size='xs' />}
                _text={{
                  fontSize: 'xs'
                }}
              >
                {errorInput.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>
              <FormControl.Label>Nama</FormControl.Label>
              <Input
                isInvalid={errorInput.isError && errorInput.inputName === 'name'}
                onChangeText={handleSetName}
                placeholder='nama'
                bgColor='#FFF'
                _focus={{
                  bg: BASE_COLOR.blue[100],
                  borderColor: BASE_COLOR.primary
                }}
              />
              <FormControl.ErrorMessage
                isInvalid={errorInput.isError && errorInput.inputName === 'name'}
                leftIcon={<WarningOutlineIcon size='xs' />}
                _text={{
                  fontSize: 'xs'
                }}
              >
                {errorInput.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                onChangeText={handleSetPassword}
                isInvalid={errorInput.isError && errorInput.inputName === 'password'}
                type={showPassword ? 'text' : 'password'}
                bgColor='#FFF'
                _focus={{
                  bg: BASE_COLOR.blue[100],
                  borderColor: BASE_COLOR.primary
                }}
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={showPassword ? 'visibility' : 'visibility-off'}
                        />
                      }
                      size={5}
                      mr='2'
                      color='muted.400'
                    />
                  </Pressable>
                }
                placeholder='Password'
              />
              <FormControl.ErrorMessage
                isInvalid={errorInput.isError && errorInput.inputName === 'password'}
                leftIcon={<WarningOutlineIcon size='xs' />}
                _text={{
                  fontSize: 'xs'
                }}
              >
                {errorInput.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl>
              <FormControl.ErrorMessage
                isInvalid={errorInput.isError && errorInput.inputName === 'default'}
                leftIcon={<WarningOutlineIcon size='xs' />}
                _text={{
                  fontSize: 'xs'
                }}
              >
                {errorInput.message}
              </FormControl.ErrorMessage>
            </FormControl>

            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              bg={BASE_COLOR.primary}
              p='2'
              mt='5'
              rounded='xl'
              _pressed={{ bg: BASE_COLOR.blue[200] }}
            >
              <Text textAlign='center' fontSize='xl' color='#FFF'>
                {isLoading ? 'Submit...' : 'Sign Up'}
              </Text>
            </Pressable>

            <HStack mt='6' space='2' justifyContent='center'>
              <Text
                fontSize='sm'
                color='coolGray.600'
                _dark={{
                  color: 'warmGray.200'
                }}
              >
                Sudah Punya Akun?
              </Text>
              <Link
                _text={{
                  color: 'indigo.500',
                  fontWeight: 'medium',
                  fontSize: 'sm'
                }}
                onPress={() => navigation.navigate('Login')}
              >
                Login
              </Link>
            </HStack>
          </VStack>
        </Box>
      </ScrollView>
    </Layout>
  )
}
