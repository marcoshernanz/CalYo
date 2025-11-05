type Params = {
  bmr: number;
  neatMultiplier: number;
  exerciseCalories: number;
}

export default function computeMaintenanceCalories({
  bmr,
  neatMultiplier,
  exerciseCalories,
}: Params) {
  const maintenanceCalories = bmr * neatMultiplier + exerciseCalories;
  return maintenanceCalories;
}
