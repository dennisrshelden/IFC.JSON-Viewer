// UItable: creates a UI table 
// with a row for each element in  this.dataObjects and a column for each parameter in  this.parameterList
// !!MUST DO: ADD PAREMETERS YOU WANT DISPLAYED in this.parameterList in userDraw.js
//var this.parameterList = ["type", "name", "level", "rotation", ...];

class UITable {
    constructor(anObjectList, fieldlist, adiv) {
        this.dataObjects = anObjectList;
        this.parameterList = fieldlist;
        this.editButton = false;
        this.addButton = false;
        this.DOMobject = adiv;

    };
    // These are currently turned since copying an object through the dialogs isn't supported
    // The main redraw table function. Called when objects change or are added, selected, etc.
    refreshObjectTable() {
        let i, j;
        let objText = "";
        objText += "<h3> Object Properties";
        objText += "<form>";
        objText += "<table>";
        // make the header
        objText += "<tr>";
        for (j = 0; j < this.parameterList.length; j++) {
            objText += '<td class="param-title">';
            objText += this.parameterList[j];
            objText += "</td>";
        }
        objText += "</tr>";

        // make the table of editable object this.dataObjects fields
        for (i = 0; i < this.dataObjects.length; i++) { // for each object
            if (_selectedElement && _selectedID == i) objText += '<tr style="background-color: red;">';
            else objText += "<tr>";
            for (j = 0; j < this.parameterList.length; j++) { // for each value in the this.parameterList
                objText += "<td>";
                var value = this.dataObjects[i][this.parameterList[j]];
                var itemValue = i + "?" + this.parameterList[j];
                objText += '<input type="text" onchange="onEditValue(this.name, this.value)" name="' + itemValue + '" value="' + value + '">';
                objText += "</td>";
            }

            if (this.editButton) objText += '<td><button type="button" onclick="showEditTable(this.name, false)" name="' + i + '" > <img style="height:25px" src="static/assets/img/edit.png"> </td>';
            if (this.addButton) objText += '<td><button type="button" onclick="showEditTable(this.name, true)" name="' + i + '" > <img style="height:25px" src="static/assets/img/add.png"> </td>';
            objText += '<td><button type="button" onclick="onDeleteObject(this.name)" name="' + i + '" > <img style="height:15px" src="static/assets/img/delete.png"> </td>';
            objText += "</tr>";
        }
        objText += "</table><br>";
        // create new and edit don't make sense here. If they do, uncomment the next 2 lines.
        objText += "</form>";
        this.DOMobject.innerHTML = objText;
    }

    // Callback edit a single value through the edit box
    onEditValue(name, value) {
        // break out the object # and value
        var res = name.split("?");
        this.dataObjects[res[0]][res[1]] = value;
    }

    // delete an object where id is its index in the this.dataObjects array
    onDeleteObject(id) {
        // delete an object by number (row)
        this.dataObjects.splice(id, 1);
        refreshObjectTable();
    }

    // The rest below are used for the Popup Object edit table, not currely implemented but maybe in the future
    // Edit popup table. Not used if addButton = editButton = false
    showEditTable(i, isNew) {
        let j;
        var editDiv = document.getElementById("objCreateOrEdit");

        let objText = "";
        objText += "<form>";
        objText += "<table>";
        for (j = 0; j < this.parameterList.length; j++) {
            objText += "<tr><td>";
            // add the name
            objText += this.parameterList[j];
            objText += "</td><td>";
            // now add the input form element
            if (i == -1) objText += '<input type="text" id="' + this.parameterList[j] + '">';
            else objText += '<input type="text" id="' + this.parameterList[j] + '" value=' + this.dataObjects[i][this.parameterList[j]] + '>';
            objText += "</td></tr>";
        }
        objText += "</table><br>";
        // if isNew the OK button creates, if false it edits object this.dataObjects[i]
        if (isNew == true) objText += '<input type="button" onclick="onCreateObject()" value="CREATE" ></input>' + '&nbsp'
        else objText += '<input type="button" onclick="onEditObject(' + i + ')" value="EDIT" ></input>' + '&nbsp'
        objText += '<input type="button" onclick="onCancelObject()" value="CANCEL" ></input> '
        objText += "</form>";

        //console.log(objText);
        editDiv.innerHTML = objText;
        editDiv.style.visibility = "visible";
    }

    // ADD a new object, with values filled in from the editTable
    onCreateObject() {
        let newObj = new Object;
        for (j = 0; j < this.parameterList.length; j++) {
            //console.log(this.parameterList[j]);
            newObj[this.parameterList[j]] = document.getElementById(this.parameterList[j]).value;
        }
        //console.log(newObj);
        this.dataObjects.push(newObj);
        refreshObjectTable();
        document.getElementById("objCreateOrEdit").style.visibility = "hidden";
    }

    // EDIT button clicked in 
    onEditObject(i) {
        let obj = this.dataObjects[i];
        for (j = 0; j < this.parameterList.length; j++) {
            //console.log(this.parameterList[j]);
            obj[this.parameterList[j]] = document.getElementById(this.parameterList[j]).value;
        }
        //console.log(obj);
        refreshObjectTable();
        document.getElementById("objCreateOrEdit").style.visibility = "hidden";
    }

    // CANCEL button clicked
    onCancelObject() {
        document.getElementById("objCreateOrEdit").style.visibility = "hidden";
    }
}
