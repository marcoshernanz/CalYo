import Description from "@/components/ui/Description";
import Header from "@/components/ui/Header";
import Title from "@/components/ui/Title";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Text from "@/components/ui/Text";
import getColor from "@/lib/ui/getColor";
import { CheckIcon } from "lucide-react-native";
import { useState } from "react";
import SafeArea from "../ui/SafeArea";

const sections = [
  {
    title: "Fundamentos",
    description:
      "Empezaremos conociéndote y entendiendo tu metabolismo para sentar la base de tu programa personalizado.",
  },
  {
    title: "Objetivo",
    description:
      "Define tu meta y Calyo diseñará un programa para ayudarte a alcanzarla.",
  },
  {
    title: "Programa",
    description:
      "Comparte tus preferencias alimentarias y tus hábitos de ejercicio para afinar tu programa a medida.",
  },
];

interface Props {
  section: number;
}

export default function OnboardingSection({ section: sectionNumber }: Props) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  const handleRowLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, y, height } = event.nativeEvent.layout;
    const circleSize = 36;
    setPositions((prev) => {
      const next = [...prev];
      next[index] = { x: x + circleSize / 2, y: y + height / 2 };
      return next;
    });
  };

  return (
    <SafeArea style={styles.safeArea} edges={["left", "right"]}>
      <Header style={styles.header}>
        <Title>¡Empecemos!</Title>
        <Description>Tu programa personalizado te espera</Description>
      </Header>
      <View style={styles.container}>
        {positions.length === sections.length &&
          positions.slice(0, -1).map((pos, index) => {
            const next = positions[index + 1];
            return (
              <View
                key={`line-${index}`}
                style={[
                  styles.line,
                  {
                    left: pos.x,
                    top: pos.y,
                    height: next.y - pos.y,
                    backgroundColor:
                      index < sectionNumber
                        ? getColor("foreground")
                        : getColor("secondary"),
                  },
                ]}
              />
            );
          })}
        {sections.map((section, index) => (
          <View
            key={`${section.title}-${index}`}
            style={styles.sectionContainer}
            onLayout={(event) => handleRowLayout(index, event)}
          >
            <View
              style={[
                styles.numberContainer,
                {
                  backgroundColor:
                    index <= sectionNumber
                      ? getColor("foreground")
                      : getColor("secondary"),
                },
              ]}
            >
              {index >= sectionNumber ? (
                <Text
                  weight="500"
                  color={
                    index <= sectionNumber
                      ? getColor("background")
                      : getColor("foreground")
                  }
                >
                  {index + 1}
                </Text>
              ) : (
                <CheckIcon
                  size={18}
                  strokeWidth={2.5}
                  color={getColor("background")}
                />
              )}
            </View>
            <View style={styles.textContainer}>
              <Title
                size="16"
                style={{
                  color:
                    index === sectionNumber
                      ? getColor("foreground")
                      : getColor("mutedForeground"),
                }}
              >
                {section.title}
              </Title>
              {index === sectionNumber && (
                <Description size="14">{section.description}</Description>
              )}
            </View>
          </View>
        ))}
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingVertical: 24,
    flex: 1,
    gap: 36,
  },
  header: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    gap: 28,
  },
  line: {
    position: "absolute",
    transform: [{ translateX: "-50%" }],
    width: 2,
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numberContainer: {
    height: 36,
    width: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
});
