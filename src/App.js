import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { connect } from './redux/blockchain/blockchainActions';
import * as s from './styles/globalStyles';

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);

  console.table(blockchain);

  return (
    <s.Screen>
      <s.Container flex={1} ai={'center'} jc={'center'}>
        <s.TextTitle>Connect to the game</s.TextTitle>
        <s.SpacerSmall />
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(connect());
          }}
        >
          CONNECT
        </button>
        <s.SpacerXSmall />
        {blockchain.errorMsg !== '' ? (
          <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
        ) : null}
      </s.Container>
    </s.Screen>
  );
}

export default App;
