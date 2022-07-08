import React from 'react';
import * as s from '../styles/globalStyles';
import LipRenderer from './lipRenderer';

export default function KissCard({ lip }) {
  return (
    <s.Container jc={'center'} ai={'center'}>
      <LipRenderer lip={lip} />
      <s.SpacerSmall />
      {lip?.id && <p>ID: {lip?.id}</p>}
    </s.Container>
  );
}
