import { requireNativeModule, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NearbyConnectionsExpo.web.ts
// and on native platforms to NearbyConnectionsExpo.ts
import NearbyConnectionsExpoModule from './src/NearbyConnectionsExpoModule';

export function sanitycheck(): string {
  return NearbyConnectionsExpoModule.sanitycheck();
}

export async function startAdvertising():Promise<any>{
  return NearbyConnectionsExpoModule.startAdvertising()
}

export async function startDiscovery():Promise<any>{
  return NearbyConnectionsExpoModule.startDiscovery()
}

export async function sendPayload(endpointId:string,bytes:Uint8Array):Promise<any>{
  return NearbyConnectionsExpoModule.sendPayload(endpointId,bytes)
}

export async function requestPermissionsAsync():Promise<any>{
  return NearbyConnectionsExpoModule.requestPermissionsAsync()
}

export async function getPermissionsAsync():Promise<any>{
  return NearbyConnectionsExpoModule.getPermissionsAsync()
}


const emitter = new EventEmitter(NearbyConnectionsExpoModule ?? requireNativeModule('NearbyConnectionsExpo'));

export function addOnEndpointConnectedListener(listener: (event:any) => void): Subscription {
  return emitter.addListener<any>('onEndpointConnected', listener);
}
export function addOnEndpointLostListener(listener: (event:any) => void): Subscription {
  return emitter.addListener<any>('onEndpointLost', listener);
}
export function addonPayloadReceivedListener(listener: (event:any) => void): Subscription {
  return emitter.addListener<any>('onPayloadReceived', listener);
}