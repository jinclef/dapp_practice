import {Box, Button, Flex} from "@chakra-ui/react";
import {useState} from "react";
import Web3 from "web3";
import { MINT_NFT_ABI, MINT_NFT_CONTRACT } from "./web3.config";
import axios from "axios";
import {Image} from "@chakra-ui/react";

const web3 = new Web3(window.etherium);
const mintContract = new web3.eth.Contract(MINT_NFT_ABI, MINT_NFT_CONTRACT);

const App = () => {
  const [account, setAccount] = useState("");
  const [src, setSrc] = useState("");

  const getAccount = async () => {
    try {
      if (window.etherium) {
        const accounts = await window.etherium.request({
          method: "eth_requestAccounts"
        });

        setAccount(accounts[0]);
      } else {
        alert("Install Metamask!!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = () => {
    setAccount("");
  }

  const mint = async () => {
    try {
      if (!account) {
        alert("Connect Wallet!!!");
        return;
      }

      const mintNFT = await mintContract.methods.mintNFT().send({from: account});

      if (mintNFT.status) {
        const balanceOf = await mintContract.methods.balanceOf(account).call();
        const tokenByIndex = await mintContract.methods.tokenByIndex(balanceOf - 1).call();
        const tokenURI = await mintContract.methods.tokenURI(tokenByIndex).call();
        // console.log("Token URI: ", tokenURI);

        const response = await axios.get(tokenURI);
        setSrc(response.data.image);
      }

    } catch (error){
      console.log(error);
    }
  };

  return (
    <Box /*bgColor="red.100"*/>
      <Box bgColor="yellow.100" px={4} py={8} textAlign="center">
        {account ? ( // connect Wallet (signin/signout)
          <Box>
            <Box>
              Account: {account.substring(0,4)}...{account.substring(account.length-4)}
              <Button colorScheme="red" onClick={logOut}>Log Out</Button> 
            </Box>
          </Box>
        ) : (
          <Box>
            Account: Not Connected
            <Button colorScheme="yellow" onClick={getAccount}>Metamask</Button>
          </Box>
        )}
      </Box>
      <Flex justifyContent="center" alignItems="center" minH="100vh" flexDirection={"column"}>
        {src ? <Image src={src} alt="NFT" /> : <Box w={512} h={512} bgColor="gray.100" p={4} border="2px" textAlign="center" />}
        <Button mt={8} onClick={mint}>Mint</Button>
      </Flex>
    </Box>
  )
}

export default App;
