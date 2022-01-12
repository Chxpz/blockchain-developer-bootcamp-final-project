// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/interfaces/IERC20.sol";


contract OptionDex{

    event OptionInit (uint optionId , address indexed initiator, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint expirationDate);
    event PositionPurchased (uint optionId , address indexed initiator, address indexed buyer, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint purchasedDate, uint expirationDate);
    event LiquidationOverCollateralization(uint optionId, address indexed initiator, address indexed buyer, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint LiquidationDate,
    uint expirationDate, address indexed keeper);

    uint id;
    address internal Token;
    
    struct Option {
        uint id; //each option has an id
        uint amount; //the amount of native token sold/bought in the option
        uint8 sidePosition; //call(0) or put(1)
        address payable initiator; //who starts the option by selling a put or a call
        address payable buyer; //who purchases the option from the initiator
        uint8 expirationDate; //the date when the option can be settled
        uint8 premium; //value paid by the buyer to the initiator to have the right over the option
        bool premiumPaid;//control if the premium was paid
        uint8 futurePrice;//future price. The price of the native token at the option expiration date 
        bool expired;//based on the expirationDate the option can be settled (if expired) or not
    }
    //stores all the updated order in the system
    mapping(uint => Option) public orderBook;
    
    //the user needs to deposit some native token to starts the operation
    //user margin controls the margin to allow users to initiate options, either call or put
    //every deposit increases the margin, all option initialization reduces the margin
    //when a option is not exercised the initiator has its margin released
    mapping(address => uint) public userMargin;

    //control the premium paid by each user in each individual position
    mapping(address => mapping(uint =>bool)) public premiumPaid; 

    //keep a track on the user position in the system 
    mapping(address => mapping(uint => Option[])) public userPositions;
    
    //check if the remaining amount has been paid by the buyer to the initiator in order to exercise the option
    mapping(uint => bool) public remainingValueDeposited;

    Option[] public options;

        function deposit() payable public{
        userMargin[msg.sender] = userMargin[msg.sender] + msg.value; 
    }

    modifier checkMargin(uint amount){
        require(amount <= userMargin[msg.sender], 'User has not enough margin to perform this operation');
        _;
    }

    function initializePosition(
        uint _id,
        uint _amount, // quantity of options
        uint8 _sidePosition, 
        uint8 _premium, //option price
        uint8 _futurePrice, 
        uint8 _expirationDate
        ) public checkMargin(_amount){

        Option memory option = Option (
            {
                id : _id,
                amount : _amount,
                sidePosition : _sidePosition,
                initiator : payable (msg.sender),
                buyer: payable (0x0000000000000000000000000000000000000000),
                premium : _premium,
                premiumPaid : false,
                futurePrice : _futurePrice,
                expirationDate : _expirationDate,
                expired : false
            }
        );
        
        userMargin[msg.sender] = userMargin[msg.sender] - _amount;
        options.push(option);
        orderBook[_id] = option;
}

    function setAcceptedToken(address _token) public {
        Token = _token;
    }

    function _buyingTheOption(address _buyer, address _initiator, uint8 _premium) internal{
        IERC20(Token).transferFrom(_buyer, _initiator, _premium);
    }

    function EnterPosition (uint _id, uint8 _premiumToPay) payable public {
        Option storage _options = orderBook[_id];
        address _initiator = _options.initiator;
        uint8 _premium = _options.premium;
        require(_premium == _premiumToPay, 'Premium wrong');
        _buyingTheOption(msg.sender, _initiator, _premiumToPay);
        _options.premiumPaid = true;
        _options.buyer = payable (msg.sender);
        
    }

    uint8 checkedPrice;
    function updateCheckPrice() public returns (uint){
        uint8 _checkedPrice = 10;
        checkedPrice = _checkedPrice;
        return checkedPrice; 
    }


    function calculatingRemaingAmount(uint _id) public view returns (uint){
        Option storage _options = orderBook[_id];
        uint8 spotPrice = _options.futurePrice;
        uint8 remainingAmount = checkedPrice - spotPrice; 
        return remainingAmount;
    }

    function _sendRemainingValueToInitiator(uint _id) internal {
        Option storage _options = orderBook[_id];
        address _buyer = _options.buyer;
        address _initiator = _options.initiator;
        uint8 _premium = _options.premium;
        IERC20(Token).transferFrom(_buyer, _initiator, _premium);
        }

    function _releaseAssetsToBuyer(uint _id) internal {
        Option storage _options = orderBook[_id];
        uint _amount = _options.amount;
        address payable _buyer = _options.buyer;
        address payable _initiator = _options.initiator;
        _buyer.transfer(_amount);
        userMargin[_initiator] = userMargin[_initiator] - _amount;
        }
    
    //check if the position is expired: should start using blocknumber
    //check who wons the bet. If initiator, nothing happens
        //If buyer: buyer needs to pay the diference spot-premium(use price feed), initiator receives de money
        //the contract send eth(one) to the buyer
    function Settlement (uint _id) public {
        Option storage _options = orderBook[_id];
        uint8 spotPrice = _options.futurePrice;
        checkedPrice = 10;
        if(spotPrice >= checkedPrice){
            require(remainingValueDeposited[_id] == true, 'Buyer needs to deposit the remaining value');
            _sendRemainingValueToInitiator(_id);
            _releaseAssetsToBuyer(_id);
            _options.expired = true ;
        }else{
            _options.expired = true ;
        }     
    }
}

