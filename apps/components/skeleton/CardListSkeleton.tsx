import { Center, HStack, Skeleton, VStack } from "native-base";
import { widthPercentage } from "../../utilities/dimension";

export default function CardListSkeleton() {
  return (
    <HStack
      w={widthPercentage(100)}
      maxW="400"
      borderWidth="1"
      borderColor="gray.100"
      backgroundColor="#FFF"
      space={5}
      rounded="md"
      p="4"
    >
      <Skeleton flex="1" h="150" rounded="md" />
      <VStack flex="3" space="4">
        <Skeleton />
        <Skeleton.Text />
        <HStack space="2" alignItems="center">
          <Skeleton size="5" rounded="full" />
          <Skeleton h="3" flex="2" rounded="full" />
          <Skeleton h="3" flex="1" rounded="full" />
        </HStack>
      </VStack>
    </HStack>
  );
}
