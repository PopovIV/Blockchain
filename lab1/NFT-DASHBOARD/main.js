serverUrl = "https://0dvykhhyfa2h.usemoralis.com:2053/server";
appId =  "LcGIpFwx9xAohSjX5FoO0sgn7AuJbfxOzpEGh82F";
Moralis.start({ serverUrl, appId});

const CONTRACT_ADDRESS = "0xbDc74d2168e0FE169aD7f37A948D2d2D98A31729"
let currentUser;

function fetchNFTMetadata(NFTs) {
    let promises = [];

    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        // Call Moralis Cloud function -> static JSON file
        promises.push(fetch("https://0dvykhhyfa2h.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=LcGIpFwx9xAohSjX5FoO0sgn7AuJbfxOzpEGh82F&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = {address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby"};
            return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then( (res) => {
            nft.owners  = [];
            res.result.forEach(element => {
                nft.owners.push(element.ownerOf);
            })
            return nft;
        }))
    }
    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
         let htmlString = `
            <div class="card">
                <img src="${nft.metadata.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nft.metadata.name}</h5>
                    <p class="card-text">${nft.metadata.description}</p>
                    <p class="card-text">Total amount: ${nft.amount}</p>
                    <p class="card-text">Number of owners: ${nft.owners.length}</p>
                    <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                    <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
                    <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
                </div>
            </div>
         `

         let col = document.createElement("div");
         col.className = "col col-md-3"
         col.innerHTML = htmlString;
         parent.appendChild(col);
    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts");
    const options = {chain: "rinkeby", address: accounts[0], token_address: CONTRACT_ADDRESS};
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object, currentElement) => {
            object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {})
        console.log(result);
        return result
    });
}

async function log() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }

    const options = {address: CONTRACT_ADDRESS, chain: "rinkeby"}
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();

    console.log(NFTWithMetadata);
    renderInventory(NFTWithMetadata, ownerData);
}

log();