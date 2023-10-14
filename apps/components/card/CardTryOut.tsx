import { HStack, Text, VStack } from "native-base";
import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { BASE_COLOR } from "../../utilities/baseColor";
import { widthPercentage } from "../../utilities/dimension";
import { ButtonPrimary } from "../button/ButtonPrimary";

export interface CardTryOutTypes {
	id: string;
	title: string;
	exampTotal: number;
	time: number;
	onPress?: any;
	coinTotal?: number;
	category?: string;
	isFree: boolean;
	showTotalCoin?: boolean;
}

export const CardTryOut = (props: CardTryOutTypes) => {
	const { title, exampTotal, time, coinTotal, isFree, onPress, showTotalCoin } = props;

	return (
		<TouchableOpacity activeOpacity={0.7} onPress={onPress}>
			<HStack
				space={3}
				borderWidth={1}
				backgroundColor="white"
				borderColor="gray.200"
				my={1}
				h="100"
				p={2}
				borderRadius="5"
				rounded="md"
			>
				<VStack alignItems="center" justifyContent="center">
					<FontAwesome5 name="medal" size={50} color={BASE_COLOR.primary} />
				</VStack>
				<VStack justifyContent="space-between" width={widthPercentage(75)}>
					<HStack justifyContent="space-between">
						<Text
							fontSize="md"
							fontFamily="lato"
							fontWeight="extrabold"
							color={BASE_COLOR.text.primary}
						>
							{title}
						</Text>
						{isFree && showTotalCoin && (
							<HStack space={1}>
								<MaterialIcons name="verified" size={24} color={BASE_COLOR.primary} />
								<Text fontSize="sm" fontWeight="bold" color={BASE_COLOR.primary}>
									free
								</Text>
							</HStack>
						)}
						{!isFree && showTotalCoin && (
							<HStack space={1}>
								<FontAwesome5 name="bitcoin" size={24} color="#FFD700" />
								<Text fontSize="sm" fontWeight="bold" color={BASE_COLOR.text.primary}>
									{coinTotal}
								</Text>
							</HStack>
						)}
					</HStack>

					<HStack space={5} justifyContent="space-between" alignItems="flex-end">
						<HStack space={5} alignItems="flex-end">
							<HStack alignItems="flex-end" space={1}>
								<MaterialIcons name="timer" size={24} color={BASE_COLOR.text.primary} />
								<Text fontSize="xs" color="gray.500">
									{time} menit
								</Text>
							</HStack>
							<HStack space={1}>
								<FontAwesome5 name="book" size={15} color={BASE_COLOR.text.primary} />
								<Text fontSize="xs" color="gray.500">
									{exampTotal} soal
								</Text>
							</HStack>
						</HStack>

						<ButtonPrimary title="Mulai" onPress={onPress} />
					</HStack>
				</VStack>
			</HStack>
		</TouchableOpacity>
	);
};
