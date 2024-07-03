import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NearbyConnectionsExpo.web.ts
// and on native platforms to NearbyConnectionsExpo.ts
import NearbyConnectionsExpoModule from './src/NearbyConnectionsExpoModule';

// Get the native constant value.
export const PI = NearbyConnectionsExpoModule.PI;

export function hello(): string {
  return NearbyConnectionsExpoModule.hello();
}

export async function setValueAsync(value: string) {
  return await NearbyConnectionsExpoModule.setValueAsync(value);
}

