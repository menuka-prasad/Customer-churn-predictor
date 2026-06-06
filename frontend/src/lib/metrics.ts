import { PredictionRecord } from '../context/PredictionStore';

export function computeMetrics(records: PredictionRecord[]) {
  const total = records.length;
  const reviewed = records.filter((r) => r.actual);
  let tp = 0, fp = 0, fn = 0, tn = 0;
  
  reviewed.forEach((r) => {
    const predictedChurn = r.result.probability > 50;
    const actualChurn = r.actual === 'CHURNED';
    if (predictedChurn && actualChurn) tp++;
    else if (predictedChurn && !actualChurn) fp++;
    else if (!predictedChurn && actualChurn) fn++;
    else tn++;
  });
  
  const acc = reviewed.length ? Math.round(((tp + tn) / reviewed.length) * 100) : 0;
  const prec = (tp + fp) ? Math.round((tp / (tp + fp)) * 100) : 0;
  const rec = (tp + fn) ? Math.round((tp / (tp + fn)) * 100) : 0;

  const riskDist = [
    { name: 'High', value: records.filter(r => r.result.riskLevel === 'HIGH').length, color: '#fb7185' },
    { name: 'Medium', value: records.filter(r => r.result.riskLevel === 'MEDIUM').length, color: '#fbbf24' },
    { name: 'Low', value: records.filter(r => r.result.riskLevel === 'LOW').length, color: '#34d399' },
  ];

  // Timeline by day (last 14 days)
  const dayMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    dayMap.set(key, 0);
  }
  
  records.forEach((r) => {
    const key = new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) || 0) + 1);
  });
  
  const timeline = Array.from(dayMap, ([day, count]) => ({ day, count }));

  // Histogram
  const buckets = ['0-20', '20-40', '40-60', '60-80', '80-100'];
  const histogram = buckets.map((b) => ({ bucket: b, count: 0 }));
  
  records.forEach((r) => {
    const idx = Math.min(4, Math.floor(r.result.probability / 20));
    histogram[idx].count++;
  });

  return {
    total, reviewed: reviewed.length,
    accuracy: acc, precision: prec, recall: rec,
    riskDist, timeline, histogram,
    confusion: { tp, fp, fn, tn },
  };
}
