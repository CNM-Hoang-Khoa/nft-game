import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { connect } from './redux/blockchain/blockchainActions';
import { fetchData } from './redux/data/dataActions';
import * as s from './styles/globalStyles';
import LipRenderer from './components/lipRenderer';

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);

  console.table(data);

  useEffect(() => {
    if (blockchain.account !== '' && blockchain.lipToken !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.account, blockchain.lipToken, dispatch]);

  const mintNFT = (_account, _name) => {
    setLoading(true);
    blockchain.lipToken.methods
      .createRandomLip(_name)
      .send({
        from: _account,
        value: blockchain.web3.utils.toWei('0.01', 'ether'),
      })
      .once('error', (err) => {
        setLoading(false);
        console.log('mint nft error: ', err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log('mint nft receipt: ', receipt);
        dispatch(fetchData(blockchain.account));
      });
  };

  return (
    <s.Screen>
      {blockchain.account === '' || blockchain.lipToken === null ? (
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
      ) : (
        <s.Container ai={'center'} style={{ padding: '24px' }}>
          <s.TextTitle>Welcome to the game</s.TextTitle>
          <button
            disabled={loading ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFT(blockchain.account, 'Unknown');
            }}
          >
            CREATE NFT LIP
          </button>
          <s.SpacerMedium />
          <s.Container jc={'center'} fd={'row'} style={{ flexWrap: 'wrap' }}>
            {data.allLips.map((item, index) => {
              return (
                <s.Container key={index} style={{ padding: '15px' }}>
                  <LipRenderer lip={item} />
                  <s.SpacerXSmall />
                  <s.Container>
                    <s.TextDescription>ID: {item.id}</s.TextDescription>
                    <s.TextDescription>DNA: {item.dna}</s.TextDescription>
                    <s.TextDescription>LEVEL: {item.level}</s.TextDescription>
                    <s.TextDescription>NAME: {item.name}</s.TextDescription>
                    <s.TextDescription>RARITY: {item.rarity}</s.TextDescription>
                    <s.SpacerXSmall />
                  </s.Container>
                </s.Container>
              );
            })}
          </s.Container>
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
