export const calculateSalaryPercentage = (
    salary: number,
    maxSalary?: number
) => {
    return Math.min(100, (salary / (maxSalary || 0.01)) * 100);
}