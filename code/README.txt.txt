IFC.JSON Web Viewer

This application uses node.js and express. To install:
Open Visual Studio Code to the root folder
Open a Terminal window

This will install the necessary express and other libraries:
>>npm install .

This will run the application:
>> node app.js

In a web browser, navigate to 127.0.0.1:3000

Some "search strings"
$..
$..[?(@.Class=='Wall')]
$..[?(@.Class=='Slab')]
$..[?(@.Class=='Space')]
$..[?(@.Class=='FurnishingElement')]
$..[?(@.CompositionType=='.ELEMENT.')]
$..[?(@.isExternal==true)]
$..[?(@.Manufacturer=='Manufacturer')]
$..[?(@.Level=='Level 2')]
$..[?(@.Class == 'Slab' || @.Class == 'FurnishingElement')]
$..[?(@.Class == 'Slab' || @.Class == 'FurnishingElement' || @.Class == 'Wall')]

contact dennisrobertshelden@gmail.com with questions or comments.
