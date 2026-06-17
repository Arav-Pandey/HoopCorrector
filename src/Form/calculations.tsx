import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export interface TopFrame {
  wristY: number;
  elbowAngle: number;
  flare: number;
}

interface KeypointVisibilityProps {
  rightShoulder: NormalizedLandmark;
  leftShoulder: NormalizedLandmark;
  elbow: NormalizedLandmark;
  wrist: NormalizedLandmark;
  rightAnkle: NormalizedLandmark;
  leftAnkle: NormalizedLandmark;
  rightKnee: NormalizedLandmark;
  leftKnee: NormalizedLandmark;
}

type user = {
  wristY: number;
  elbowAngle: number;
  flare: number;
  kneeAngle: number;
};
type curry = {
  flare: number;
  elbowAngle: number;
};

export interface Measurements {
  ankleDistance: number | null;
  kneeDistance: number | null;
  shoulderDistance: number | null;
  elbowAngle: number | null;
  flareDistance: number | null;
}

export function getSimilarity(user: user, curry: curry) {
  function normalize(diff: number, tolerance: number) {
    return Math.max(0, 1 - diff / tolerance);
  }

  const flareScore = normalize(Math.abs(user.flare - curry.flare), 0.1);
  const angleScore = normalize(
    Math.abs(user.elbowAngle - curry.elbowAngle),
    30,
  );

  const total = flareScore * 0.5 + angleScore * 0.5;

  return Math.round(total * 100);
}

export function calculateDistance(a: any, b: any) {
  const dist = Math.abs(a.x - b.x);
  return dist;
}

export function scoreElbowFlare(flare: number): number {
  if (flare < 0.03) return 100;
  if (flare < 0.07) return 85;
  if (flare < 0.12) return 65;
  if (flare < 0.18) return 40;
  return 20;
}

export function scoreElbowAngle(angle: number): number {
  if (angle >= 55 && angle <= 75) return 100;
  if (angle >= 45 && angle < 55) return 85;
  if (angle > 75 && angle <= 90) return 80;
  if (angle >= 35 && angle < 45) return 60;
  return 40;
}

export function scoreBendAngle(angle: number): number {
  if (angle >= 110 && angle <= 140) return 100; // ideal bend
  if (angle >= 100 && angle < 110) return 85; // slightly too much bend
  if (angle > 140 && angle <= 155) return 85; // slightly too little bend
  if (angle >= 90 && angle < 100) return 65; // too deep
  if (angle > 155 && angle <= 170) return 65; // too straight
  return 40; // extreme cases
}

export function calculateAngle(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark,
) {
  const ba = {
    x: a.x - b.x,
    y: a.y - b.y,
  };

  const bc = {
    x: c.x - b.x,
    y: c.y - b.y,
  };

  const dot = ba.x * bc.x + ba.y * bc.y;

  const magBA = Math.hypot(ba.x, ba.y);
  const magBC = Math.hypot(bc.x, bc.y);

  if (magBA === 0 || magBC === 0) {
    return 0;
  }

  const cosine = Math.max(-1, Math.min(1, dot / (magBA * magBC)));

  return Math.acos(cosine) * (180 / Math.PI);
}

export function getBendFeedback(angle: number) {
  if (angle > 145) return "Bend more";
  if (angle < 80) return "Too much bend";
  return "Good bend";
}

export function getFlareFeedback(
  flareDistance: number,
  elbowAngleRef: React.RefObject<number | null>,
) {
  if (!elbowAngleRef.current || elbowAngleRef.current === null) {
    return "Unable to calculate elbow angle";
  }

  if (flareDistance > 0.15) {
    return "⚠️ Elbow is flaring too wide";
  } else if (elbowAngleRef.current < 40) {
    return "⚠️ Arm angle too tight";
  } else {
    return "✅ Good elbow alignment";
  }
}

export function getAnkleFeedback(
  ankleDistance: number | null,
  shoulderDistance: number | null,
) {
  if (ankleDistance === null || shoulderDistance === null) {
    return "⚠️ Unable to detect ankle placement.";
  }
  if (ankleDistance < shoulderDistance - 0.05) {
    return "⚠️ Feet are too close together";
  } else if (ankleDistance > shoulderDistance + 0.05) {
    return "⚠️ Feet are too far apart";
  }
  return "✅ Good feet placement";
}

export function getKneeDistanceFeedback(
  kneeDistance: number | null,
  shoulderDistance: number | null,
) {
  if (kneeDistance === null || shoulderDistance === null) {
    return "⚠️ Unable to detect knee placement.";
  }
  if (kneeDistance < shoulderDistance - 0.08) {
    return "⚠️ Knees are too close together";
  } else if (kneeDistance > shoulderDistance + 0.08) {
    return "⚠️ Knees are too far apart";
  }
  return "✅ Good knee placement";
}

export function checkKeypointVisibility(
  {
    rightShoulder,
    leftShoulder,
    elbow,
    wrist,
    rightAnkle,
    leftAnkle,
    rightKnee,
    leftKnee,
  }: KeypointVisibilityProps,
  threshold: number,
) {
  if (
    rightShoulder.visibility < threshold ||
    leftShoulder.visibility < threshold ||
    elbow.visibility < threshold ||
    wrist.visibility < threshold ||
    rightAnkle.visibility < threshold ||
    leftAnkle.visibility < threshold ||
    rightKnee.visibility < threshold ||
    leftKnee.visibility < threshold
  ) {
    return false;
  }
  return true;
}

export function emptyMeasurements(): Measurements {
  return {
    ankleDistance: null,
    kneeDistance: null,
    shoulderDistance: null,
    elbowAngle: null,
    flareDistance: null,
  };
}

export function averageTopFrames(
  frames: TopFrame[],
  kneeAngle: number,
  topFrameCount: number,
) {
  const topFrames = [...frames]
    .sort((a, b) => a.wristY - b.wristY)
    .slice(0, topFrameCount);

  if (topFrames.length === 0) return null;

  const total = topFrames.reduce(
    (acc, frame) => ({
      wristY: acc.wristY + frame.wristY,
      elbowAngle: acc.elbowAngle + frame.elbowAngle,
      flare: acc.flare + frame.flare,
    }),
    { wristY: 0, elbowAngle: 0, flare: 0 },
  );

  return {
    wristY: total.wristY / topFrames.length,
    elbowAngle: total.elbowAngle / topFrames.length,
    flare: total.flare / topFrames.length,
    kneeAngle,
  };
}

export function getFlareFeedbackFromValues(
  flareDistance: number | null,
  elbowAngle: number | null,
) {
  if (flareDistance === null || elbowAngle === null) {
    return "⚠️ Arms not fully visible. Unable to calculate elbow feedback.";
  }
  if (flareDistance > 0.15) return "⚠️ Elbow is flaring too wide";
  if (elbowAngle < 40) return "⚠️ Arm angle too tight";
  return "✅ Good elbow alignment";
}

export function formatMeasurement(value: number | null) {
  return value === null ? "N/A" : value.toFixed(3);
}

export function averageLowestKneeAngles(angles: number[], count: number) {
  if (angles.length === 0) return Infinity;
  const sorted = [...angles].sort((a, b) => a - b);
  const lowest = sorted.slice(0, count);
  return lowest.reduce((sum, a) => sum + a, 0) / lowest.length;
}
