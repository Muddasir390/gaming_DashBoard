type configType = {
    BASE_URL: string | undefined;
    LOGIN_BASE_URL: string | undefined
  };
  
  const config: configType = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    LOGIN_BASE_URL : process.env.NEXT_PUBLIC_BASE_URL_LOG_IN
  };
  
  export default config;