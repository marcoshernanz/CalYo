import { defineTable } from "convex/server";
import { v } from "convex/values";

export const foodsFields = {
  identity: v.union(
    v.object({
      source: v.literal("fdc"),
      id: v.number(),
      dataType: v.union(
        v.literal("Foundation"),
        v.literal("Legacy"),
        v.literal("Survey")
      ),
    })
  ),

  name: v.object({
    en: v.string(),
    es: v.optional(v.string()),
  }),
  category: v.optional(
    v.object({ en: v.string(), es: v.optional(v.string()) })
  ),

  macroNutrients: v.object({
    protein: v.number(),
    fat: v.number(),
    carbs: v.number(),
  }),
  microNutrients: v.object({
    // --- 1. Proximates & Energy ---
    proximates: v.optional(
      v.object({
        water: v.optional(v.number()),
        ash: v.optional(v.number()),
        alcohol: v.optional(v.number()),
        caffeine: v.optional(v.number()),
        theobromine: v.optional(v.number()),
        energyKcalAtwaterGeneral: v.optional(v.number()),
        energyKcalAtwaterSpecific: v.optional(v.number()),
        energyKj: v.optional(v.number()),
        specificGravity: v.optional(v.number()),
      })
    ),

    // --- 2. Carbohydrates ---
    carbohydrates: v.optional(
      v.object({
        totalByDifference: v.optional(v.number()),
        totalBySummation: v.optional(v.number()),
        starch: v.optional(v.number()),
        resistantStarch: v.optional(v.number()),

        // Sugars
        sugarsTotal: v.optional(v.number()),
        sucrose: v.optional(v.number()),
        glucose: v.optional(v.number()),
        fructose: v.optional(v.number()),
        lactose: v.optional(v.number()),
        maltose: v.optional(v.number()),
        galactose: v.optional(v.number()),
        raffinose: v.optional(v.number()),
        stachyose: v.optional(v.number()),
        verbascose: v.optional(v.number()),

        // Fiber
        fiberTotalDietary: v.optional(v.number()),
        fiberSoluble: v.optional(v.number()),
        fiberInsoluble: v.optional(v.number()),
        fiberHighMolecularWeight: v.optional(v.number()),
        fiberLowMolecularWeight: v.optional(v.number()),
      })
    ),

    // --- 3. Minerals ---
    minerals: v.optional(
      v.object({
        calcium: v.optional(v.number()),
        iron: v.optional(v.number()),
        magnesium: v.optional(v.number()),
        phosphorus: v.optional(v.number()),
        potassium: v.optional(v.number()),
        sodium: v.optional(v.number()),
        zinc: v.optional(v.number()),
        copper: v.optional(v.number()),
        manganese: v.optional(v.number()),
        selenium: v.optional(v.number()),
        fluoride: v.optional(v.number()),
        iodine: v.optional(v.number()),
        molybdenum: v.optional(v.number()),
        cobalt: v.optional(v.number()),
        boron: v.optional(v.number()),
        nickel: v.optional(v.number()),
        sulfur: v.optional(v.number()),
      })
    ),

    // --- 4. Vitamins ---
    vitamins: v.optional(
      v.object({
        // Water Soluble
        vitaminC: v.optional(v.number()), // Total ascorbic acid
        thiamin: v.optional(v.number()), // B1
        riboflavin: v.optional(v.number()), // B2
        niacin: v.optional(v.number()), // B3
        pantothenicAcid: v.optional(v.number()), // B5
        vitaminB6: v.optional(v.number()),
        biotin: v.optional(v.number()), // g B7
        vitaminB12: v.optional(v.number()),
        vitaminB12Added: v.optional(v.number()),

        // Folate
        folateTotal: v.optional(v.number()),
        folicAcid: v.optional(v.number()),
        folateFood: v.optional(v.number()),
        folateDFE: v.optional(v.number()), // Dietary Folate Equivalents
        folate5MTHF: v.optional(v.number()), // 5-methyl tetrahydrofolate
        folate10HCOFA: v.optional(v.number()), // 10-Formyl folic acid
        folate5HCOH4: v.optional(v.number()), // 5-Formyltetrahydrofolic acid

        // Choline
        cholineTotal: v.optional(v.number()),
        cholineFree: v.optional(v.number()),
        cholinePhosphocholine: v.optional(v.number()),
        cholinePhosphotidyl: v.optional(v.number()),
        cholineGlycerophosphocholine: v.optional(v.number()),
        cholineSphingomyelin: v.optional(v.number()),
        betaine: v.optional(v.number()),

        // Vitamin A & Carotenoids
        vitaminARAE: v.optional(v.number()), // Retinol Activity Equivalents
        vitaminAIU: v.optional(v.number()),
        vitaminA: v.optional(v.number()),
        retinol: v.optional(v.number()),
        betaCarotene: v.optional(v.number()),
        alphaCarotene: v.optional(v.number()),
        betaCryptoxanthin: v.optional(v.number()),
        lycopene: v.optional(v.number()),
        lutein: v.optional(v.number()),
        zeaxanthin: v.optional(v.number()),
        luteinZeaxanthin: v.optional(v.number()),
        phytoene: v.optional(v.number()),
        phytofluene: v.optional(v.number()),
        gammaCarotene: v.optional(v.number()),
        alphaCryptoxanthin: v.optional(v.number()),
        cisBetaCarotene: v.optional(v.number()),
        transBetaCarotene: v.optional(v.number()),
        cisLycopene: v.optional(v.number()),
        transLycopene: v.optional(v.number()),
        cisLuteinZeaxanthin: v.optional(v.number()),

        // Vitamin D
        vitaminD_IU: v.optional(v.number()),
        vitaminD_D2D3: v.optional(v.number()),
        vitaminD2: v.optional(v.number()), // ergocalciferol
        vitaminD3: v.optional(v.number()), // cholecalciferol
        vitaminD4: v.optional(v.number()),
        hydroxy25D3: v.optional(v.number()),

        // Vitamin E
        vitaminE: v.optional(v.number()), // alpha-tocopherol
        vitaminEAdded: v.optional(v.number()),
        betaTocopherol: v.optional(v.number()),
        gammaTocopherol: v.optional(v.number()),
        deltaTocopherol: v.optional(v.number()),
        alphaTocotrienol: v.optional(v.number()),
        betaTocotrienol: v.optional(v.number()),
        gammaTocotrienol: v.optional(v.number()),
        deltaTocotrienol: v.optional(v.number()),

        // Vitamin K
        vitaminKPhylloquinone: v.optional(v.number()), // K1
        vitaminKMenaquinone4: v.optional(v.number()), // K2
        vitaminKDihydrophylloquinone: v.optional(v.number()),
      })
    ),

    // --- 5. Lipids (Fatty Acids) ---
    lipids: v.optional(
      v.object({
        cholesterol: v.optional(v.number()),
        phytosterols: v.optional(v.number()),
        stigmasterol: v.optional(v.number()),
        campesterol: v.optional(v.number()),
        betaSitosterol: v.optional(v.number()),
        campestanol: v.optional(v.number()),
        betaSitostanol: v.optional(v.number()),
        ergosterol: v.optional(v.number()),
        delta5Avenasterol: v.optional(v.number()),
        delta7Stigmastenol: v.optional(v.number()),
        ergosta7Enol: v.optional(v.number()),
        ergosta7_22Dienol: v.optional(v.number()),
        ergosta5_7Dienol: v.optional(v.number()),
        stigmastadiene: v.optional(v.number()),

        // Saturated Fats (SFA) - g
        sfa_total: v.optional(v.number()), // Fatty acids, total saturated
        sfa_4_0: v.optional(v.number()), // Butyric
        sfa_5_0: v.optional(v.number()),
        sfa_6_0: v.optional(v.number()), // Caproic
        sfa_7_0: v.optional(v.number()),
        sfa_8_0: v.optional(v.number()), // Caprylic
        sfa_9_0: v.optional(v.number()),
        sfa_10_0: v.optional(v.number()), // Capric
        sfa_11_0: v.optional(v.number()),
        sfa_12_0: v.optional(v.number()), // Lauric
        sfa_13_0: v.optional(v.number()),
        sfa_14_0: v.optional(v.number()), // Myristic
        sfa_15_0: v.optional(v.number()),
        sfa_16_0: v.optional(v.number()), // Palmitic
        sfa_17_0: v.optional(v.number()), // Margaric
        sfa_18_0: v.optional(v.number()), // Stearic
        sfa_20_0: v.optional(v.number()), // Arachidic
        sfa_21_0: v.optional(v.number()),
        sfa_22_0: v.optional(v.number()), // Behenic
        sfa_23_0: v.optional(v.number()),
        sfa_24_0: v.optional(v.number()), // Lignoceric

        // Monounsaturated Fats (MUFA) - g
        mufa_total: v.optional(v.number()), // Fatty acids, total monounsaturated
        mufa_12_1: v.optional(v.number()),
        mufa_14_1_c: v.optional(v.number()),
        mufa_15_1: v.optional(v.number()),
        mufa_16_1_c: v.optional(v.number()),
        mufa_17_1: v.optional(v.number()),
        mufa_17_1_c: v.optional(v.number()),
        mufa_18_1_c: v.optional(v.number()), // Oleic
        mufa_18_1_t_n7: v.optional(v.number()), // Vaccenic
        mufa_20_1_c: v.optional(v.number()), // Gadoleic
        mufa_22_1_c: v.optional(v.number()), // Erucic
        mufa_22_1_n9: v.optional(v.number()),
        mufa_22_1_n11: v.optional(v.number()),
        mufa_24_1_c: v.optional(v.number()), // Nervonic

        // Polyunsaturated Fats (PUFA) - g
        pufa_total: v.optional(v.number()), // Fatty acids, total polyunsaturated
        pufa_18_2_c: v.optional(v.number()), // Linoleic
        pufa_18_2_n6_cc: v.optional(v.number()),
        pufa_18_2_cla: v.optional(v.number()), // Conjugated Linoleic
        pufa_18_2_i: v.optional(v.number()), // Mixed isomers
        pufa_18_3_c: v.optional(v.number()),
        pufa_18_3_n3_ccc: v.optional(v.number()), // ALA
        pufa_18_3_n6_ccc: v.optional(v.number()), // GLA
        pufa_18_3_i: v.optional(v.number()),
        pufa_18_4: v.optional(v.number()), // Stearidonic
        pufa_20_2_c: v.optional(v.number()),
        pufa_20_2_n6_cc: v.optional(v.number()),
        pufa_20_3_c: v.optional(v.number()),
        pufa_20_3_n3: v.optional(v.number()),
        pufa_20_3_n6: v.optional(v.number()),
        pufa_20_3_n9: v.optional(v.number()),
        pufa_20_4_c: v.optional(v.number()),
        pufa_20_4_n6: v.optional(v.number()), // Arachidonic
        pufa_20_5_c: v.optional(v.number()),
        pufa_20_5_n3: v.optional(v.number()), // EPA
        pufa_21_5: v.optional(v.number()),
        pufa_22_2: v.optional(v.number()),
        pufa_22_3: v.optional(v.number()),
        pufa_22_4: v.optional(v.number()),
        pufa_22_5_c: v.optional(v.number()),
        pufa_22_5_n3: v.optional(v.number()), // DPA
        pufa_22_6_c: v.optional(v.number()),
        pufa_22_6_n3: v.optional(v.number()), // DHA

        // Trans Fats - g
        trans_total: v.optional(v.number()), // Fatty acids, total trans
        trans_monoenoic: v.optional(v.number()),
        trans_dienoic: v.optional(v.number()),
        trans_polyenoic: v.optional(v.number()),
        tfa_14_1_t: v.optional(v.number()),
        tfa_16_1_t: v.optional(v.number()),
        tfa_18_1_t: v.optional(v.number()),
        tfa_18_2_t: v.optional(v.number()),
        tfa_18_2_t_not_defined: v.optional(v.number()),
        tfa_18_2_tt: v.optional(v.number()),
        tfa_18_3_t: v.optional(v.number()),
        tfa_20_1_t: v.optional(v.number()),
        tfa_22_1_t: v.optional(v.number()),
      })
    ),

    // --- 6. Amino Acids (Protein Components) ---
    aminoAcids: v.optional(
      v.object({
        tryptophan: v.optional(v.number()),
        threonine: v.optional(v.number()),
        isoleucine: v.optional(v.number()),
        leucine: v.optional(v.number()),
        lysine: v.optional(v.number()),
        methionine: v.optional(v.number()),
        cystine: v.optional(v.number()),
        cysteine: v.optional(v.number()),
        phenylalanine: v.optional(v.number()),
        tyrosine: v.optional(v.number()),
        valine: v.optional(v.number()),
        arginine: v.optional(v.number()),
        histidine: v.optional(v.number()),
        alanine: v.optional(v.number()),
        asparticAcid: v.optional(v.number()),
        glutamicAcid: v.optional(v.number()),
        glycine: v.optional(v.number()),
        proline: v.optional(v.number()),
        serine: v.optional(v.number()),
        hydroxyproline: v.optional(v.number()),
        glutathione: v.optional(v.number()),
      })
    ),

    // --- 7. Organic Acids & Flavonoids ---
    other: v.optional(
      v.object({
        citricAcid: v.optional(v.number()),
        malicAcid: v.optional(v.number()),
        oxalicAcid: v.optional(v.number()),
        pyruvicAcid: v.optional(v.number()),
        quinicAcid: v.optional(v.number()),
        daidzein: v.optional(v.number()),
        genistein: v.optional(v.number()),
        daidzin: v.optional(v.number()),
        genistin: v.optional(v.number()),
        glycitin: v.optional(v.number()),
        ergothioneine: v.optional(v.number()),
        betaGlucan: v.optional(v.number()),
      })
    ),
  }),

  embedding: v.optional(v.array(v.float64())),
  hasEmbedding: v.boolean(),
};

export const foods = defineTable(foodsFields)
  .index("byIdentitySourceId", ["identity.source", "identity.id"])
  .index("byHasEmbedding", ["hasEmbedding"])
  .vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
    filterFields: ["identity.source"],
  });
