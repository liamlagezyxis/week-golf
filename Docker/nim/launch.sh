# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp

# Support errors
set +e

ls
ls in


cat in/prog.nim

cp in/prog.nim prog.nim

# Compile and get the message
error_message="$(nim c -r prog.nim)"

echo "$error_message"



# # If there is an error
if echo "$error_message" | grep -q "Error:"; then

    # Add the message to the error files
    for testcount in `seq 0 1 $countNbTest`; do
        echo "$error_message" > /tmp/out/err$testcount.txt
        touch /tmp/out/out$testcount.txt
    done

else 
    for testcount in `seq 0 1 $countNbTest`; do
        ./prog \
            < /tmp/in/input$testcount.txt \
            > /tmp/out/out$testcount.txt  \
            2> /tmp/out/err$testcount.txt
    done
fi
