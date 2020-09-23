import * as firebase from 'firebase';
import 'firebase/storage';
var firebaseConfig = {
    apiKey: "AIzaSyBttceR-a_8v4eBhOmNe8-GNeQITDnRUmE",
    authDomain: "findparagraph.firebaseapp.com",
    databaseURL: "https://findparagraph.firebaseio.com",
    projectId: "findparagraph",
    storageBucket: "findparagraph.appspot.com",
    messagingSenderId: "796880653179",
    appId: "1:796880653179:web:0648ea476587bf495d0bde"
  };
  // Initialize Firebase
   firebase.initializeApp(firebaseConfig);

  const storage= firebase.storage();
  export {
      storage, firebase as default
  }