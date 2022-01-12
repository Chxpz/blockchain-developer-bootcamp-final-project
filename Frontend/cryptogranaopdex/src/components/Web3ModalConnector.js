import { ethers } from "ethers";
import Web3Modal from "web3modal";


export default async function web3Connector(){
    const web3Modal = new Web3Modal();

    const instance = await web3Modal.connect();
    
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    console.log(signer)
    return signer;

}