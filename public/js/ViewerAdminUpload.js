
//Start script when document is loaded in
$(document).ready(function () {

    var objectFile, textureFile;

    //file system listeners
    $("#browseObject").on('change', function (evt) {
        var files = evt.delegateTarget.files;
        objectFile = files[0];
    });
    $("#browseTexture").on('change', function (evt) {
        var files = evt.delegateTarget.files;
        textureFile = files[0];
    });

    //Listener for submit files button
    $("#submitBtn").on('click', function () {

        //hide the browse buttons
        $("#browseObject").hide();
        $("#browseTexture").hide();
        //show the loading bars
        $("#textureLoading").show();
        $("#objectLoading").show();


        // Add a new document with a generated id.
        firebase.firestore().collection("scanUploads").add({
            name: objectFile.name,
            description: "Some description here.",
            category: "Some Category",
            objectURL: "",
            textureURL: ""
        }).then(function (docRef) { //Save to database established
            console.log("Document written with ID: ", docRef.id);

            //Now save the files to storage with this docRef.id in URL
            firebase.storage().ref().child('Uploads/3dObjects/' + docRef.id + "/" + objectFile.name).put(objectFile).then(function (fileSnapshot) {
                // Now get the download URL for this object
                fileSnapshot.ref.getDownloadURL().then(function (url) {
                    //turn off the loading bar
                    $("#objectLoading").hide();
                    $("#objectIcon").html("done");
                    console.log("objectURL:" + url);

                    //now save url to the firebase database (firestore)
                    firebase.firestore().collection("scanUploads").doc(docRef.id).update({
                        objectURL: url
                    });

                });
            });
            firebase.storage().ref().child('Uploads/3dTextures/' + docRef.id + "/" + textureFile.name).put(textureFile).then(function (fileSnapshot) {
                //now get the download URL for this texture
                fileSnapshot.ref.getDownloadURL().then(function (url) {
                    //turn off the loading bar
                    $("#textureLoading").hide();
                    $("#textureIcon").html("done");
                    console.log("textureURL:" + url);

                    //now save url to the firebase database (firestore)
                    firebase.firestore().collection("scanUploads").doc(docRef.id).update({
                        textureURL: url
                    });

                });
            });

        }).catch(function (error) {
            console.error("Error adding document: ", error);
        });


    });


});