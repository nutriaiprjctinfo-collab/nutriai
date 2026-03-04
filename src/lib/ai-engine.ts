// AI Health Risk Prediction & Clinical Nutrition Engine
import type { UserProfile } from './storage';

export const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III';
};

export const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' => {
  if (score < 30) return 'Low';
  if (score < 60) return 'Medium';
  return 'High';
};

export const calculateObesityRisk = (profile: UserProfile): number => {
  const bmi = calculateBMI(profile.weight, profile.height);
  let risk = 0;
  if (bmi >= 30) risk += 40;
  else if (bmi >= 25) risk += 20;
  else if (bmi < 18.5) risk += 10;
  if (profile.age > 50) risk += 15;
  else if (profile.age > 35) risk += 8;
  if (profile.activityLevel === 'Sedentary') risk += 20;
  else if (profile.activityLevel === 'Light') risk += 10;
  if (['Diabetes', 'Obesity', 'Thyroid'].includes(profile.medicalCondition)) risk += 15;
  return Math.min(risk, 100);
};

export const calculateCardioRisk = (profile: UserProfile): number => {
  const bmi = calculateBMI(profile.weight, profile.height);
  let risk = 0;
  if (bmi >= 30) risk += 25;
  else if (bmi >= 25) risk += 12;
  if (profile.age > 55) risk += 25;
  else if (profile.age > 40) risk += 15;
  else if (profile.age > 30) risk += 5;
  if (profile.medicalCondition === 'Heart Disease') risk += 30;
  else if (profile.medicalCondition === 'Hypertension') risk += 20;
  else if (profile.medicalCondition === 'Diabetes') risk += 15;
  if (profile.activityLevel === 'Sedentary') risk += 15;
  if (profile.gender === 'Male') risk += 5;
  return Math.min(risk, 100);
};

export const calculateMetabolicRisk = (profile: UserProfile): 'Low' | 'Medium' | 'High' => {
  const bmi = calculateBMI(profile.weight, profile.height);
  let score = 0;
  if (bmi >= 30) score += 30;
  else if (bmi >= 25) score += 15;
  if (['Diabetes', 'Thyroid', 'Obesity'].includes(profile.medicalCondition)) score += 25;
  if (profile.activityLevel === 'Sedentary') score += 20;
  if (profile.age > 45) score += 15;
  return getRiskLevel(score);
};

export const generateHealthAnalysis = (profile: UserProfile): string => {
  const bmi = calculateBMI(profile.weight, profile.height);
  const cat = getBMICategory(bmi);
  const obesityRisk = calculateObesityRisk(profile);
  const cardioRisk = calculateCardioRisk(profile);
  const metaRisk = calculateMetabolicRisk(profile);

  let analysis = `Based on AI analysis of your health profile, your BMI of ${bmi} places you in the "${cat}" category. `;

  if (obesityRisk > 60) analysis += `Your obesity risk score of ${obesityRisk}% is critically elevated — immediate dietary intervention is recommended. `;
  else if (obesityRisk > 30) analysis += `Your obesity risk of ${obesityRisk}% indicates moderate concern. Proactive lifestyle adjustments are advised. `;
  else analysis += `Your obesity risk of ${obesityRisk}% is within safe parameters. `;

  if (cardioRisk > 50) analysis += `Cardiovascular risk at ${cardioRisk}% demands attention — consider consulting a cardiologist. `;
  else if (cardioRisk > 25) analysis += `Your cardiovascular risk of ${cardioRisk}% warrants monitoring with regular check-ups. `;

  if (profile.medicalCondition !== 'None') {
    analysis += `Given your ${profile.medicalCondition} condition, the AI has adjusted all recommendations to prioritize organ-supportive and anti-inflammatory nutrition. `;
  }

  analysis += `Metabolic risk level: ${metaRisk}. `;
  if (profile.activityLevel === 'Sedentary') analysis += `Increasing physical activity would significantly improve all risk metrics.`;

  return analysis;
};

export const calculateDailyCalories = (profile: UserProfile): number => {
  const bmi = calculateBMI(profile.weight, profile.height);
  // Mifflin-St Jeor
  let bmr: number;
  if (profile.gender === 'Male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  const activityMultipliers: Record<string, number> = {
    Sedentary: 1.2, Light: 1.375, Moderate: 1.55, 'Very Active': 1.725,
  };
  let calories = bmr * (activityMultipliers[profile.activityLevel] || 1.2);

  // Adjust for BMI
  if (bmi >= 30) calories *= 0.8;
  else if (bmi >= 25) calories *= 0.9;
  else if (bmi < 18.5) calories *= 1.15;

  // Adjust for conditions
  if (profile.medicalCondition === 'Diabetes') calories *= 0.92;
  if (profile.medicalCondition === 'Kidney Problem') calories *= 0.88;

  // Adjust for risk
  const obesityRisk = calculateObesityRisk(profile);
  if (obesityRisk > 60) calories *= 0.9;

  return Math.round(calories);
};

export const getMacroBreakdown = (profile: UserProfile): { protein: number; carbs: number; fat: number } => {
  if (profile.medicalCondition === 'Diabetes') return { protein: 30, carbs: 35, fat: 35 };
  if (profile.medicalCondition === 'Kidney Problem') return { protein: 15, carbs: 55, fat: 30 };
  if (profile.medicalCondition === 'Heart Disease') return { protein: 25, carbs: 45, fat: 30 };
  if (profile.medicalCondition === 'Obesity') return { protein: 35, carbs: 30, fat: 35 };
  return { protein: 25, carbs: 50, fat: 25 };
};

interface MealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
  totalCalories: number;
}

export const generateMealPlan = (profile: UserProfile): MealPlan => {
  const calories = calculateDailyCalories(profile);
  const isVeg = profile.mealPreference === 'Vegetarian';
  const isVegan = profile.mealPreference === 'Vegan';
  const cond = profile.medicalCondition;

  const base = {
    breakfast: [] as string[],
    lunch: [] as string[],
    dinner: [] as string[],
    snacks: [] as string[],
  };

  // Breakfast
  if (isVegan) {
    base.breakfast = ['Overnight oats with chia seeds & berries', 'Almond milk smoothie with spinach & banana', 'Whole grain toast with avocado'];
  } else if (isVeg) {
    base.breakfast = ['Greek yogurt with granola & honey', 'Vegetable upma with nuts', 'Whole wheat paratha with paneer'];
  } else {
    base.breakfast = ['Scrambled eggs with whole grain toast', 'Oatmeal with boiled eggs', 'Chicken sausage with avocado toast'];
  }

  // Lunch
  if (isVegan) {
    base.lunch = ['Quinoa salad with roasted vegetables', 'Lentil soup with brown rice', 'Chickpea curry with whole wheat roti'];
  } else if (isVeg) {
    base.lunch = ['Dal with brown rice & mixed vegetables', 'Paneer tikka with roti & salad', 'Vegetable biryani with raita'];
  } else {
    base.lunch = ['Grilled chicken breast with quinoa', 'Fish curry with brown rice', 'Turkey wrap with mixed greens'];
  }

  // Dinner
  if (isVegan) {
    base.dinner = ['Tofu stir-fry with brown rice', 'Mushroom soup with whole grain bread', 'Black bean tacos with salsa'];
  } else if (isVeg) {
    base.dinner = ['Palak paneer with multigrain roti', 'Mixed vegetable soup with bread', 'Chole with jeera rice'];
  } else {
    base.dinner = ['Baked salmon with steamed vegetables', 'Lean chicken curry with roti', 'Grilled fish with sweet potato'];
  }

  // Snacks
  base.snacks = ['Mixed nuts (almonds, walnuts)', 'Fresh seasonal fruits', 'Green tea with dark chocolate'];

  // Condition-specific additions
  if (cond === 'Diabetes') {
    base.snacks.push('Bitter gourd juice (blood sugar support)');
    base.breakfast.push('Fenugreek seed water (glycemic control)');
  }
  if (cond === 'Heart Disease') {
    base.snacks.push('Flaxseed smoothie (omega-3 boost)');
    base.lunch.push('Add garlic & turmeric for anti-inflammatory support');
  }
  if (cond === 'Hypertension') {
    base.snacks.push('Banana & beetroot juice (potassium-rich)');
  }
  if (cond === 'Kidney Problem') {
    base.snacks.push('Apple slices (kidney-friendly low-potassium)');
  }
  if (cond === 'Thyroid') {
    base.snacks.push('Brazil nuts (selenium for thyroid support)');
  }

  return { ...base, totalCalories: calories };
};

export interface SymptomResult {
  deficiency: string;
  foods: string[];
  severity: 'Low' | 'Moderate' | 'Severe';
  message: string;
}

export const analyzeSymptoms = (symptoms: string[]): SymptomResult[] => {
  const results: SymptomResult[] = [];
  const map: Record<string, { deficiency: string; foods: string[] }> = {
    'Fatigue': { deficiency: 'Iron / Vitamin B12', foods: ['Spinach', 'Lentils', 'Red meat', 'Fortified cereals'] },
    'Hair Fall': { deficiency: 'Biotin / Zinc / Iron', foods: ['Eggs', 'Nuts', 'Sweet potatoes', 'Oysters'] },
    'Weakness': { deficiency: 'Vitamin D / Calcium', foods: ['Milk', 'Sunlight exposure', 'Salmon', 'Fortified foods'] },
    'Pale Skin': { deficiency: 'Iron / Folate', foods: ['Beetroot', 'Pomegranate', 'Dark leafy greens', 'Liver'] },
    'Bone Pain': { deficiency: 'Vitamin D / Calcium', foods: ['Dairy products', 'Sardines', 'Broccoli', 'Fortified orange juice'] },
    'Muscle Cramps': { deficiency: 'Magnesium / Potassium', foods: ['Bananas', 'Avocados', 'Dark chocolate', 'Pumpkin seeds'] },
  };

  symptoms.forEach(s => {
    if (map[s]) {
      results.push({ ...map[s], severity: 'Moderate', message: `AI Analysis: ${s} may indicate ${map[s].deficiency} deficiency. Dietary correction recommended.` });
    }
  });

  if (symptoms.length >= 4) {
    results.push({
      deficiency: 'Multiple Nutrient Deficiency',
      foods: ['Multivitamin supplementation recommended', 'Consult a clinical nutritionist'],
      severity: 'Severe',
      message: '⚠️ AI WARNING: Multiple symptoms detected indicate possible systemic nutrient deficiency. Immediate professional consultation is strongly recommended.',
    });
  }

  return results;
};

export interface GroceryItem {
  name: string;
  category: string;
  priority: 'Essential' | 'Recommended' | 'Optional';
  budgetAlt?: string;
}

export const generateGroceryList = (profile: UserProfile): GroceryItem[] => {
  const items: GroceryItem[] = [
    { name: 'Brown Rice', category: 'Grains', priority: 'Essential', budgetAlt: 'Regular rice' },
    { name: 'Oats', category: 'Grains', priority: 'Essential' },
    { name: 'Whole Wheat Bread', category: 'Grains', priority: 'Essential' },
    { name: 'Spinach', category: 'Vegetables', priority: 'Essential' },
    { name: 'Broccoli', category: 'Vegetables', priority: 'Recommended', budgetAlt: 'Cabbage' },
    { name: 'Sweet Potatoes', category: 'Vegetables', priority: 'Recommended' },
    { name: 'Tomatoes', category: 'Vegetables', priority: 'Essential' },
    { name: 'Bananas', category: 'Fruits', priority: 'Essential' },
    { name: 'Berries', category: 'Fruits', priority: 'Recommended', budgetAlt: 'Seasonal fruits' },
    { name: 'Apples', category: 'Fruits', priority: 'Essential' },
    { name: 'Almonds', category: 'Nuts & Seeds', priority: 'Recommended', budgetAlt: 'Peanuts' },
    { name: 'Flaxseeds', category: 'Nuts & Seeds', priority: 'Recommended' },
    { name: 'Lentils / Dal', category: 'Protein', priority: 'Essential' },
    { name: 'Chickpeas', category: 'Protein', priority: 'Essential' },
    { name: 'Greek Yogurt', category: 'Dairy', priority: 'Recommended', budgetAlt: 'Regular curd' },
    { name: 'Olive Oil', category: 'Oils', priority: 'Recommended', budgetAlt: 'Mustard oil' },
    { name: 'Turmeric', category: 'Spices', priority: 'Essential' },
    { name: 'Green Tea', category: 'Beverages', priority: 'Recommended' },
  ];

  if (profile.mealPreference === 'Non-Vegetarian') {
    items.push(
      { name: 'Chicken Breast', category: 'Protein', priority: 'Essential' },
      { name: 'Salmon / Fish', category: 'Protein', priority: 'Recommended', budgetAlt: 'Sardines' },
      { name: 'Eggs', category: 'Protein', priority: 'Essential' },
    );
  }

  if (profile.medicalCondition === 'Diabetes') {
    items.push({ name: 'Bitter Gourd', category: 'Vegetables', priority: 'Essential' });
    items.push({ name: 'Fenugreek Seeds', category: 'Spices', priority: 'Essential' });
  }
  if (profile.medicalCondition === 'Heart Disease') {
    items.push({ name: 'Garlic', category: 'Spices', priority: 'Essential' });
    items.push({ name: 'Walnuts', category: 'Nuts & Seeds', priority: 'Essential' });
  }

  return items;
};
