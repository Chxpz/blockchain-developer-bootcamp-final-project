// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./PriceConsumerV3.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";


contract OptionDex is PriceConsumerV3 {

    //one - one/usd
    constructor() {
        priceFeed = AggregatorV3Interface(0xcEe686F89bc0dABAd95AEAAC980aE1d97A075FAD);
    }

    event OptionInit (uint optionId , address indexed initiator, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint expirationDate);
    event PositionPurchased (uint optionId , address indexed initiator, address indexed buyer, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint purchasedDate, uint expirationDate);
    event LiquidationOverCollateralization(uint optionId, address indexed initiator, address indexed buyer, string sidePosition, uint amountDeposited, uint premium, uint futureSpot , uint startDate, uint LiquidationDate,
    uint expirationDate, address indexed keeper);

    uint id;//id asigned to each option
    address internal Token;// CRG Token used in the Dapp
    int checkedPrice;//price verified by the chainlink priceFeed at the expiration date
    uint expirationTime = 5760;//average blocks produced per day


    struct Option {
        uint _id; //each option has an id
        uint amount; //the amount of native token sold/bought in the option
        uint8 sidePosition; //call(0) or put(1) 
        address payable initiator; //who starts the option by selling a put or a call
        address payable buyer; //who purchases the option from the initiator
        uint placedDate;//date when the option is created
        uint expirationDate; //the date when the option can be settled
        uint8 premium; //value paid by the buyer to the initiator to have the right over the option
        bool premiumPaid;//control if the premium was paid
        uint futurePrice;//future price. The price of the native token at the option expiration date 
        bool expired;//based on the expirationDate the option can be settled (if expired) or not
        bool executed; //true if the option has been settled
        bool remainingAmountPaid;
    }
    //stores all the updated order in the system
    mapping(uint => Option) public orderBook;
    
    //the user needs to deposit some native token to starts the operation
    //user margin controls the margin to allow users to initiate options
    //every deposit increases the margin, all option initialization reduces the margin
    //when a option is not settled at the expiration date the initiator has its margin released
    //to create call options the initiator needs to deposit the native token
    //to create put options the initiator needs to deposit an stable coin
    mapping(address => uint) public availableMarginCall;
    mapping(address => uint) public allocatedMarginCall;

    mapping(address => uint) public availableMarginPut;
    mapping(address => uint) public allocatedMarginPut;
    
    //keep a track on the user position in the system 
    //mapping(address => mapping(uint => Option[])) public userPositions;

    function SetexpirationTime(uint _expirationTime) public {
        expirationTime = _expirationTime;
    }

    function getExpirationTime() public returns (uint){
        return expirationTime;
    }

    //receives the user deposit in the native token and updates the availableMarginCall
    function deposit(uint _amount) payable public{
        availableMarginCall[msg.sender] = availableMarginCall[msg.sender] + _amount; 
    }

    //only if the user has available margin, he can withdraw from the dapp
    function withdrawMarginCall(address payable _to, uint _amount) public payable checkMarginCall(_amount) {
        (bool sent, bytes memory data) = _to.call{value: _amount}("");
        require(sent, "Failed to send One");
    }

    function depositMarginPut(uint _amount) public{
        IERC20(Token).transferFrom(msg.sender, address(this), _amount);
        availableMarginPut[msg.sender] = availableMarginPut[msg.sender] + _amount;
    }

    function withdrawMarginPut(uint _amount) public checkMarginPut(_amount){
        IERC20(Token).transfer(msg.sender, _amount);
    }

    //set the CRG Token to be used to purchase options
    function setAcceptedToken(address _token) public {
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

    modifier notExpired(uint _id){
        require((orderBook[_id].expirationDate + 1000) <= block.number, 'Option has alredy expired'); //giving 1000 blocks bonus
        _;
    }

    Option[] public options;//creates the options array that will be populated with the struct format in the initializePosition

    //initialize a option position
    function initializePosition(
        uint _amount, 
        uint8 _sidePosition, 
        uint8 _premium, 
        uint8 _futurePrice, 
        uint8 _expirationDate
        ) public {
        
        //each interaction increments the id
        id = id + 1;

        //instantiate the struct to create a option
        Option memory option = Option (
            
            {
                _id : id,
                amount : _amount, //up to the user when create the option
                sidePosition : _sidePosition, //up to the user when create the option
                initiator : payable (msg.sender),
                buyer: payable (0x0000000000000000000000000000000000000000),//the buyer is not set, will be set once some user buys the option. See function EnterPosition
                premium : _premium, //up to the user when create the option
                premiumPaid : false, //as the option is being created at this point there is no premium paid
                futurePrice : _futurePrice, //up to the user when create the option
                placedDate : block.number, //the block number when the option was created
                expirationDate : _expirationDate * expirationTime, //up to the user when create the option. Need to informed in days.
                expired : false, //just creat the option
                executed: false, //just creat the option
                remainingAmountPaid: false
            }
        );
        if(_sidePosition == 0){
            require(_amount <= availableMarginCall[msg.sender], 'Not enough margin call');
            availableMarginCall[msg.sender] = availableMarginCall[msg.sender] - _amount; //updates the userMargin
            allocatedMarginCall[msg.sender] = allocatedMarginCall[msg.sender] + _amount;
        }else if(_sidePosition == 1){
            require(_amount <= availableMarginPut[msg.sender], 'Not enough margin put');
            availableMarginPut[msg.sender] = availableMarginPut[msg.sender] - _amount; //updates the userMargin
            allocatedMarginPut[msg.sender] = allocatedMarginPut[msg.sender] + _amount;
        }else {
            string message ='Should define 0 for call or 1 for put';
            return message;
        }
        
        options.push(option); //update the options array by pushin the struct above
        orderBook[id] = option; //update the orderBook with the option struct. This will be use in the next updates to have buy and sell functionality to the users       
}
    //internal function to send the CRG Tokens from buyer to initiator when the buyer purchases the option
    //the frontend dapp needs to request to the buyer to approve this contract to spend the money on his behalf by
    //callint the Approve function in the CRG Token (ERC20 standard)
    function _buyingTheOption(address _buyer, address _initiator, uint8 _premium) internal{
        IERC20(Token).transferFrom(_buyer, _initiator, _premium); //standard ERC20 transferFrom function
    }

    //called by the buyer to purchase an option    
    function EnterPosition (uint _id) public notExpired(_id) notExecuted(_id){
        Option memory _options = orderBook[_id];//initialize the option based on its recored in the orderBook
        address _initiator = _options.initiator;//instatiate the initiator to receive the premium payment
        uint8 premium = _options.premium; //instatiate the premium value
        _buyingTheOption(msg.sender, _initiator, premium);//call the internal function to send the CRG Tokens (premium payment) to the initiator
        _options.premiumPaid = true; //once Paid set the premium paid to true
        _options.buyer = payable (msg.sender);//update the orderBook setting the buyer as msg.sender
    }

    //if the initiator wants to shutdown the option as long as no one purchased it
    function shutDownOption(uint _id) public notExpired(_id) notExecuted(_id) {
        require(!orderBook[_id].premiumPaid, 'Option can not be removed');
        require(orderBook[_id].initiator == msg.sender, 'Caller is not the initiator');
        Option memory _options = orderBook[_id];
        uint _amount = _options.amount;
        _options.initiator = payable (0x0000000000000000000000000000000000000000);
        _options.buyer = payable (0x0000000000000000000000000000000000000000);
        if(orderBook[_id].sidePosition == 0){
            availableMarginCall[msg.sender] = availableMarginCall[msg.sender] + _amount; //updates the userMargin
            allocatedMarginCall[msg.sender] = allocatedMarginCall[msg.sender] - _amount;
        }else if(orderBook[_id].sidePosition == 1){
            availableMarginPut[msg.sender] = availableMarginPut[msg.sender] + _amount; //updates the userMargin
            allocatedMarginPut[msg.sender] = allocatedMarginPut[msg.sender] - _amount;
        }else {
            string message = 'Error';
            return message;
        }
    }

    //Chainlink PriceConsumer Returns the latest price for the ONE/USD testNet
    //shoud comment this function to run the dapp locally
    function getLatestPrice() public view virtual override returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

    //update the state variable checkedPrice
    //shoud comment this function to run the dapp locally
    function updateCheckPrice() public returns (int){
        checkedPrice = getLatestPrice();
        return checkedPrice; 
    }

    // //Use this function to run the dapp locally
    // function setCheckPrice(uint _inputedPrice) public{
    //     checkedPrice = _inputedPrice;
    // }
    
    // //Use this function to run the dapp locally
    // function updateCheckPrice() public returns (int){
    //     return checkedPrice; 
    // }

    

    //at the expiration date if the buyer want to settle its option he needs to pay the remaining amount. Val
    function calculatingRemaingAmount(uint _id) public view returns (uint){
        Option memory _options = orderBook[_id];
        uint amount = _options.amount;
        uint premium = _options.premium;
        uint total = amount * uint(checkedPrice);
        uint remainingAmount =  total - premium; 
        return remainingAmount;
    }

    //On the settlement event, if the buyer settles the option he needs to pays the remaining amount to the initiator using CRG Token.
    //At this poin the DAPP called the Approve function in the CRG Token
    function _sendRemainingAmountToInitiator(uint _id) internal {
        Option memory _options = orderBook[_id];
        address _buyer = _options.buyer;
        address _initiator = _options.initiator;
        uint remainingAmount = calculatingRemaingAmount();
        _options.expired = true;
        _options.executed = true;
        _options.remainingAmountPaid = true;
        IERC20(Token).transferFrom(_buyer, _initiator, remainingAmount);
    }

    //if the buyer settles the option, the contract transfers the native token to the buyer
    function _releaseAssetsToBuyer(uint _id) internal {
        Option memory _options = orderBook[_id];
        uint _amount = _options.amount;
        address payable _buyer = _options.buyer;
        address payable _initiator = _options.initiator;
        _buyer.transfer(_amount);
        allocatedMargin[_initiator] = allocatedMargin[_initiator] - _amount;
    }

    //in case a buyer paid the premium, however did not paid the remaining amount and the option is expired
    //the initiator is able to release allocated margin
    function releaseAllocatedMarginForAPremiumPaidExpiredOption(uint _id) public notExecuted(_id){
        require(orderBook[_id].remainingAmountPaid == true, 'Option can not be removed');
        require(orderBook[_id].initiator == msg.sender, 'Caller is not the initiator');
        Option memory _options = orderBook[_id];
        orderBook[_id].executed = true;
        uint _amount = _options.amount;
        _options.initiator = payable (0x0000000000000000000000000000000000000000);
        _options.buyer = payable (0x0000000000000000000000000000000000000000);
        availableMargin[msg.sender] = availableMargin[msg.sender] + _amount; //updates the userMargin
        allocatedMargin[msg.sender] = allocatedMargin[msg.sender] - _amount;

    }
    
    //check if the position is expired: should start using blocknumber
    //check who wons the bet. If initiator, nothing happens
        //If buyer: buyer needs to pay the diference spot-premium(use price feed), initiator receives de money
        //the contract send eth(one) to the buyer
    function Settlement (uint _id) public {
        Option storage _options = orderBook[_id];
        uint spotPrice = _options.futurePrice;
        checkedPrice = 10;
        if(spotPrice >= uint(checkedPrice)){
            require(remainingValueDeposited[_id] == true, 'Buyer needs to deposit the remaining value');
            _sendRemainingValueToInitiator(_id);
            _releaseAssetsToBuyer(_id);
            _options.expired = true ;
        }else{
            _options.expired = true ;
        }     
    }
}


