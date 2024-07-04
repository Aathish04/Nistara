import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NearbyConnectionsExpo.web.ts
// and on native platforms to NearbyConnectionsExpo.ts
import NearbyConnectionsExpoModule from './src/NearbyConnectionsExpoModule';

export function hello(): string {
  return NearbyConnectionsExpoModule.hello();
}

export async function requestPermissionsAsync():Promise<any>{
  return NearbyConnectionsExpoModule.requestPermissionsAsync()
}

export async function getPermissionsAsync():Promise<any>{
  return NearbyConnectionsExpoModule.getPermissionsAsync()
}