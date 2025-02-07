export interface UserDetails {
  id?: string;
  email: string;
  mobileNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string[];
  token?: string;
}
