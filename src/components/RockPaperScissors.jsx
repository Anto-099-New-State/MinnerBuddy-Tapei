import React, { useState } from 'react'
import { ConnectButton,TransactionButton,useActiveAccount, useActiveWallet, useDisconnect } from 'thirdweb/react';
import { client } from '../cliet';
import { shortenAddress } from "thirdweb/utils"
import { getContract } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains'
import { claimTo } from 'thirdweb/extensions/erc20'
import { ethers } from 'ethers';

const RockPaperScissors = () => {
    const account = useActiveAccount();
    const wallet = useActiveWallet();
    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: "0xA8b8E67d657e8ABDa51a2071B79BeB678146C899"
    })
    const [userChoice,setUserchoice] = useState('');
    const [computerChoice,setComputerchoice] = useState('');
    const [result,setResult] = useState('');
    const choices = ['Rock','Paper','Scissors'];
    const [showPrize, setShowPrize] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [prizeClaimed, setPrizeClaimed] = useState(false);


    const handleclick = (choice) =>{
        setUserchoice(choice);

        const computerChoice = choices[Math.floor(Math.random()*choices.length)];

        setComputerchoice(computerChoice);

        determineWinner(choice,computerChoice);
        const gameResult = determineWinner(choice,computerChoice);
        console.log(gameResult);
        setShowPrize(gameResult=='Win');
    };
    const determineWinner = (user,computer) =>{
        if(user == computer){
            setResult("It's a tie");

        }
        else if(
            (user === 'Rock' && computer === 'Scissors')||
            (user === 'Paper' && computer === 'Rock')||
            (user === 'Scissors' && computer === 'Paper') 
        ){
            setResult('You Win');
            return 'Win';
        }else{
            setResult('You Lose');
        }
    };
    const reset = () =>{
        setResult(null);
        setShowPrize(false);
        setPrizeClaimed(false);
    }
    const claimPrize = () => {
        setShowModal(true);
    };
    console.log(contract, account?.address, "10");

  return (
    <div>
    <div ><h1>RockPaperScissors</h1>

    </div>
    <div>
      {!account ? (
         <ConnectButton
         client={client}
         accountAbstraction={{
                chain: baseSepolia,
                sponsorGas: true,
         }}
         />
       ): 
       (
        <>
        {!result ? (
            <>
            <p>{shortenAddress(account.address)}</p>
            {choices.map((choice, index)=>(
                <button key={index} onClick={()=>handleclick(choice) }>{ choice === 'Rock' ? '🪨':
                    choice === 'Paper' ? '🧻':
                    '✂️'}</button>
            ))
            }
            <button onClick={() => wallet.disconnect()}>logout</button>
            </>
            ) 
            : 
            (<>
            <p>Your Choice: {
            userChoice === 'Rock' ? '🪨':
            userChoice === 'Paper' ? '🧻':
            '✂️'
                }</p>
            <p>Computer Choice: {computerChoice}</p>
            <h2>{result}</h2>
            <div>
                <button onClick={()=>reset()}>try again</button>
             </div>
             {showPrize && !prizeClaimed && (
                                        <button
                                            onClick={claimPrize}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: '#ffc107',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >Claim Prize</button>
                                    )}
                                    {showModal && (
                                        <div style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{
                                                background: 'white',
                                                padding: '2rem',
                                                borderRadius: '8px',
                                                maxWidth: '300px',
                                                textAlign: 'center'
                                            }}>
                                                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' , color:'black' }}>Claim 10 Tokens!</h2>
                                                <p style={{ marginBottom: '1rem', color: 'black',fontWeight: '80%'}}>You won and can claim 10 tokens to your wallet.</p>
                                               
                                                <TransactionButton
                                                 
                                                    transaction={async () => claimTo({
                                                        contract: contract,
                                                        to: account.address,
                                                        quantity: "100000000000"
                                                    })}
                                                    
                                                    onTransactionConfirmed={() => {
                                                        alert('Prize claimed!')
                                                        setShowModal(false)
                                                        setPrizeClaimed(true)
                                                    }}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >Claim Prize</TransactionButton>
                                            </div>
                                        </div>
                                    )}            
            </>
           )}
         </>
       )
       }
    
     </div>
     
    </div>
  )
}

export default RockPaperScissors