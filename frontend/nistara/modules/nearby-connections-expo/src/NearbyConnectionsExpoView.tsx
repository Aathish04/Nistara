import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { NearbyConnectionsExpoViewProps } from './NearbyConnectionsExpo.types';

const NativeView: React.ComponentType<NearbyConnectionsExpoViewProps> =
  requireNativeViewManager('NearbyConnectionsExpo');

export default function NearbyConnectionsExpoView(props: NearbyConnectionsExpoViewProps) {
  return <NativeView {...props} />;
}
