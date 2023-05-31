// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract RealEstate {
    
    struct Property {
        string location;
        uint256 price;
        address owner;
        bool isForSale;
        string image;
        string propertyName;
    }
    
    mapping (uint256 => Property) public properties;
    uint256 public propertyCounter;
    
    event NewProperty(uint256 propertyId, string location, uint256 price, address owner,string propertyName);
    event TransferProperty(uint256 propertyId, address previousOwner, address newOwner);
    
    function addProperty(string memory _location, uint256 _price, string memory _image,string memory _propertyName) public {
        propertyCounter++;
        properties[propertyCounter] = Property(_location, _price, msg.sender, true, _image,_propertyName);
        emit NewProperty(propertyCounter, _location, _price, msg.sender,_propertyName);
    }
    
    function buyProperty(uint256 _propertyId) public payable {
        Property memory property = properties[_propertyId];
        require(property.isForSale == true, "This property is not for sale.");
        require(msg.value == property.price, "You need to pay the full price of the property.");
        address payable previousOwner = payable(property.owner);
        properties[_propertyId].owner = msg.sender;
        properties[_propertyId].isForSale = false;
        previousOwner.transfer(msg.value);
        emit TransferProperty(_propertyId, previousOwner, msg.sender);
    }
    function changeOwnership(uint256 _propertyId) public{
        Property memory property = properties[_propertyId];
        require(property.owner ==  msg.sender, "not your property");
        properties[_propertyId].isForSale = true;
    }
    
}   
