export type LessonStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type Lesson = {
  id: number;
  studentName: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: LessonStatus;
  statusForStudent: LessonStatus;
  statusForTeacher: LessonStatus;
  studentAvatar?: string;
};

export type Review = {
  id: number;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  comment: string;
  date: string;
};

export type Message = {
  id: number;
  studentName: string;
  studentAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isPending: boolean;
};

export type Availability = {
  day: string;
  slots: { start: string; end: string }[];
};

export type TeacherStats = {
  upcomingLessonsThisWeek: number;
  lessonsThisMonth: number;
  hoursThisMonth: number;
  averageRating: number;
  totalReviews: number;
};

export type TeacherDashboard = {
  stats: TeacherStats;
  lessons: Lesson[];
  availability: Availability[];
  reviews: Review[];
  messages: Message[];
  profile: {
    name: string;
    avatar?: string;
    bio: string;
    subjects: string[];
    city: string;
    hourlyRate: number;
  };
};
