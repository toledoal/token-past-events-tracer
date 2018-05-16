## Curated Token Past Events Tracker
## ERC20 Token Explorer


![alt text](https://raw.githubusercontent.com/toledoal/week-2/master/explorer/blockexp/screenshot.png)

# Main Goal
I curated a list of ERC20 Tokens from the Ethereum Network to explore their past "transfer" events. The idea is to be able to extract raw information from the debug rpcapi and get insight on how the Token is being used
from a particular point of time (Block).

The application currently explores the blockchain and gets event information using GETH.

Also I extended web3 to use the debug API in order to get historial data. 
The process to harvest the historical data takes between 2 and 5 minutes, so I added a donwload button so 
people can have data.json copy. This eventually could be saved into a db for further analytics. 

## How to use it
1. Clone the react project git clone https://github.com/toledoal/token-past-events-tracer.git
2. npm install 
3. Explore the results and download data.json data. (The process takes between 2 or 5 minutes depending on historical data)

## You need a synced Ethereum node to run this project

## ToDo

1. Have a list of Tokens to display here: Choose 20,

get Token Address, Name, Symbol and Icon. (Not all tokens have symbol in their contracts)

2. Explore calls using web3 for getTransaction

3. Explore calls using web3 for Contract

4. Explore ABI for contracts and define to get information from ERC20 Token

5. Parse calls to get transactions, decode input and parse "transfers" from Token

6. Try to use Voronoi chart to map information from points (x: index, y: gas, size: value transfered of Token )

7. Show results

8. Extend web3 to use debug mode for transaction tracing

9. Implement d3 chart for information using nodes and arrow nodes

