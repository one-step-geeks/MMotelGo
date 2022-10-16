import { Result, Button } from 'antd';
import { useHistory } from 'umi';

export default () => {
  const history = useHistory();

  return (
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
          返回登录
        </Button>
      }
    ></Result>
  );
};
