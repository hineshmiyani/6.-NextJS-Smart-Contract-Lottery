import { ConnectButton } from "@web3uikit/web3";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="p-4 font-bold text-3xl">Decentralized Lottery</h1>
      <div className="p-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
