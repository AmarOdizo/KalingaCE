// Calculate Percentage
export const calculatePercentage = (gainMark, totalMark) => {
  if (!gainMark || !totalMark) return 0;

  return ((gainMark / totalMark) * 100).toFixed(2);
};

// Calculate Grade
export const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  return "Fail";
};

// Preview Image
export const getImagePreview = (file) => {
  if (!file) return "";

  return URL.createObjectURL(file);
};

// Format Marks
export const formatMarks = (gainMark, totalMark) => {
  return `${gainMark}/${totalMark}`;
};

// Search Student
export const searchStudents = (students, search) => {
  if (!search) return students;

  return students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.subject.toLowerCase().includes(search.toLowerCase()) ||
      student.batch.toLowerCase().includes(search.toLowerCase()),
  );
};

// Sort by Percentage
export const sortTopper = (students) => {
  return [...students].sort((a, b) => {
    const p1 = (a.gainMark / a.totalMark) * 100;
    const p2 = (b.gainMark / b.totalMark) * 100;

    return p2 - p1;
  });
};
