import React from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import { CircleQuestionMarkIcon } from "lucide-react-native";
import getColor from "@/lib/ui/getColor";
import Text from "@/components/ui/Text";
import { View, Linking } from "react-native";

export default function PlanInfoSheet() {
  return (
    <BottomSheet
      Trigger={
        <Button
          variant="base"
          size="base"
          style={{ position: "absolute", right: 0 }}
          hitSlop={100}
        >
          <CircleQuestionMarkIcon size={22} color={getColor("foreground")} />
        </Button>
      }
    >
      <View style={{ gap: 32 }}>
        <View style={{ gap: 8 }}>
          <Text size="16" weight="600">
            Aviso Médico
          </Text>
          <Text size="14">
            Esta aplicación ofrece estimaciones con fines informativos y no
            sustituye el consejo médico profesional. Consulte siempre a un
            médico antes de realizar cambios en su dieta o actividad física.
          </Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text size="16" weight="600">
            Metodología y Fuentes
          </Text>
          <View style={{ gap: 8 }}>
            <Text size="14">
              &bull;{" "}
              <Text size="14" weight="600">
                Tasa Metabólica Basal (TMB):
              </Text>{" "}
              Calculada mediante la ecuación de Mifflin-St Jeor.{" "}
              <Text
                size="14"
                style={{ textDecorationLine: "underline" }}
                onPress={() =>
                  void Linking.openURL(
                    "https://pubmed.ncbi.nlm.nih.gov/2305711/"
                  )
                }
              >
                (Mifflin et al., 1990)
              </Text>
              .
            </Text>
            <Text size="14">
              &bull;{" "}
              <Text size="14" weight="600">
                Gasto Energético:
              </Text>{" "}
              Estimado según el Compendio de Actividades Físicas.{" "}
              <Text
                size="14"
                style={{ textDecorationLine: "underline" }}
                onPress={() =>
                  void Linking.openURL(
                    "https://pubmed.ncbi.nlm.nih.gov/21681120/"
                  )
                }
              >
                (Ainsworth et al., 2011)
              </Text>
              .
            </Text>
            <Text size="14">
              &bull;{" "}
              <Text size="14" weight="600">
                Seguridad:
              </Text>{" "}
              Los límites mínimos de calorías se basan en las{" "}
              <Text
                size="14"
                style={{ textDecorationLine: "underline" }}
                onPress={() =>
                  void Linking.openURL(
                    "https://www.dietaryguidelines.gov/sites/default/files/2020-12/Dietary_Guidelines_for_Americans_2020-2025.pdf"
                  )
                }
              >
                Guías Alimentarias para los Estadounidenses (2020-2025)
              </Text>
              .
            </Text>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
