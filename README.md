# Visually Explaining Uncertain Price Predictions in Agrifood: A User-Centred Case-Study

This repository contains additional materials for the paper [*Visually Explaining Uncertain Price Predictions in Agrifood: A User-Centred Case-Study*](https://doi.org/10.3390/agriculture12071024) (Agriculture, [Special Issue *Application of Decision Support Systems in Agriculture*](https://www.mdpi.com/journal/agriculture/special_issues/Decision_Support_Systems_Application)) by Jeroen Ooge and Katrien Verbert. Here is a brief overview of the folders in this repository.

 - **Images**. All the paper's images.
 - **R scripts**. Code for applying linear regression to a csv dataset with columns *product*, *country*, *price*, and *millisSinceEpoch* (the demo uses `data_original.csv`). This creates 2 json files:
   - `Visual DSS/private/dataset_predicted.json`: result of extending the original dataset with fit values and boundaries of uncertainty intervals.
   - `Visual DSS/private/products.json`: unique product names in the original dataset; used for speeding up the search field for products in our visual decision-support system.
 - **Visual DSS**. Code for our prototypical visual decision-support system, which allows exploring product prices in various countries. Besides visualising historical price evolutions, our system visualises predicted future prices and the prediction model's uncertainty.

<img alt="Selecting a food product in the upper left search field and getting details about the price and date upon hovering over the line chart." src="https://github.com/JeroenOoge/explaining-predictions-agrifood/blob/main/Images/hover1mouse.png" width="500px"> <img alt="Selecting countries in the upper right search field and getting a description of the hovered fan (\quote{In 80 out of 100 occasions, the product price lies between A and B.} where A and B are the lower and upper bounds of the prediction interval at the indicated date, respectively)." src="https://github.com/JeroenOoge/explaining-predictions-agrifood/blob/main/Images/hover2mouse.png" width="500px">

## Installation
Execute the following steps to run the visualisation on your machine. 

1. Install meteor: https://www.meteor.com/install
2. Execute the following commands:
```
git clone https://github.com/JeroenOoge/explaining-predictions-agrifood.git
cd './explaining-predictions-agrifood/Visual DSS'
meteor npm install
meteor
```
3. The visualisation is now running on http://localhost:3000/ and a Mongo database is situated at http://localhost:3001/
4. For first time use, follow these steps:
  * Have a look at the demo file `Visual DSS/private/dataset_predicted.json`. You can override this file with a json in which items contain attributes *product*, *country*, *price*, *millisSinceEpoch*, *fit*, *lwrX* and *uprX* (with X in 50, 55, ..., 95, 99).
  * Have a look at the demo file `Visual DSS/private/products.json`. You can override this file with a json in which items contain a single attribute *product*, listing all unique product names in `Visual DSS/private/dataset_predicted.json`.
  * If you want to apply linear regression to your own dataset similar to `data_original.csv`, modify and run the script `R scripts/Agriculture preprocessing.R`.
  * Load the databases `Visual DSS/private/dataset_predicted.json` and `Visual DSS/private/products.json` into local Mongo collections called Data and Products, respectively. Use software like [Robo 3T and Studio 3T](https://robomongo.org/download) or [MongoDB Compass](https://www.mongodb.com/products/compass). For speed, it is advisable to use the [command line](https://docs.mongodb.com/manual/reference/program/mongoimport/):
```
mongoimport --db meteor --collection products --file .\private\products.json --host localhost:3001
mongoimport --db meteor --collection data --file .\private\dataset_predicted.json --host localhost:3001
```
