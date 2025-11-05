export default function getAge(bornDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - bornDate.getFullYear();
  const month = now.getMonth() - bornDate.getMonth();
  if (month < 0 || (month === 0 && now.getDate() < bornDate.getDate())) {
    age--;
  }
  return age;
}
