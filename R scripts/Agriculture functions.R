library(dplyr)
library(tidyr)
library(purrr)
library(jsonlite)

# Save data as json
save.json = function(data, name) {
  stream_out(data, file(name))
}

# Prepare data for regression by adding n extra rows
make.regressable = function(data, n) {
  millis = data$millisSinceEpoch
  last = millis[length(millis)]
  dates.future = seq(
    as.POSIXct(last / 1000, origin = "1970-01-01", tz = 'UTC'),
    by = 'months',
    length = n + 1
  )
  millis.future = as.numeric(dates.future[2:(n + 1)]) * 1000
  to.regress = data.frame(millisSinceEpoch = millis.future, price = NA) %>%
    mutate(country = rep(data.frame(data$country)[1,], n)) %>%
    mutate(product = as.character(rep(data.frame(data$product)[1,], n)))
  data.new = bind_rows(data, to.regress)
  return(data.new)
}

# Compute predictions for a specific product in a specific country
predict.country = function(data, levels, degree, n, type) {
  data = data[order(data$millisSinceEpoch),]
  if (nrow(data) >= 36) {
    data.regression = make.regressable(data, n)
    model = lm(data.regression$price ~ poly(data.regression$millisSinceEpoch, degree))
    data.predicted = data.frame(fit = predict(model, newdata = data.regression)) %>%
      mutate(fit = if_else(fit < 0, 0, fit))
    for (level in levels) {
      l = substr(format(level, nsmall = 2), 3, 4)
      ci = data.frame(predict(
        model,
        newdata = data.regression,
        interval = type,
        level = level
      )) %>%
        mutate(upr = if_else(upr < 0, 0, upr)) %>%
        mutate(lwr = if_else(lwr < 0, 0, lwr)) %>%
        select(lwr, upr) %>%
        rename(!!paste0("upr", l, sep = "") := upr) %>%
        rename(!!paste0("lwr", l, sep = "") := lwr)
      data.predicted = cbind(data.predicted, ci)
    }
    return(bind_cols(data.regression, data.predicted))
  } else {
    return(NULL)
  }
}

# Compute predictions for a specific product in all countries
predict.product = function(data, levels, degree, n, type) {
  countries = unique(data$country)
  data.predicted = data.frame()
  for (c in countries) {
    data.country = data %>% filter(country == c)
    prediction = predict.country(data.country, levels, degree, n, type)
    if (!is.null(prediction)) {
      data.predicted = bind_rows(data.predicted, prediction)
    }
  }
  return(data.predicted)
}

# Compute predictions for all products in all countries
#   data:   dataset that should be expanded with predictions
#   levels: array of confidence levels for predictions
#   degree: degree of the polynome for the regression
#   n:      number of predictions
#   type:   type of interval = "confidence" or "prediction"
predict.all = function(data, levels, degree, n, type = "confidence") {
  data.predicted = data.frame()
  for (p in unique(data$product)) {
    data.product = data %>%
      filter(product == p)
    prediction = predict.product(data.product, levels, degree, n, type)
    if (!is.null(prediction)) {
      data.predicted = bind_rows(data.predicted, prediction)
    }
  }
  return(data.predicted)
}