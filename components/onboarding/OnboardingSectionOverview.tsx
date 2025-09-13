import Description from "@/components/ui/Description";
import Header from "@/components/ui/Header";
import Title from "@/components/ui/Title";
import { StyleSheet, View } from "react-native";
import Text from "@/components/ui/Text";
import getColor from "@/lib/utils/getColor";
import { CheckIcon } from "lucide-react-native";

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

export default function OnboardingSectionOverview({
  section: sectionNumber,
}: Props) {
  return (
    <>
      <Header style={styles.header}>
        <Title>¡Empecemos!</Title>
        <Description>Tu programa personalizado te espera</Description>
      </Header>
      <View style={styles.container}>
        {sections.map((section, index) => (
          <View
            key={`${section.title}-${index}`}
            style={styles.sectionContainer}
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
                  style={[
                    styles.numberText,
                    {
                      color:
                        index <= sectionNumber
                          ? getColor("background")
                          : getColor("foreground"),
                    },
                  ]}
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
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    gap: 24,
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
    backgroundColor: getColor("secondary"),
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontWeight: 500,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
});
