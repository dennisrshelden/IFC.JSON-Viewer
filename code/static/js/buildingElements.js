//import { NOTINITIALIZED } from "dns";

var itemCount = 0; // for automatic element naming

///////////////////////////////// BuildingElement Class (Abstract) ///////////////////////////////
// Abstract Class that defines all common or default behaviors for building elements /////////////
//// Actual used classes will likely extend LinearElement or the simpler PointElement classes ////
//////////////////////////////////////////////////////////////////////////////////////////////////
class BuildingElement {

    //Create a new BE instance given list of points, rotation and level. User overrideable - with care
    constructor(classname, itemData) {
        this.Color = _classData.find(x => x.Class === classname).Color;
        this.Opacity = _classData.find(x => x.Class === classname).Opacity;
        var itemkeys = Object.keys(itemData);

        var param;
        for (param in itemData) {
            //var aparam = itemData[param];
            _uniqueParams.add(param);
            this[param] = itemData[param];
            if (param == "Items") {
                var loader = new THREE.OBJLoader();
                var objstring = itemData[param][0];
                var result = loader.parse(objstring);
                for (var i = 0; i < result.children.length; i++) {

                    var child = result.children[i];
                    child.material.color = new THREE.Color(this.Color);
                    child.material.opacity = this.Opacity;
                    if (this.Opacity<1.0) child.material.transparent = true;
                    child.castShadow = true;
                    child.recieveShadow = true;
                }
                this["Mesh"] = result;
            }
        }

    };

    draw3D() {
        var retlist = [];
        if (this.Mesh) {
            var tempObj = this.Mesh.clone();

            for (var i = 0; i < tempObj.children.length; i++) {

                var child = tempObj.children[i];
                child.material.color = new THREE.Color(this.Color);
                child.material.opacity = this.Opacity;
                if (this.Opacity<1.0) child.material.transparent = true;
                child.castShadow = true;
                child.recieveShadow = true;
            }
            /*                for (var i = 0; i < tempObj.children.length; i++) {
                                var child = tempObj.children[i];
                                child.material.color = new THREE.Color(this.Color);
                                child.castShadow = true;
                                child.recieveShadow = true;
                            } */
            retlist.push(tempObj);
        }

        return retlist;
    }
}
