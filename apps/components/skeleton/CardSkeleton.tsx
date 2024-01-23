import { Center, HStack, Skeleton, VStack } from "native-base";
import { widthPercentage } from "../../utilities/dimension";

export default function CardSkeleton() {
  return (
    <VStack
      w={widthPercentage(47)}
      maxW="400"
      borderWidth="1"
      borderColor="gray.100"
      backgroundColor="#FFF"
      space={3}
      overflow="hidden"
      rounded="md"
    >
      <Skeleton h="32" />
      <Skeleton.Text px="4" />
      <Skeleton px="4" my="2" rounded="md" />
    </VStack>
  );
}
