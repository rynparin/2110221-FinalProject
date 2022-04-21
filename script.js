'use strict';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDyo66tdyy-b-K6CWsU2ZvhbDISWVsW9gY',
	authDomain: 'testfirebase-b134a.firebaseapp.com',
	projectId: 'testfirebase-b134a',
	storageBucket: 'testfirebase-b134a.appspot.com',
	messagingSenderId: '183798996478',
	appId: '1:183798996478:web:f994edb5885dcbc7e134af',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// =======================================================
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js';

const db = getFirestore();
const commentsRef = collection(db, 'comments');
const questionsRef = collection(db, 'questions');
const tagsRef = collection(db, 'tags');
const usersRef = collection(db, 'users');
const oldquestionRef = collection(db, 'oldquestion');
var isLogin = false;
var inactiveStatus = false;
var numberOfQuestion = {
	"FOREIGN_LANGUAGES":  1,
	"MATH":  1,
	"P.E.":  1,
	"ART":  1,
	"HISTORY":  1,
	"SCIENCE":  1,
	"SOCIAL_STUDIES":  1,
	"GEOGRAPHY":  1,
	"OTHERS":  1,
	"TECHNOLOGY":  1
};

function openForm() {
	document.getElementById('myForm').style.visibility = 'visible';
	console.log('click');
}

function closeForm() {
	document.getElementById('myForm').style.visibility = 'hidden';
}

document.querySelector('.open-button').addEventListener('click', openForm);

document
	.querySelector('.popup__close-button')
	.addEventListener('click', closeForm);

function generateQuestion() {
	var question_text = document.getElementById("txt").value;
	var type = document.getElementById("types").value;
	var element = document.getElementById(type);
	const firstname = document.getElementById("firstname").value;
	const lastname = document.getElementById("lastname").value;
	const studentId = document.getElementById("studentId").value;
	if (question_text != "" && type != "CHOOSE CATEGORY") {
		element.innerHTML += '<div class="parent"><div class="child"><div class="number">' + numberOfQuestion[type] +'</div></div><div class="child"><div class="message">' + question_text + '<div class="comments"><button type="button" class="num_comment">comments</button></div></div></div></div>';
		numberOfQuestion[type] += 1;
		addDoc(oldquestionRef, {
			type,
			question_text
		});
		document.getElementById("txt").value = "";
		return false;
	}
	alert("Please make sure that you have already typed the question and selected the category of the question.");
	return false;
}
window.generateQuestion = generateQuestion;

function changeStyle(){
    var element = document.getElementById("mainElement");
    if (isLogin) {
    	element.style.opacity = "100";
    	return false;
    }
    else {
    	element.style.opacity = "0";
    	return false;
    }
}
window.changeStyle = changeStyle;


async function validate(){
	const firstname = document.getElementById("firstname").value;
	const lastname = document.getElementById("lastname").value;
	const studentId = document.getElementById("studentId").value;
	if ( !isLogin && firstname != "" && lastname != "" && studentId.length == 10 ){
		document.getElementById("welcome-msg").innerHTML = "welcome to STUDYTOGETHER";
		isLogin = true;
		changeStyle();
		addDoc(usersRef, {
			studentId,
        	firstname,
        	lastname
    	});
    	if (!inactiveStatus) generateOldQuestion();
    	return false;
	}
	else if ( !isLogin && firstname != "" && lastname != "" && studentId.length != 10 ){
		alert("Please make sure that your student ID is 10-digit number.");
		return false;
	}
	else{
		isLogin = false;
		document.getElementById("welcome-msg").innerHTML = "Please login before asking question !!!";
		document.getElementById("firstname").value = "";
		document.getElementById("lastname").value = "";
		document.getElementById("studentId").value = "";
		changeStyle();
		inactiveStatus = true;
		return false;
	}
	return false;
}
window.validate = validate;

async function generateOldQuestion() {
	const items =  await getDocs(oldquestionRef);
	if (items) {
		const oldquestion = items.docs.map((item) => ({
        	...item.data()
    	}));
    	console.log(oldquestion);

    	for (let i = 0; i < oldquestion.length; i++) {
    		var element = document.getElementById(oldquestion[i].type);
  			element.innerHTML += '<div class="parent"><div class="child"><div class="number">' + numberOfQuestion[oldquestion[i].type]++ +'</div></div><div class="child"><div class="message">' + oldquestion[i].question_text + '<div class="comments"><button type="button" class="num_comment">comments</button></div></div></div></div>';
			// console.log(oldquestion[i].type);
			// console.log(oldquestion[i].question_text);
		}
	}
}
window.generateOldQuestion = generateOldQuestion;
