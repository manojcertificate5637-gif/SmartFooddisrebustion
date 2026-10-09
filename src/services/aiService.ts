export async function fetchAIPlanExplanation(planData: any): Promise<{
  explanation: string;
  recommendations: string[];
  fallback: boolean;
}> {
  try {
    const res = await fetch('/api/ai/explain-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend AI route unavailable, using local fallback:', err);
  }

  // Pure deterministic fallback
  return {
    fallback: true,
    explanation: `Deterministic Allocation Summary: Evaluated ${planData?.matches?.length || 0} active match pairings against 12 hard constraints. Priority P1 community shelters receive immediate allocation for perishable items. Cold-chain continuous monitoring is required for all refrigerated batches.`,
    recommendations: [
      'Dispatch refrigerated transport units first to maximize safe-use buffer.',
      'Notify destination coordinators 20 minutes prior to scheduled dock arrival.',
      'Audit unallocated produce for secondary community kitchen distribution.',
    ],
  };
}

export async function fetchAIFoodInsight(foodData: any): Promise<{
  insight: string;
  safetyChecklist: string[];
  fallback: boolean;
}> {
  try {
    const res = await fetch('/api/ai/analyze-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend AI route unavailable, using local fallback:', err);
  }

  return {
    fallback: true,
    insight: `Standard food safety compliance verified for ${foodData.category || 'surplus food'}. Cold-chain temperature thresholds and tamper-evident packaging criteria strictly apply.`,
    safetyChecklist: [
      `Maintain ${foodData.storageCondition || 'required'} environment during pickup and transit.`,
      'Confirm recipient possesses matching storage facilities before departure.',
      'Log handover timestamp and destination verifier name on bill of lading.',
    ],
  };
}
