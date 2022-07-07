import React from 'react';

export default function TransferButton({ onClick }) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#exampleModal"
      data-bs-whatever="@mdo"
      onClick={(e) => {
        onClick?.();
      }}
    >
      Transfer
    </button>
  );
}
