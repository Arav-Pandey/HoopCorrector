import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

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

export function calculateAngle(a: any, b: any, c: any) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };

  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);

  let cosine = dot / (magAB * magCB);

  // clamp to valid range
  cosine = Math.max(-1, Math.min(1, cosine));

  const angle = Math.acos(cosine);
  return (angle * 180) / Math.PI;
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

export function calculateKneeAngle(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
) {
  const ab = {
    x: a.x - b.x,
    y: a.y - b.y,
  };

  const cb = {
    x: c.x - b.x,
    y: c.y - b.y,
  };

  const dot = ab.x * cb.x + ab.y * cb.y;

  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);

  const cosine = dot / (magAB * magCB);

  const angleRad = Math.acos(Math.max(-1, Math.min(1, cosine)));

  return (angleRad * 180) / Math.PI;
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
  if (flareDistance > 0.15) {
    return "⚠️ Elbow is flaring too wide";
  } else if (elbowAngleRef.current && elbowAngleRef.current < 40) {
    return "⚠️ Arm angle too tight";
  } else {
    return "✅ Good elbow alignment";
  }
}

export function getAnkleFeedback(
  ankleDistance: React.RefObject<number | null>,
  shoulderDistance: React.RefObject<number | null>,
) {
  if (
    ankleDistance.current !== null &&
    shoulderDistance.current !== null &&
    ankleDistance.current < shoulderDistance.current - 1
  ) {
    return "⚠️ Feet are too close together";
  } else if (
    ankleDistance.current !== null &&
    shoulderDistance.current !== null &&
    ankleDistance.current > shoulderDistance.current + 1
  ) {
    return "⚠️ Feet are too far apart";
  }
  return "✅ Good feet placement";
}

export function getKneeDistanceFeedback(
  kneeDistanceRef: React.RefObject<number | null>,
  shoulderDistanceRef: React.RefObject<number | null>,
) {
  if (
    kneeDistanceRef.current === null ||
    shoulderDistanceRef.current === null
  ) {
    return "⚠️ Unable to detect knee placement.";
  }
  if (
    kneeDistanceRef.current !== null &&
    shoulderDistanceRef.current !== null &&
    kneeDistanceRef.current < shoulderDistanceRef.current - 6
  ) {
    return "⚠️ Knees are too close together";
  } else if (
    kneeDistanceRef.current !== null &&
    shoulderDistanceRef.current !== null &&
    kneeDistanceRef.current > shoulderDistanceRef.current + 6
  ) {
    return "⚠️ Knees are too far apart";
  }
  return "✅ Good knee placement";
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
    return "⚠️ Keypoints not visible enough.";
  }
  return null;
}
