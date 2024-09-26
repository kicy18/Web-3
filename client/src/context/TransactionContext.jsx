import React , {useEffect , useState} from 'react';
import {ethers} from 'ethers';

import {contractABI , contractAddress} from '../utils/constants'


export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = async () => {
    const provider = new  ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress , contractABI , signer);


    return transactionContract;
}
export const TransactionProvider = ({children}) =>{
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData,setFormData] = useState({addressTo: '' , amount:'',keyword:'',message:''});
    const [isLoading, setisLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(0)
    const handleChange = (e,name) =>{
        setFormData((prevState)=>({...prevState,[name]:e.target.value}));

    }
    const checkIfWallletIsConnected = async ()=>{
        try {
            if (!ethereum) return alert("Please install metamask")
            const accounts = await ethereum.request({ method: 'eth_accounts' })

            if(accounts.length){
                setCurrentAccount(accounts[0]);

            }
            else{
                console.log("No account found");
            }
           
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async ()=>{
        try{
            if(!ethereum) return alert("Please install metamask")
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);

        }
        catch(error){
            console.log(error);
            throw new Error("No ethereum object.")

        }
    }

    const sendTransaction = async () =>{
        try {
            if(!ethereum) return alert("Please install metamask")

            const {addressTo , amount , keyword , message } = formData;
            const transactionContract =  getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method:'eth_sendTransaction',
                params : [{
                    from : currentAccount,
                    to: addressTo,
                    gas : '0x5208',
                    value : parsedAmount._hex,
                }]
        });
        const transactionHash = await transactionContract.addToBlockchain(addressTo , parsedAmount , message,keyword);
            setisLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setisLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber())

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
            
        }
    }
    useEffect(() => {
      checkIfWallletIsConnected();
    }, []);
    
    return (
        <TransactionContext.Provider value={{connectWallet,currentAccount ,formData,setFormData,handleChange,sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}
