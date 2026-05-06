import { hash, verify } from '@node-rs/bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashed: string,
): Promise<boolean> => {
  return verify(password, hashed);
};
