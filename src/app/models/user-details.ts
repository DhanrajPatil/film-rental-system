export interface UserDetails {
  id?: string;
  email?: string;
  mobileNumber?: string;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string[];
  photoUrl? : string;
  token?: string;
}
