import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NearbyConnectionsExpo.web.ts
// and on native platforms to NearbyConnectionsExpo.ts
import NearbyConnectionsExpoModule from './src/NearbyConnectionsExpoModule';
import NearbyConnectionsExpoView from './src/NearbyConnectionsExpoView';
import { ChangeEventPayload, NearbyConnectionsExpoViewProps } from './src/NearbyConnectionsExpo.types';

// Get the native constant value.
export const PI = NearbyConnectionsExpoModule.PI;

export function hello(): string {
  return NearbyConnectionsExpoModule.hello();
}

export async function setValueAsync(value: string) {
  return await NearbyConnectionsExpoModule.setValueAsync(value);
}

const emitter = new EventEmitter(NearbyConnectionsExpoModule ?? NativeModulesProxy.NearbyConnectionsExpo);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { NearbyConnectionsExpoView, NearbyConnectionsExpoViewProps, ChangeEventPayload };
