serverUrl = "https://0dvykhhyfa2h.usemoralis.com:2053/server";
appId =  "LcGIpFwx9xAohSjX5FoO0sgn7AuJbfxOzpEGh82F";
Moralis.start({ serverUrl, appId });

const CONTRACT_ADDRESS = "0xbDc74d2168e0FE169aD7f37A948D2d2D98A31729"

let web3;

async function login() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    const web3Provider = await Moralis.enableWeb3();
    web3 = new Web3(Moralis.provider);
    let accounts = await web3.eth.getAccounts();
    
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");

    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = accounts[0];
}

async function mint() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);
    let accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts[0]);
    const contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);
    contract.methods.mint(address, tokenId, amount).send({ from: accounts[0], value: 0 })
        .on("receipt", function (receipt) {
            alert("Mint done!");
        });
}

document.getElementById("submit_mint").onclick = mint;

login();