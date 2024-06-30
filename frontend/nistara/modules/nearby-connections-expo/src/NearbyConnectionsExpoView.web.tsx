import * as React from 'react';

import { NearbyConnectionsExpoViewProps } from './NearbyConnectionsExpo.types';

export default function NearbyConnectionsExpoView(props: NearbyConnectionsExpoViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
