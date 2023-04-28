import { auth, googleProvider } from '../config/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import { useState } from 'react';

const Auth = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// console.log(auth.currentUser?.email);

	const signIn = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.error(error);
		}
		setEmail('');
		setPassword('');
	};

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (error) {
			console.error(error);
		}
	};

	const logOut = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<input
				type="text"
				placeholder="Email..."
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password..."
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={signIn}>Sign in</button>
			<button onClick={signInWithGoogle}>Sign in with Google</button>
			<button onClick={logOut}>Log out</button>
		</div>
	);
};

export default Auth;
