// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract OptionDex{

    event OptionInit (uint optionId , address indexed initiator, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint expirationDate);
    event PositionPurchased (uint optionId , address indexed initiator, address indexed buyer, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint purchasedDate, uint expirationDate);
    event LiquidationOverCollateralization(uint optionId, address indexed initiator, address indexed buyer, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint LiquidationDate,
    uint expirationDate, address indexed keeper);

    address public Initiator;
    address public Buyer;
    address public Kepper;
    address internal Token;
    
    struct Option {
        uint id;
        uint amount;
        uint8 sidePosition; //call(0) or put(1)
        address payable initiator;
        address payable buyer;
        uint8 expirationDate;
        uint8 premium;
        bool premiumPaid;
        uint8 spotFuture;
        bool expired;
    }
    mapping(uint => Option) public orderControls;
    mapping(address => uint) public userMargin;
    mapping(address => mapping(uint =>bool)) public premiumPaid; // tracking the premium paid by the buyer for a specific option
    mapping(address => mapping(uint => Option[])) public userPositions;// trackin the position of a user inside the platform several operations
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
        uint8 _spotFuture, 
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
                spotFuture : _spotFuture,
                expirationDate : _expirationDate,
                expired : false
            }
        );
        
        userMargin[msg.sender] = userMargin[msg.sender] - _amount;
        options.push(option);
        orderControls[_id] = option;
}

    function setAcceptedToken(address _token) public {
        Token = _token;
    }

    function _buyingTheOption(address _buyer, address _initiator, uint8 _premium) internal{
        IERC20(Token).transferFrom(_buyer, _initiator, _premium);
    }

    function EnterPosition (uint _id, uint8 _premiumToPay) payable public {
        Option storage _options = orderControls[_id];
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
        Option storage _options = orderControls[_id];
        uint8 spotPrice = _options.spotFuture;
        uint8 remainingAmount = checkedPrice - spotPrice; 
        return remainingAmount;
    }

    function _sendRemainingValueToInitiator(uint _id) internal {
        Option storage _options = orderControls[_id];
        address _buyer = _options.buyer;
        address _initiator = _options.initiator;
        uint8 _premium = _options.premium;
        IERC20(Token).transferFrom(_buyer, _initiator, _premium);
        }

    function _releaseAssetsToBuyer(uint _id) internal {
        Option storage _options = orderControls[_id];
        uint _amount = _options.amount;
        address payable _buyer = _options.buyer;
        address payable _initiator = _options.initiator;
        _buyer.transfer(_amount);
        userMargin[_initiator] = userMargin[_initiator] - _amount;
        }
    
    function Settlement (uint _id) public {
        Option storage _options = orderControls[_id];
        uint8 spotPrice = _options.spotFuture;
        checkedPrice = 10;
        if(spotPrice >= checkedPrice){
            require(remainingValueDeposited[_id] == true, 'Buyer needs to deposit the remaining value');
            _sendRemainingValueToInitiator(_id);
            _releaseAssetsToBuyer(_id);
        }else{
            _options.expired = true ;
        }
       

    }


}