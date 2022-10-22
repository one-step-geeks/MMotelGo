import { Result, Button } from 'antd';
import { useHistory, useLocation } from 'umi';

export default () => {
  const history = useHistory();
  const { query } = useLocation();

  return query?.type === 'email' ? (
    <Result
      status={'success'}
      title="注册成功"
      subTitle="恭喜你注册成功，快去邮箱验证吧！"
      extra={
        <Button
          type="primary"
          onClick={() => {
            history.push('/user/login');
          }}
        >
          返回登录
        </Button>
      }
    ></Result>
  ) : (
    <Result
      status={'success'}
      title="注册成功"
      subTitle="恭喜你注册成功，点击下方按钮去登录吧！"
      extra={
        <Button
          type="primary"
          onClick={() => {
            history.push('/user/login');
          }}
        >
          去登录
        </Button>
      }
    ></Result>
  );
};
