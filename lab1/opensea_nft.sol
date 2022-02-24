pragma solidity ^0.8.0;

//import ERC1155 token contract from Openzepperlin

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract NFTContract is ERC1155, Ownable{

  //names for internal use
  uint256 public constant Punk0 = 0;
  uint256 public constant Punk1 = 1;
  uint256 public constant Punk2 = 2;
  uint256 public constant Punk3 = 3;

  constructor() ERC1155("https://31p9sqtqfrtq.usemoralis.com/{id}.json"){
      _mint(msg.sender, Punk0, 1, "");
      _mint(msg.sender, Punk1, 1, "");
      _mint(msg.sender, Punk2, 2, "");
      _mint(msg.sender, Punk3, 1, "");
  }

  function mint(address account, uint256 id, uint256 amount) public onlyOwner {
      _mint(account, id, amount, "");
  }
  
  function burn(address account, uint256 id, uint256 amount) public {
    require(msg.sender == account);
    _burn(account, id, amount);
  }

}