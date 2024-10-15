import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/lib/firebase';

/**
 * Sign-up function to create a new user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user's account.
 * @returns {Promise<object>} A promise that resolves with the user object upon successful sign-up.
 * @throws {Error} If the sign-up process fails.
 */
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign-in function to log in a user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user's account.
 * @returns {Promise<object>} A promise that resolves with the user object upon successful sign-in.
 * @throws {Error} If the sign-in process fails.
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Sign-out function to log out the current user.
 *
 * @returns {Promise<void>} A promise that resolves when the sign-out process is complete.
 * @throws {Error} If the sign-out process fails.
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Listener to manage authentication state changes.
 *
 * @param {function} callback - The callback function that handles changes in authentication state.
 * @returns {function} A function that can be called to unsubscribe from the authentication state changes.
 */
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
