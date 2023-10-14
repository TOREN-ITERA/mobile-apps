import { Box, HStack, ScrollView, Skeleton, VStack } from "native-base";
import { memo } from "react";

const ListSkeleton = () => {
	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<VStack space="1" rounded="md">
				{[...Array(5).keys()].map((item: number) => (
					<Box
						key={item}
						mt="1"
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

export default memo(ListSkeleton);
