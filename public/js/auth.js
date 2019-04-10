//listen for auth status changes
auth.onAuthStateChanged(user => {
    //returns null if user is not logged in and true if they are logged in
    if(user){
        console.log('user logged in: ', user)
    }else{
        console.log('User logged out')
    }
});


//signup
//on button click

$("#credentialsSubmit").on('click', (e) => {
    //prevents refresh of page when button is pressed
    e.preventDefault();
    //set vars to value of text from fields
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
   // console.log(email);
    //from firebase API? this is asychronous (time of completion is not defined nor set) .then() makes a promise,
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
       // console.log(cred.user);
        console.log("done");
        alert("User created");

    });
});

//logout
$("#logout").on('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("logout")
        alert("logout succesful");
    })
}); 

//login
$("#loginSubmit").on('click', (e) => {
    //prevents refresh of page when button is pressed
    e.preventDefault();
    //set vars to value of text from fields
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
   // console.log(email);
    //from firebase API? this is asychronous (time of completion is not defined nor set) .then() makes a promise,
auth.signInWithEmailAndPassword(email, password).then(cred =>{
    //console.log(cred.user)
    //resert login fields

});
});