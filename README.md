# IFC.JSON Viewer

## What is it?
This viewer is part of an open source project that works on IFC files represented in JSON syntax: IFC.JSON files. The viewer is an open-source web-based viewer, relying on Javascript. It allows loading IFC.JSON files and viewing them (3D building models and semantics). Furthermore, data can be queried and subsets can be created for information exchanges in JSON format. This is done by filtering using JSONPath text filters (https://jsonpath.com/).

Sample IFC.JSON files are provided in the [sample_files directory](sample_files). These files are obtained using the Trimble Sketchup exporter by Jan Brouwer (BIMTools): https://github.com/BIM-Tools/Sketchup-ifcJSON-export.

## Requirements
The app has the following requirements:
- node.js version xxx
- npm version XXX

## Installation
Follow these steps to install the software:

- Download the code from this GitHub repository.
- Unpack file contents.
- Open a Command Line Interface (CLI), Terminal or Command Prompt in the main folder.
- Run the below command:
~~~~
> npm install
~~~~

## Getting started
- Open a Command Line Interface (CLI), Terminal or Command Prompt in the main folder.
- Run the below command:
~~~~
> npm start
~~~~
- Go to http://localhost:8000/.
- The software opens an IFC.JSON file by default, after which you can start filtering and querying the data in the viewer.


## Using the Viewer


## License
The IFC.JSON Viewer is made available under the MIT licence. See [LICENSE](LICENSE).

## Contact
Dennis Shelden  
Rensselaer Polytechnic Institute  
sheldd@rpi.edu