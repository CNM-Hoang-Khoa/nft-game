import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import LipRenderer from './lipRenderer';

export default function TransferModal({ lip, onTransferFinish }) {
  const [address, setAddress] = useState('');
  const blockchain = useSelector((state) => state.blockchain);

  const closeButtonRef = useRef(null);

  const handleSendLip = () => {
    if (blockchain !== null) {
      blockchain.lipToken.methods
        .simpleTransfer(lip.id, address)
        .send({
          from: blockchain.account,
        })
        .once('error', (err) => {
          console.log('mint nft error: ', err);
        })
        .then((receipt) => {
          console.log('mint nft receipt: ', receipt);
          onTransferFinish?.();
          closeButtonRef?.current?.click();
        });
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="exampleModalLabel"
                style={{ fontWeight: 'bold' }}
              >
                Transfer Lip NFT
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <p>
                  <strong>ID: {lip?.id}</strong>
                </p>
                <div style={{ width: 200 }}>
                  <LipRenderer lip={lip} />
                </div>
                <div className="mb-3">
                  <label htmlFor="wallet-address" className="col-form-label">
                    To address:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="wallet-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeButtonRef}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleSendLip();
                }}
              >
                Send NFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
