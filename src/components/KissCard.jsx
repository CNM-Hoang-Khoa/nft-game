import React from 'react';
import * as s from '../styles/globalStyles';
import LipRenderer from './lipRenderer';

export default function KissCard({ lip }) {
  return (
    <s.Container jc={'center'} ai={'center'}>
      <LipRenderer lip={lip} />
      <s.SpacerSmall />
      {lip?.id && <s.TextDescription>ID: {lip?.id}</s.TextDescription>}
    </s.Container>
  );
}
