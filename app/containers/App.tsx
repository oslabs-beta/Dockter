import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const App = (props: Props) => {
  const { children } = props;
  return <>{children}</>;
};

export default App;
