import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { connect } from './redux/blockchain/blockchainActions';
import { fetchData } from './redux/data/dataActions';
import * as s from './styles/globalStyles';
import LipRenderer from './components/lipRenderer';
import _color from './assets/images/bg/_color.png';
import TransferModal from './components/TransferModal';
import TransferButton from './components/TransferButton';
import KissCard from './components/KissCard';
import TopOffCanvas from './components/TopOffCanvas';

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [kissLips, setKissLips] = useState([null, null]);
  const [transferingLip, setTransferingLip] = useState();

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

  const levelUpLip = (_account, _id) => {
    setLoading(true);
    blockchain.lipToken.methods
      .levelUp(_id)
      .send({
        from: _account,
      })
      .once('error', (err) => {
        setLoading(false);
        console.log('error while leveling up lip: ', err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log('receipt of leveling up lip: ', receipt);
        dispatch(fetchData(blockchain.account));
      });
  };

  const handleKissLipIdAdd = (_lipId) => {
    const firstLipId = kissLips[1];
    const secondLipId = data.allLips[_lipId];
    setKissLips([firstLipId, secondLipId]);
  };

  const kissTwoLips = (_account) => {
    setLoading(true);
    const firstLipId = parseInt(kissLips[0]?.id);
    const secondLipId = parseInt(kissLips[1]?.id);
    if (!isNaN(firstLipId) && !isNaN(secondLipId)) {
      blockchain.lipToken.methods
        .kissTwoLips(
          parseInt(kissLips[0]?.id),
          parseInt(kissLips[1]?.id),
          'Unknown'
        )
        .send({
          from: _account,
        })
        .once('error', (err) => {
          setLoading(false);
          console.log('error while kissing: ', err);
        })
        .then((receipt) => {
          setLoading(false);
          console.log('receipt of kissing two lips: ', receipt);
          dispatch(fetchData(blockchain.account));
          setKissLips([null, null]);
        });
    } else {
      window.alert('Please select two valid lips to kiss!');
    }
    setLoading(false);
  };

  return (
    <s.Screen image={_color}>
      {blockchain.account === '' || blockchain.lipToken === null ? (
        <s.Container flex={1} ai={'center'} jc={'center'}>
          <s.TextTitle>Connect to the game</s.TextTitle>
          <s.SpacerSmall />
          <button
            className="btn btn-primary my-2"
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
            className="btn btn-success my-2"
            disabled={loading ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFT(blockchain.account, 'Unknown');
            }}
          >
            CREATE NFT LIP
          </button>
          <s.Container jc={'center'} ai={'center'}>
            <TopOffCanvas buttonText="SHOW KISS LIST">
              {(!kissLips[0] || !kissLips[1]) && (
                <p style={{ textAlign: 'center' }}>
                  Please select at least two lips!
                </p>
              )}
              {kissLips[0] && kissLips[1] && (
                <s.Container jc={'center'} ai={'center'} fd={'row'}>
                  <KissCard lip={kissLips[0]} />
                  <s.SpacerSmall />
                  <button
                    className="btn btn-danger my-2"
                    disabled={loading ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      kissTwoLips(blockchain.account);
                    }}
                  >
                    KISS
                  </button>
                  <s.SpacerSmall />
                  <KissCard lip={kissLips[1]} />
                </s.Container>
              )}
            </TopOffCanvas>
          </s.Container>
          <s.SpacerMedium />
          <TransferModal
            lip={transferingLip}
            onTransferFinish={() => {
              dispatch(fetchData(blockchain.account));
              setTransferingLip(null);
            }}
          />
          <s.Container jc={'center'} fd={'row'} style={{ flexWrap: 'wrap' }}>
            {data.allOwnerLips.map((item, index) => {
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
                    <s.Container fd="column">
                      <div className="my-2">
                        <button
                          className="btn btn-light"
                          disabled={loading ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            levelUpLip(blockchain.account, item.id);
                          }}
                        >
                          Level Up
                        </button>
                        <TransferButton
                          onClick={() => setTransferingLip(item)}
                        />
                      </div>
                      <div>
                        {!item.isKissed &&
                          item.id !== kissLips[0]?.id &&
                          item.id !== kissLips[1]?.id && (
                            <button
                              className="btn btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleKissLipIdAdd(item.id);
                              }}
                            >
                              Add to kiss list
                            </button>
                          )}
                        {item.isKissed && (
                          <button className="btn btn-secondary" disabled>
                            Kissed
                          </button>
                        )}
                        {(item.id === kissLips[0]?.id ||
                          item.id === kissLips[1]?.id) && (
                          <button className="btn btn-warning" disabled>
                            Waiting to kiss
                          </button>
                        )}
                      </div>
                    </s.Container>
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
