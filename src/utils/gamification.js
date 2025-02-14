
export const calculateReadingLevel = (totalMinutes) => {
  const levels = [
    { name: "Novice Reader", min: 0, max: 60 },
    { name: "Book Explorer", min: 61, max: 180 },
    { name: "Reading Enthusiast", min: 181, max: 360 },
    { name: "Bookworm", min: 361, max: 720 },
    { name: "Literary Master", min: 721, max: Infinity }
  ];

  return levels.find(level => totalMinutes >= level.min && totalMinutes <= level.max);
};

export const calculateMilestone = (minutes) => {
  const milestones = [30, 60, 120, 240, 480];
  return milestones.find(m => minutes <= m);
};
