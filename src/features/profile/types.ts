export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
};
