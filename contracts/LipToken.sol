// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LipToken is ERC721, Ownable {
    uint256 COUNTER;

    struct Lip {
      string name;
      uint256 id;
      uint256 dna; // generate images like CryptoKitties
      uint8 level;
      uint8 rarity;
    }

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function mintMyNft(address toAddress) public onlyOwner(){
        _safeMint(toAddress, COUNTER);
        COUNTER++;
    }
}