import { useEffect, useState, useReducer } from 'react';
import './App.css';
import Auth from './components/auth';
import { db, auth, storage } from './config/firebase';
import {
	getDocs,
	collection,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

interface moviesI {
	releaseDate: number;
	title: string;
	id: string;
	genre: string;
}

function App() {
	const [movieList, setMovieList] = useState<any>();
	const [movieParams, setMovieParams] = useReducer(
		(state: any, action: any) => {
			return { ...state, ...action };
		},
		{ title: '', releaseDate: 0, genre: '', updateTitle: '', fileUpload: File }
	);

	const moviesCollectionRef = collection(db, 'movies');
	const getMovieList = async () => {
		try {
			const data = await getDocs(moviesCollectionRef);
			const filteredData = data.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setMovieList(filteredData);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getMovieList();
	}, []);

	const onSubmitMovie = async () => {
		const { title, releaseDate, genre } = movieParams;
		try {
			await addDoc(moviesCollectionRef, {
				title,
				releaseDate,
				genre,
				userId: auth?.currentUser?.uid,
			});
			getMovieList();
		} catch (error) {
			console.error(error);
		}
	};

	const deleteMovie = async (id: string) => {
		const movieDoc = doc(db, 'movies', id);
		try {
			await deleteDoc(movieDoc);
			getMovieList();
		} catch (error) {
			console.error(error);
		}
	};

	const updateMovieTitle = async (id: string) => {
		const movieDoc = doc(db, 'movies', id);
		try {
			await updateDoc(movieDoc, { title: movieParams.updateTitle });
			getMovieList();
		} catch (error) {
			console.error(error);
		}
	};

	const uploadFile = async () => {
		if (!movieParams.fileUpload[0]) return;

		const filesFolderRef = ref(
			storage,
			`projectFolder/${movieParams.fileUpload[0].name}`
		);

		try {
			await uploadBytes(filesFolderRef, movieParams.fileUpload[0]);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<Auth />
			<div>
				<input
					type="text"
					placeholder="Enter movie title..."
					onChange={(e) => setMovieParams({ title: e.target.value })}
				/>
				<input
					type="number"
					placeholder="Enter release date..."
					onChange={(e) => setMovieParams({ releaseDate: e.target.value })}
				/>
				<input
					type="text"
					placeholder="Enter genre..."
					onChange={(e) => setMovieParams({ genre: e.target.value })}
				/>
				<button onClick={onSubmitMovie}>Upload movie</button>
			</div>
			<div>
				{movieList &&
					movieList.map((movie: moviesI) => {
						return (
							<div key={movie.id}>
								<h1>{movie.title}</h1>
								<p>{movie.releaseDate}</p>
								<p>{movie.genre}</p>
								<button onClick={() => deleteMovie(movie.id)}>
									Delete movie
								</button>
								<input
									type="text"
									placeholder="change title"
									onChange={(e) =>
										setMovieParams({ updateTitle: e.target.value })
									}
								/>
								<button onClick={() => updateMovieTitle(movie.id)}>
									Update title
								</button>
							</div>
						);
					})}
			</div>
			<div>
				<input
					type="file"
					onChange={(e) => setMovieParams({ fileUpload: e.target.files })}
				/>
				<button onClick={uploadFile}>Upload file</button>
			</div>
		</div>
	);
}

export default App;
