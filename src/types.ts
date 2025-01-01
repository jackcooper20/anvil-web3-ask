import { Web3 } from "web3";

// Basic types
export type ValidAddress = string;
export type ValidBytes = string;
export type Wei = string | number;
export type BlockNumber = string | number;

// Configuration interfaces
export interface Forking {
  jsonRpcUrl?: string;
  blockNumber?: number;
}

export interface AnvilConfig {
  host?: string;
  port?: string;
  accounts?: number;
  blockTime?: number;
  balance?: string;
  forkUrl?: string;
  forkBlockNumber?: number;
  [key: string]: string | number | boolean | undefined;
}

// RPC related interfaces
export interface JsonRpcRequest {
  method: string;
  params: unknown[];
  id: string | number;
  jsonrpc: "2.0";
}

export interface JsonRpcResponse {
  id: string | number;
  jsonrpc: "2.0";
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// Provider interfaces
export interface Provider {
  send(payload: JsonRpcRequest, callback: (error: Error | null, result?: JsonRpcResponse) => void): void;
}

export interface Web3Provider extends Web3 {
  currentProvider?: Provider;
} 