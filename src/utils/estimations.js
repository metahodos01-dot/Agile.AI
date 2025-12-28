export const calculateTotalHours = (estimates) => {
    if (!estimates) return 0;
    return Object.values(estimates).reduce((total, current) => total + (current || 0), 0);
};

export const calculateSprintsNeeded = (totalHours, teamSize, dailyHours = 6, sprintDays = 10) => {
    if (!totalHours || !teamSize) return 0;
    const teamVelocityPerHour = teamSize * dailyHours * sprintDays;
    return Math.ceil(totalHours / teamVelocityPerHour);
};
