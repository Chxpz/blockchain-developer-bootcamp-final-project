# Option Trade DAPP

Options plays a importan role in the Cefi market.
In the crypto space either the cost of opportunity and transactions are high or traders need to trust in CEX to trade options.

A DAPP to allow traders to create and trade options is benefitial.

###The simplest version

At this point as a MVP, a very simple solution to test some assumptions is required.
The DAPP itself at the v.0.1 will not allow traders to set any strategy such as:

* Covered Call.
* Married Put.
* Bull Call Spread.
* Bear Put Spread.
* Protective Collar.
* Long Straddle.
* Long Strangle.
* Long Call Butterfly Spread
* etc

Traders can still doing it but "off-book" and offchain, and of course wait for the futures updates in the DAPP.

This version will allow traders to create call and sell option by depositing ETH and setting the premium, future value of the underlying asset and the date they want to settle the position. 

When other traders puchase thoose options (a `call` or a `put`) they need to pay the premium. The trader who sells the option receive the premim at this point.

The DAPP precify the options but the final price is determined by the market.

At the option expiration date, the buyer can choose to claim the asset by payment the difference between the asset price `-` premium. If not the seller is able to withdraw the underlying asset.

Although we are aware of several limitations of this DAPP, this is a fiseable MVP to be tested. 
