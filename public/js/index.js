
document.addEventListener('DOMContentLoaded', function() {
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        //
        firebase.auth().onAuthStateChanged(user => { });
        // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
        // firebase.messaging().requestPermission().then(() => { });
        // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
        //
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

        // Establish connection with Firebase Firestore
        try {
          let app = firebase.app();
          let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
          document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
        } catch (e) {
          console.error(e);
          document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
        }
      

       var firestore = firebase.firestore();

       // Refrence what collection to read from
       const docRef = firestore.collection("3dObjects");
       
       // Refrence the table ID in index.html
       const objectList = document.querySelector('#object-list');



       // Bulid a table entry DOM template
       function renderObjectList(doc){

         let li = document.createElement('li');
         let content = document.createElement('span');
         let i = document.createElement('i');
         let Title = document.createElement('span');
         let Des = document.createElement('span');

         Title.textContent = doc.data().Title;
         Des.textContent = doc.data().Description;

         // set CSS atribuites
         li.setAttribute('class', 'mdl-list__item mdl-ist__item--two-line');
         i.setAttribute('class', 'material-icons mdl-list__item-avatar');
         content.setAttribute('class', 'mdl-list__item-primary-content');
         Des.setAttribute('class', 'mdl-list__item-sub-title')

         // Save the Unique ID of the item pulled from the Firestore as an attribute
         li.setAttribute('data-id', doc.id);

         li.setAttribute('onclick',"viewObject(this)")

         // Set person icon
         i.innerText = "person";
         
         // Colapse all DOMs together
         li.appendChild(content);
         content.appendChild(Title);
         objectList.appendChild(li);

       }

       // For each object found in the 3dObjects collection, create a table entry for them and output it to index.html
       firestore.collection('3dObjects').get().then((snapshot) => {
         snapshot.docs.forEach(doc => {
           // Pass object information to the renderObjectList function
           renderObjectList(doc);
         })
       })


    // This function does a call to the storage component of Firebase and save the download URL to session storage
    // Session storage is used instead of Local storage to allow the user to have multiple instances of the app open on one device
    /*
        Javascript does not run your code line by line. (Syncronisly) It will not wait for one operation to finish before it starts another.
        We use the async flag to allow us to do an 'await' for 3 seconds allowing the app to fetch the download links before redirecting to the next page
    */
    viewObject = async function(me){
      // Get Firebase ID from saved attribute
      var objID = me.getAttribute("data-id");
        
      // Save material.jpg link to session storage
      firebase.storage().ref('3dObjects/' + objID + '/material.jpg').getDownloadURL().then((obj) => {
        sessionStorage.setItem('material-image', obj);
      });

      // Save High_Res.obj link to session storage
      firebase.storage().ref('3dObjects/' + objID + '/High_Res.obj').getDownloadURL().then((obj) => {
        sessionStorage.setItem('object-file', obj);
      });

      // Save propterties.mtl to session storage
      firebase.storage().ref('3dObjects/' + objID + '/properties.mtl').getDownloadURL().then((obj) => {
        sessionStorage.setItem('material-peroperties', obj);
      });

      // Notify the user that we are loading (waiting for the URLs to be fetched)
      document.getElementById('load').innerHTML = "Loading: " + me.innerText;

      // wait 3 seconds before going to the viewer to allow the links to load.
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      location.href = './app.html'
    }

});




