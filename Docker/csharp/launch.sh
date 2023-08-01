# Get the number of test from args
countNbTest=$1

# Change directory
cd /tmp

# Support errors
set +e

# Create a directory for the project
mkdir proj 

# Change of dir
cd proj

# Create the project
dotnet new console

# Change the content of Program.cs
cat /tmp/in/prog.cs > Program.cs


# Compile and get the message
error_message="$(dotnet build)"



if echo "$error_message" | grep -q "Build FAILED."; then
    # If there is an error

    # Add the message to the error files
    for testcount in `seq 0 1 $countNbTest`; do
        echo "$error_message" > /tmp/out/err$testcount.txt
        touch /tmp/out/out$testcount.txt
    done

else 
    # Allowed to be executed
    chmod 100 /tmp/proj/bin/Debug/net7.0/proj.dll

    for testcount in `seq 0 1 $countNbTest`; do
        dotnet exec /tmp/proj/bin/Debug/net7.0/proj.dll \
            < /tmp/in/input$testcount.txt \
            > /tmp/out/out$testcount.txt  \
            2> /tmp/out/err$testcount.txt
    done
fi
