import React from 'react';
import './IncomingCallsPage.style.scss';

import { IncomingsCallsTableComponent, QueuedCallsTableComponent } from '../../../components/index';

function IncomingCallsPage() {

  return (
    <>
      <div className='incomings-calls'>

        <IncomingsCallsTableComponent />

        <QueuedCallsTableComponent />

      </div>
    </>
  )
}

export default IncomingCallsPage