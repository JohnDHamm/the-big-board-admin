import React from 'react';
import { Content, ContentItem, PageLayout } from '../../layout';
import { Logo } from '../../components';
import { Button, TextField } from '@material-ui/core';
import { adminLogin } from '../../api';
import { UserContext } from '../../contexts/UserContext';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { LOCAL_STORAGE } from '../../constants';

const HomePage: React.FC = () => {
  const history = useHistory();
  const { setCurrentUser } = React.useContext(UserContext);

  const [name, setName] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errMsg, setErrMsg] = React.useState<string>();

  const submit = () => {
    if (name.length > 0 && password.length > 0) {
      adminLogin({ name, password })
        .then((res) => {
          if (res) {
            setCurrentUser(res);
            localStorage.setItem(LOCAL_STORAGE.JWT_TOKEN, res.accessToken);
            history.push(ROUTES.LEAGUES);
          }
        })
        .catch((err) => setErrMsg(err.message));
    }
  };

  return (
    <PageLayout>
      <Content>
        <ContentItem>
          <div style={{ width: '600px' }}>
            <Logo />
          </div>
        </ContentItem>
        <ContentItem>
          <TextField
            label="USERNAME"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: 400 }}
          />
        </ContentItem>
        <ContentItem>
          <TextField
            label="PASSWORD"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: 400 }}
          />
        </ContentItem>
        <ContentItem>
          <Button onClick={submit} variant="contained" color="primary">
            login
          </Button>
        </ContentItem>
        {errMsg && (
          <ContentItem>
            <p style={{ color: 'red' }}>{errMsg}</p>
          </ContentItem>
        )}
      </Content>
    </PageLayout>
  );
};

export default HomePage;
