export interface Employee {
    employeeId: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    hireDate: string;
    departmentId: number;
    departmentName: string;
    position: string;
    city: string;
    jobTitle: string;
    profileImagePath: string | null;
    employmentType?: string; // employmentType qo‘shildi
    role: string;
  }

