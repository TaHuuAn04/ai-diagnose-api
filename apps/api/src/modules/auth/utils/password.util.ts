import { compare, genSalt, hash } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  const result = await hash(password, salt);
  return result;
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await compare(password, hash);
};
