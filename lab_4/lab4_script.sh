#!/bin/bash
# Authors : April Ott
# Date: 09/18/2020

cp /var/log/syslog /home/april/CSCI3308_dev/Labs_csci_3308/lab_4/sylog_copy.txt
                   
echo "email subject\n\n" > /home/april/CSCI3308_dev/Labs_csci_3308/lab_4/error_log_check.txt
 
egrep -i "(ERROR)|(error)|(Error)" /home/april/CSCI3308_dev/Labs_csci_3308/lab_4/sylog_copy.txt >> /home/april/CSCI3308_dev/Labs_csci_3308/lab_4/error_log_check.txt

sendmail apot7080@colorado.edu < /home/april/CSCI3308_dev/Labs_csci_3308/lab_4/error_log_check.txt
