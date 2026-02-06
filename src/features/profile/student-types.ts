export type StudentProfile = {
  id: number;
  userId: number;
  city?: string;
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
};

export type UpdateStudentProfilePayload = {
  city?: string;
};

export type StudentProfileResponse = {
  profile: StudentProfile;
};
