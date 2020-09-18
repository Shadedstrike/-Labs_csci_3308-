#!/bin/bash
# Author : April Ott
# Date: September 18, 2020
# Script follows here:
echo "File Name: $0"
echo "Command Line Argument 1: $1"
echo "Enter a number: "
grep $1 $2
read numOne
echo "Enter a second number: "
read numTwo
sum=$(($numOne + $numTwo))
echo "The sum is : $sum"
let prod=numOne*numTwo
echo "The product is: $prod"
