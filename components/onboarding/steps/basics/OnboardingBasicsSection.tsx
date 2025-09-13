import Description from "@/components/ui/Description";
import Header from "@/components/ui/Header";
import Title from "@/components/ui/Title";
import { StyleSheet } from "react-native";

export default function OnboardingBasicsSection() {
  return (
    <>
      <Header style={styles.header}>
        <Title>¡Empecemos!</Title>
        <Description>Tu programa personalizado te espera</Description>
      </Header>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
});
