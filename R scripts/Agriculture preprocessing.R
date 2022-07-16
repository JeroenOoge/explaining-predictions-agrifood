source("Agriculture functions.R")

data = read.csv("data_original.csv", encoding = "UTF-8")

# Save product names
products = data.frame(product = unique(data$product))
save.json(products, "../Visual DSS/private/products.json")

# Predict prices
data.prediction = predict.all(data, c(seq(0.50, 0.95, 0.05), 0.99), 3, 60, "prediction")
save.json(data.prediction, "../Visual DSS/private/dataset_predicted.json")
