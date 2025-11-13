import { ProfileData } from "@/convex/tables/profiles";

type Params = {
  weeklyWorkouts: ProfileData["weeklyWorkouts"];
  training: ProfileData["training"];
  weight: number;
  liftingExperience: ProfileData["liftingExperience"];
  cardioExperience: ProfileData["cardioExperience"];
};

const workoutsMap: Record<ProfileData["weeklyWorkouts"], number> = {
  "0-2": 1.5,
  "3-5": 4,
  "6+": 6.5,
};

export default function computeExerciseCalories({
  weeklyWorkouts,
  training,
  weight,
  liftingExperience,
  cardioExperience,
}: Params) {
  const totalWeeklySessions = workoutsMap[weeklyWorkouts];
  const { lifting: liftSessions, cardio: cardioSessions } = sessionsSplit({
    totalWeeklySessions,
    training,
  });

  const liftKcalPerSession = caloriesPerSession({
    weight,
    experience: liftingExperience,
    metType: "lifting",
  });
  const cardKcalPerSession = caloriesPerSession({
    weight,
    experience: cardioExperience,
    metType: "cardio",
  });

  const weeklyExerciseCalories =
    liftSessions * liftKcalPerSession + cardioSessions * cardKcalPerSession;
  const exerciseCaloriesPerDay = weeklyExerciseCalories / 7;

  return exerciseCaloriesPerDay;
}

function sessionsSplit({
  totalWeeklySessions,
  training,
}: {
  totalWeeklySessions: number;
  training: ProfileData["training"];
}) {
  if (training === "none") {
    return { lifting: 0, cardio: 0 };
  } else if (training === "lifting") {
    return { lifting: totalWeeklySessions, cardio: 0 };
  } else if (training === "cardio") {
    return { lifting: 0, cardio: totalWeeklySessions };
  }

  const lifting = Math.max(0, Math.round(totalWeeklySessions * 0.6));
  const cardio = Math.max(0, totalWeeklySessions - lifting);
  return { lifting, cardio };
}

type MetType = "lifting" | "cardio";

const mets: Record<
  MetType,
  Record<ProfileData["liftingExperience"], number>
> = {
  lifting: { none: 2.0, beginner: 3.5, intermediate: 5.0, advanced: 6.0 },
  cardio: { none: 2.5, beginner: 5.0, intermediate: 7.0, advanced: 9.0 },
};

const sessionMinutes: Record<
  MetType,
  Record<ProfileData["liftingExperience"], number>
> = {
  lifting: { none: 0, beginner: 45, intermediate: 60, advanced: 70 },
  cardio: { none: 0, beginner: 35, intermediate: 45, advanced: 55 },
};

function caloriesPerSession({
  weight,
  experience,
  metType,
}: {
  weight: number;
  experience: ProfileData["liftingExperience"];
  metType: MetType;
}) {
  const met = mets[metType][experience];
  const minutes = sessionMinutes[metType][experience];
  const calories = ((met * 3.5 * weight) / 200) * minutes;

  return calories;
}
