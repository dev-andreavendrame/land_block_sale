import { XC_RMRK_ABI } from '../Constants';
import LandBlockSalesABI from '../smartContracts/ABI/LandBlockSaleABI.json';
import SkybreachLandSaleABI from '../smartContracts/ABI/SkybreachLandSaleABI.json';
import XCRMRKPartialABI from '../smartContracts/ABI/XcRMRKPartialABI.json';

// Polygon smart contract addresses
export const XCRMRK_TOKEN_ADDRESS = "0xffffffFF893264794d9d57E1E0E21E0042aF5A0A";
export const LAND_BLOCK_SALES_ADDRESS = "0x7f57c6bD29c0dbee3953896eaE15fE4203517f1c";
export const SKYBREACH_LAND_SALES_ADDRESS = "0x913a3E067a559Ba24A7a06a6CDEa4837EEEAF72d";


// Smart Contract ABIs
const XCRMRK_TOKEN_ABI = XCRMRKPartialABI;
const LAND_BLOCK_SALES_ABI = LandBlockSalesABI;
const SKYBREACH_LAND_SALES_ABI = SkybreachLandSaleABI;

// 1. Import ethers
const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  moonriver: {
    name: 'moonriver',
    rpc: 'https://moonriver.blastapi.io/51597bed-7bab-4ff0-b412-cbb3febf9803',
    chainId: 1285,
  },
};
// 3. Create ethers provider
export const moonriverProvider = new ethers.providers.StaticJsonRpcProvider(
  providerRPC.moonriver.rpc, 
  {
    chainId: providerRPC.moonriver.chainId,
    name: providerRPC.moonriver.name,
  }
);

// Metamask provider
export const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);

// ---------------------------------- //
// ---------- SC instances ---------- //
// ---------------------------------- //

// XCRMRK token
export const xcRMRKReadable = new ethers.Contract(XC_RMRK_ABI, XCRMRK_TOKEN_ABI, moonriverProvider);
export const xcRMRKWritable = new ethers.Contract(XCRMRK_TOKEN_ADDRESS, XCRMRK_TOKEN_ABI, metamaskProvider.getSigner());

// Land Block Sale
export const landBlockSalesReadable = new ethers.Contract(LAND_BLOCK_SALES_ADDRESS, LAND_BLOCK_SALES_ABI, moonriverProvider);
export const landBlockSalesWritable = new ethers.Contract(LAND_BLOCK_SALES_ADDRESS, LAND_BLOCK_SALES_ABI, metamaskProvider.getSigner());

// Skybreach public sale
export const skybreachPublicSaleReadable = new ethers.Contract(SKYBREACH_LAND_SALES_ADDRESS, SKYBREACH_LAND_SALES_ABI, moonriverProvider);
export const skybreachPublicSaleWritable = new ethers.Contract(SKYBREACH_LAND_SALES_ADDRESS, SKYBREACH_LAND_SALES_ABI, metamaskProvider.getSigner());