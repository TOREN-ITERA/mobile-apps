import { Box, HStack, ScrollView, Skeleton, VStack } from "native-base";
import { memo } from "react";

const HomeScreenSkeleton = () => {
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<VStack space="1" rounded="md">
				<Box p="3" borderWidth="1" borderColor="gray.100" backgroundColor="#FFF">
					<HStack space="3" my="1">
						<VStack flex="3" space="4">
							<Skeleton h="5" w="64" rounded="xl" />
							<HStack space="2" alignItems="center">
								<Skeleton h="10" w="20" rounded="xl" />
								<Skeleton h="10" w="20" rounded="xl" />
							</HStack>
						</VStack>
					</HStack>
				</Box>

				<Box my="5" p="5" borderWidth="1" borderColor="gray.100" backgroundColor="#FFF">
					{[...Array(2).keys()].map((item) => (
						<HStack key={item} space="3" my="1">
							<Skeleton size="20" rounded="full" />
							<Skeleton size="20" rounded="full" />
							<Skeleton size="20" rounded="full" />
							<Skeleton size="20" rounded="full" />
						</HStack>
					))}
				</Box>

				{[...Array(2).keys()].map((item) => (
					<Box
						key={item}
						mt="5"
						p="3"
						borderWidth="1"
						borderColor="gray.100"
						backgroundColor="#FFF"
					>
						<HStack space="3" my="1">
							<Skeleton size="20" rounded="full" />
							<VStack flex="3" space="4">
								<Skeleton.Text />
								<HStack space="2" alignItems="center">
									<Skeleton h="8" w="20" rounded="xl" />
									<Skeleton h="8" w="20" rounded="xl" />
									<Skeleton h="8" w="20" rounded="xl" />
								</HStack>
							</VStack>
						</HStack>
					</Box>
				))}
			</VStack>
		</ScrollView>
	);
};

export default memo(HomeScreenSkeleton);
