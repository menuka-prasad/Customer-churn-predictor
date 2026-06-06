import { CustomerData, PredictionResult } from '../types/churn';

export function calculateChurnProbability(data: CustomerData): number {
  let probability = 50;

  // Contract type impact
  if (data.contract === 'Month-to-month') probability += 20;
  else if (data.contract === 'One year') probability -= 10;
  else if (data.contract === 'Two year') probability -= 20;

  // Tenure impact
  if (data.tenure < 12) probability += 15;
  else if (data.tenure > 48) probability -= 20;

  // Service subscriptions
  const hasServices = [
    data.onlineSecurity,
    data.onlineBackup,
    data.deviceProtection,
    data.techSupport,
    data.streamingTV,
    data.streamingMovies
  ].filter(s => s === 'Yes').length;

  probability -= hasServices * 5;

  // Payment method
  if (data.paymentMethod === 'Electronic check') probability += 10;

  // Monthly charges
  if (data.monthlyCharges > 80) probability += 10;

  // Clamp between 5 and 95
  probability = Math.max(5, Math.min(95, probability + Math.random() * 10 - 5));

  return probability;
}

export function generateAssessment(data: CustomerData, riskLevel: string): string {
  const factors = [];

  if (data.tenure < 12) factors.push('short tenure');
  if (data.contract === 'Month-to-month') factors.push('month-to-month contract');

  const services = [
    data.onlineSecurity,
    data.onlineBackup,
    data.deviceProtection,
    data.techSupport,
    data.streamingTV,
    data.streamingMovies
  ].filter(s => s === 'Yes').length;

  if (services < 2) factors.push('lack of additional service subscriptions');
  if (data.paymentMethod === 'Electronic check') factors.push('electronic check payment method');
  if (data.monthlyCharges > 80) factors.push('high monthly charges');

  if (riskLevel === 'HIGH') {
    return `Customer demonstrates elevated churn risk due to ${factors.slice(0, 3).join(', ')}. Immediate retention initiatives recommended to prevent customer loss.`;
  } else if (riskLevel === 'MEDIUM') {
    return `Customer shows moderate churn risk. Consider proactive engagement strategies and service enhancements to strengthen retention.`;
  } else {
    return `Customer exhibits strong retention indicators with stable usage patterns and long-term commitment. Continue maintaining service quality and engagement.`;
  }
}

export async function simulateChurnPrediction(data: CustomerData): Promise<PredictionResult> {
  // Simulate AI prediction with realistic logic
  await new Promise(resolve => setTimeout(resolve, 2500));

  const probability = calculateChurnProbability(data);
  const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
    probability < 30 ? 'LOW' : probability < 70 ? 'MEDIUM' : 'HIGH';

  const predictionText = probability > 50 ? 'Likely To Churn' : 'Likely To Stay';

  const assessment = generateAssessment(data, riskLevel);

  return {
    probability: Math.round(probability),
    riskLevel,
    prediction: predictionText,
    assessment
  };
}

export function buildRecommendations(customerData: CustomerData) {
  const recs: { title: string; desc: string }[] = [];
  const d = customerData;
  if (d.contract === 'Month-to-month') {
    recs.push({ title: 'Offer annual contract upgrade', desc: 'Bundle a 15% discount with a one-year commitment to reduce flight risk.' });
  }
  if (d.tenure < 12) {
    recs.push({ title: 'Trigger 90-day onboarding outreach', desc: 'Schedule a CSM check-in and personalized success plan within the next two weeks.' });
  }
  if (d.onlineSecurity === 'No' || d.techSupport === 'No') {
    recs.push({ title: 'Trial bundled add-on services', desc: 'Offer 60-day free trial of Online Security and Tech Support — both strongly reduce churn.' });
  }
  if (d.paymentMethod === 'Electronic check') {
    recs.push({ title: 'Migrate to auto-pay', desc: 'Promote auto-pay with a small one-time credit — payment friction drives passive churn.' });
  }
  if (d.monthlyCharges > 80) {
    recs.push({ title: 'Price sensitivity review', desc: 'Run a billing review and propose a tier downgrade or loyalty discount before competitor outreach.' });
  }
  if (recs.length < 3) {
    recs.push({ title: 'Maintain quarterly business review', desc: 'Continue scheduled QBRs to reinforce value and surface expansion opportunities.' });
  }
  return recs.slice(0, 5);
}
