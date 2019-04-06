
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

        try {
          let app = firebase.app();
          let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
          document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
        } catch (e) {
          console.error(e);
          document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
        }
      
        //console.log(firebase);

        // Write to firebase db not Firestore
        /*
        var database = firebase.database();
        var ref = database.ref('3dObjects');

        

        var data = {
          name: "Arm",
          Path: "Test"
        }

        ref.push(data);
        */

       var firestore = firebase.firestore();

       const docRef = firestore.collection("3dObjects");
       
       const objectList = document.querySelector('#object-list');


       // create elements and render object list
       function renderObjectList(doc){
         let li = document.createElement('li');
         let content = document.createElement('span');
         let i = document.createElement('i');
         let Title = document.createElement('span');
         let Des = document.createElement('span');

         Title.textContent = doc.data().Title;
         Des.textContent = doc.data().Description;

         
         li.setAttribute('class', 'mdl-list__item mdl-ist__item--two-line');
         i.setAttribute('class', 'material-icons mdl-list__item-avatar');
         content.setAttribute('class', 'mdl-list__item-primary-content');
         Des.setAttribute('class', 'mdl-list__item-sub-title')

         li.setAttribute('data-id', doc.id);
         li.setAttribute('onclick',"viewObject(this)")

         i.innerText = "person";
         
         li.appendChild(content);
         //content.appendChild(i);
         content.appendChild(Title);
         //content.appendChild(Des);

         
         objectList.appendChild(li);

       }
       firestore.collection('3dObjects').get().then((snapshot) => {
         snapshot.docs.forEach(doc => {
           renderObjectList(doc);
         })
       })

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

      document.getElementById('load').innerHTML = "Loading: " + me.innerText;

      // wait 3 seconds before going to the viewer to allow the links to load.
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      location.href = './app.html'
    }

});




