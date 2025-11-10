export const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
  return true;
};

export const mergeTwoStringObject = (str1: string, str2: string): string => {
  if (isJsonString(str1) && isJsonString(str2)) {
    return JSON.stringify({ ...JSON.parse(str1), ...JSON.parse(str2) });
  }
  throw new Error('Invalid JSON string');
};
