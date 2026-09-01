export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createClient = () => {
  return {
    get: async <T>(data: T) => {
      await delay(300);
      return data;
    }
  };
};

export const client = createClient();
