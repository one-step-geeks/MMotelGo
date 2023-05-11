interface EnvConfig {
  ENV?: 'prod' | 'test' | 'uat';
  APP_BASE_URL?: string;
}

const host = window.location.host;

const envList = [
  { origin: /^dev\.lamshan\.com/, env: 'dev' },
  { origin: /^uat\.pietable\.com/, env: 'uat' },
  { origin: /^www\.pietable\.com/, env: 'production' },
];

function getConfigByEnv(): EnvConfig {
  const finded = envList.find((item) => item.origin.test(host));
  switch (finded?.env) {
    case 'production':
      return {
        ENV: 'prod',
        APP_BASE_URL: window.location.origin,
      };
    case 'uat':
      return {
        ENV: 'uat',
        APP_BASE_URL: window.location.origin,
      };
    default:
      return {
        ENV: 'test',
        APP_BASE_URL: window.location.origin,
      };
  }
}

export default getConfigByEnv();
