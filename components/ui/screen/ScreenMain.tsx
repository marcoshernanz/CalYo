import { ComponentProps } from "react";
import SafeArea from "../SafeArea";
import Animated from "react-native-reanimated";
import { ScrollViewProps, StyleSheet, View } from "react-native";
import WithSkeleton from "../WithSkeleton";
import Text from "../Text";
import getColor from "@/lib/ui/getColor";

export function ScreenMain(props: ComponentProps<typeof SafeArea>) {
  return <SafeArea {...props} />;
}

export function ScreenMainScrollView({
  children,
  scrollViewProps,
  safeAreaProps,
}: {
  children: React.ReactNode;
  scrollViewProps?: ScrollViewProps;
  safeAreaProps?: ComponentProps<typeof SafeArea>;
}) {
  return (
    <Animated.ScrollView
      contentContainerStyle={styles.scrollView}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      <SafeArea {...safeAreaProps}>{children}</SafeArea>
    </Animated.ScrollView>
  );
}

export function ScreenMainTitle({
  title,
  description,
  loading = false,
}: {
  title?: string;
  description?: string;
  loading?: boolean;
}) {
  return (
    <View style={styles.titleContainer}>
      <WithSkeleton
        loading={loading}
        skeletonStyle={{
          height: 22,
          width: "75%",
          borderRadius: 8,
        }}
      >
        <Text weight="600" style={styles.title}>
          {title}
        </Text>
      </WithSkeleton>
      {description && (
        <Text size="14" color={getColor("mutedForeground")}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  titleContainer: {
    paddingBottom: 16,
    gap: 4,
  },
  title: {
    fontSize: 22,
  },
});
