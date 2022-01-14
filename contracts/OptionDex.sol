// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OptionDex is Ownable {

    uint id;//id asigned to each option
    address[] internal Token;// Token 0 is the underline asset Token 1 plays the role of an stablecoin
    uint checkedPrice;//price that is reference at the expiration date
    // uint expirationTime = 5760;//average blocks produced per day

    // scope to avoid stack too deep errors
    struct Option {
        uint _id; //each option has an id
        uint futurePrice;//future price. The price of the underline assets at the option expiration date
        uint amount; //the amount of underline assets sold/bought in the option
        uint premium; //value paid by the buyer to the initiator to have the right over the option
        bool premiumPaid;//control if the premium was paid
        bool expired;//based on the expirationDate the option can be settled (if expired) or not
        bool executed; //true if the option has been settled
        address initiator; //who starts the option by selling a put or a call
        address buyer; //who purchases the option from the initiator
        uint8 sidePosition; //call(0) or put(1) 
    }
    //stores all the updated order in the system
    mapping(uint => Option) public orderBook;
    
    //the user needs to deposit some underline assets to starts the operation
    //user margin controls the margin to allow users to initiate options
    //every deposit increases the margin, all option initialization reduces the margin
    //when a option is not settled at the expiration date the initiator has its margin released
    //to create call options the initiator needs to deposit the underline assets
    //to create put options the initiator needs to deposit an stable coin
    mapping(address => uint) public availableMarginCall;
    mapping(address => uint) public allocatedMarginCall;

    mapping(address => uint) public availableMarginPut;
    mapping(address => uint) public allocatedMarginPut;

    //receives the user deposit in the underline assets and updates the availableMarginCall
    function depositMarginCall(uint _amount) public{
        IERC20(Token[0]).transferFrom(msg.sender, address(this), _amount);
        availableMarginCall[msg.sender] = availableMarginCall[msg.sender] + _amount;
    }

    function withdrawMarginCall(uint _amount) public checkMarginCall(_amount){
        availableMarginCall[msg.sender] = availableMarginCall[msg.sender] - _amount;
        IERC20(Token[0]).transfer(msg.sender, _amount);
    }

    function depositMarginPut(uint _amount) public{
        IERC20(Token[1]).transferFrom(msg.sender, address(this), _amount);
        availableMarginPut[msg.sender] = availableMarginPut[msg.sender] + _amount;
    }

    function withdrawMarginPut(uint _amount) public checkMarginPut(_amount){
        availableMarginPut[msg.sender] = availableMarginPut[msg.sender] - _amount;
        IERC20(Token[1]).transfer(msg.sender, _amount);
    }

    //set the CRG Token to be used to purchase options
    function setAcceptedToken(address[] memory _token) public {
        Token = _token;
    }

    //Check if the user has available margin to perform operations
    modifier checkMarginCall(uint amount){
        require(amount <= availableMarginCall[msg.sender], 'User has not enough margin to perform this operation');
        _;
    }

    modifier checkMarginPut(uint amount){
        require(amount <= availableMarginPut[msg.sender], 'User has not enough margin to perform this operation');
        _;
    }

    modifier notExecuted(uint _id){
        require(!orderBook[_id].executed, 'Option alredy executed');
        _;
    }

    uint[] public options;//creates the options array that will be populated with the struct format in the initializePosition
    
    //initialize a option position
    function initializePosition(
        uint _amount, 
        uint8 _sidePosition, 
        uint _premium, 
        uint _futurePrice 
        ) public {
        
        //each interaction increments the id
        id = id + 1;

        //instantiate the struct to create a option
        Option memory option = Option (
            
            {
                _id : id,
                amount : _amount, //up to the user when create the option
                sidePosition : _sidePosition, //up to the user when create the option
                initiator : msg.sender,
                buyer: 0x0000000000000000000000000000000000000000,//the buyer is not set, will be set once some user buys the option. See function EnterPosition
                premium : _premium, //up to the user when create the option
                premiumPaid : false, //as the option is being created at this point there is no premium paid
                futurePrice : _futurePrice, //up to the user when create the option
                // placedDate : block.number, //the block number when the option was created
                // expirationDate : block.number + (_expirationDate * expirationTime), //up to the user when create the option. Need to informed in days.
                expired : false, //just creat the option
                executed: false //just creat the option
            }
        );
        if(_sidePosition == 0){
            require(_amount <= availableMarginCall[msg.sender], 'Not enough margin call');
            availableMarginCall[msg.sender] = availableMarginCall[msg.sender] - _amount; //updates the userMargin
            allocatedMarginCall[msg.sender] = allocatedMarginCall[msg.sender] + _amount;
        }else if(_sidePosition == 1){
            require(_amount * _futurePrice <= availableMarginPut[msg.sender], "Not enough margin put");
            availableMarginPut[msg.sender] = availableMarginPut[msg.sender] - _amount * _futurePrice; //updates the userMargin
            allocatedMarginPut[msg.sender] = allocatedMarginPut[msg.sender] + _amount * _futurePrice;
        }else {
            string memory message = "Should define 0 for call or 1 for put";
        }
        options.push(option._id); //update the options array by pushin the struct above
        
        orderBook[id] = option; //update the orderBook with the option struct. This will be use in the next updates to have buy and sell functionality to the users       
}
    // internal function to send the CRG Tokens from buyer to initiator when the buyer purchases the option
    // the frontend dapp needs to request to the buyer to approve this contract to spend the money on his behalf by
    // callint the Approve function in the CRG Token (ERC20 standard)
    function _buyingTheOption(address _buyer, address _initiator, uint _premium) internal{
        IERC20(Token[1]).transferFrom(_buyer, _initiator, _premium); 
    }

    //called by the buyer to purchase an option    
    function EnterPosition (uint _id) public notExecuted(_id){
        Option storage _options = orderBook[_id];//initialize the option based on its recored in the orderBook
        _options.premiumPaid = true; //once Paid set the premium paid to true
        _options.buyer = msg.sender;//update the orderBook setting the buyer as msg.sender
        _buyingTheOption(msg.sender, _options.initiator, _options.premium);//call the internal function to send the CRG Tokens (premium payment) to the initiator
    }

    //if the initiator wants to shutdown the option as long as nobody purchased it
    function shutDownOption(uint _id) public  notExecuted(_id) {
        require(!orderBook[_id].premiumPaid, "Option can not be removed");
        require(orderBook[_id].initiator == msg.sender, 'Caller is not the initiator');
        Option storage _options = orderBook[_id];
        _options.initiator = 0x0000000000000000000000000000000000000000;
        _options.buyer = 0x0000000000000000000000000000000000000000;
        if(orderBook[_id].sidePosition == 0){
            allocatedMarginCall[msg.sender] = allocatedMarginCall[msg.sender] - _options.amount;
            availableMarginCall[msg.sender] = availableMarginCall[msg.sender] + _options.amount; //updates the userMargin
        }else if(orderBook[_id].sidePosition == 1){
            allocatedMarginPut[msg.sender] = allocatedMarginPut[msg.sender] - ( _options.amount * _options.futurePrice);
            availableMarginPut[msg.sender] = availableMarginPut[msg.sender] + ( _options.amount * _options.futurePrice); //updates the userMargin
        }else {
            string memory message = "Error";
        }
    }

    //Set the price of the underline asset token0
    function setCheckPrice(uint _inputedPrice) public onlyOwner{
        checkedPrice = _inputedPrice;
    }
    
    //Get the price of the underline asset token0
    function updateCheckPrice() public view returns (uint){
        return checkedPrice; 
    }

    //at the expiration date if the buyer want to settle its option he needs to pay the remaining amount. Val
    function calculatingRemaingAmount(uint _id) public view returns (uint){
        Option storage _options = orderBook[_id];
        _options.amount;
        _options.premium;
        _options.sidePosition;
        if(_options.sidePosition == 0){
            uint total = _options.amount * checkedPrice;
            uint remainingAmount =  total - _options.premium;
            return remainingAmount;
        }else if(_options.sidePosition == 1){
            uint remainingAmount = _options.amount * checkedPrice;
            return remainingAmount;
        }else{
            string memory message = "error";
        }
    }

    // On the settlement event, if the buyer settles the option he needs to pays the remaining amount to the initiator using CRG Token.
    // At this poin the DAPP called the Approve function in the CRG Token
    function _sendRemainingAmountToInitiator(uint _id) internal {
        Option storage _options = orderBook[_id];
        uint remainingAmount = calculatingRemaingAmount(_id);
        if(_options.sidePosition == 0){
            IERC20(Token[1]).transferFrom(_options.buyer, _options.initiator, remainingAmount);
        }else if(_options.sidePosition == 1){
            IERC20(Token[0]).transferFrom(_options.buyer, _options.initiator, remainingAmount);
        }else{
            string memory message = "error";
        }       
        _options.expired = true;
        _options.executed = true;
        // _options.remainingAmountPaid = true;
    }

    //if the buyer settles the option, the contract transfers the underline assets to the buyer(call) or ERC20(put)
    function _releaseAssetsToBuyer(uint _id) internal {
        Option memory _options = orderBook[_id];
        address initiator = _options.initiator;
        address buyer = _options.buyer;
        uint amount = _options.amount;
        if(_options.sidePosition == 0){
            allocatedMarginCall[initiator] = allocatedMarginCall[initiator] - _options.amount;
            IERC20(Token[0]).transfer(buyer, amount);
        }else if(_options.sidePosition == 1){
            uint _value = _options.amount * _options.futurePrice;
            allocatedMarginPut[initiator] = allocatedMarginPut[initiator] - _value;
            IERC20(Token[1]).transfer(_options.buyer, _value);
            
        }else{
            string memory message = 'error';
        }
    }

    // in case a buyer paid the premium, however did not paid the remaining amount and the option is expired
    // the initiator is able to release allocated margin
    function releaseAllocatedMarginForAPremiumPaidExpiredOption(uint _id) public notExecuted(_id){
        require(orderBook[_id].buyer != 0x0000000000000000000000000000000000000000 ,'Option cannot be removed');
        require(orderBook[_id].initiator == msg.sender, 'Caller is not the initiator');
        Option storage _options = orderBook[_id];
        orderBook[_id].executed = true;
        
        if(_options.sidePosition == 0){
            allocatedMarginCall[msg.sender] = allocatedMarginCall[msg.sender] + _options.amount;
        }else if(_options.sidePosition == 1){
            uint _value = _options.amount * _options.futurePrice;
            allocatedMarginPut[msg.sender] = allocatedMarginPut[msg.sender] + _value;
        }

        _options.initiator = 0x0000000000000000000000000000000000000000;
        _options.buyer = 0x0000000000000000000000000000000000000000;
    }
    
    function Settlement (uint _id) public {
        Option storage _options = orderBook[_id];
        
        uint _spotPrice = uint(updateCheckPrice());
        
        uint _value = _options.amount * _options.futurePrice;
        if(_options.sidePosition == 0) {
            if(_spotPrice >= _options.futurePrice){
                _options.expired = true;
                _options.executed = true;
                allocatedMarginCall[msg.sender] = allocatedMarginCall[msg.sender] - _options.amount;
                availableMarginCall[msg.sender] = availableMarginCall[msg.sender] + _options.amount;                
                }else{
                _options.expired = true;
                _options.executed = true;
                _sendRemainingAmountToInitiator(_id);
                _releaseAssetsToBuyer(id);
            }
        }else if(_options.sidePosition == 1){
            if(_spotPrice >= _options.futurePrice){
                _options.expired = true;
                _options.executed = true;
                allocatedMarginPut[msg.sender] = allocatedMarginPut[msg.sender] - _value;
                availableMarginPut[msg.sender] = availableMarginPut[msg.sender] + _value;
            }else{
                _options.expired = true;
                _options.executed = true;
                _sendRemainingAmountToInitiator(_id);
                _releaseAssetsToBuyer(id);
            }
        }else{
            string memory message = 'error';
        }
    }
}