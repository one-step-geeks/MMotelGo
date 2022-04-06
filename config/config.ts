import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  // plugins: [require('./motelPlugin')],
  dynamicImport: {
    loading: '@/components/Loading',
  },
  dva: false,
  // 最佳实践中内置了 Layout，你也可以配置为 false 关闭它
  layout: {
    name: 'MotelGo 管理后台',
    // logo: 'https://img.alicdn.com/imgextra/i3/O1CN01u0CsC61b0A6wBavkQ_!!6000000003402-2-tps-360-362.png',
    navTheme: 'light',
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,
    breadcrumbRender: false,
    title: 'MotelGo 管理后台',
    pwa: false,
  },
  title: 'MotelGo 管理后台',
  // favicon:
  //   'https://img.alicdn.com/imgextra/i2/O1CN01i1hPpT1aLrG439inm_!!6000000003314-2-tps-36-36.png',
  // 路由配置
  routes,
  locale: {},
  // 研发小蜜
  // linkS: {appId: '5c6feaf3fbdf01f7a4d35cf1' },
  nodeModulesTransform: { type: 'none' },
  history: { type: 'hash' },
  // 提速方案配置
  mfsu: {},
  fastRefresh: {},
  // 优化 moment 包大小
  ignoreMomentLocale: true,
  // 将 src/assets/template 文件夹下面的模板文件，拷贝到打包之后的 dist/template 目录下，提供前端下载功能
  // copy: [
  //   {
  //     from: 'src/assets/template',
  //     to: 'template',
  //   },
  // ],
});