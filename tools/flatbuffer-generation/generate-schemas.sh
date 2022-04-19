#!/bin/bash

# Listing flatbuffer files
base_path="${PWD}/src/components/legacy/flatbuffer/fbs/"
docker_path="/flatbuffer/fbs"
for file in ${PWD}/src/components/legacy/flatbuffer/fbs/*.fbs
do
filename=$(basename -- "$fullfile")
list_of_files+=" $docker_path/${file:${#base_path}}"
done

echo "> Flatbuffer: Generating the next files $list_of_files"

# Remove old files
rm -rf ${PWD}/src/components/legacy/flatbuffer/fb-generated/* || true

# Generate files
docker run -u $(id -u):$(id -g) -v ${PWD}/src/components/legacy/flatbuffer:/flatbuffer neomantra/flatbuffers flatc --gen-object-api --csharp --ts -o /flatbuffer/fb-generated $list_of_files