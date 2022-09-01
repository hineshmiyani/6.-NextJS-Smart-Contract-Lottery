import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "@web3uikit/core";
import { Bell } from "@web3uikit/icons";
import Spinner from "./Spinner";

const customClass =
  "mr-2 w-6 h-6 text-blue-300 animate-spin dark:text-gray-600 fill-white";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayer, setNumPlayer] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification();

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee())?.toString();
    const numPlayerFromCall = (await getNumberOfPlayers())?.toString();
    const recentWinnerFromCall = (await getRecentWinner())?.toString();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayer(numPlayerFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: <Bell fontSize={20} />,
    });
  };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    await updateUI();
  };

  return (
    <div className="p-5">
      Hi, From Lottery Entrance
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white w-36 px-4 py-2 my-4 rounded"
            onClick={async () =>
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <Spinner customClass={customClass} />
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>

          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Players : {numPlayer}</div>
          <div>RecentWinner : {recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Detected!</div>
      )}
    </div>
  );
}
